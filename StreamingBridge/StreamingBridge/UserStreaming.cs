using StreamingBridge.Packet;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;

namespace StreamingBridge
{
	public class UserStreaming
	{
		private static UserStreaming _instence;
		public static UserStreaming instence { get { if (_instence == null) _instence = new UserStreaming(); return _instence; } }
		private UserStreaming() { token = ct.Token; }
		private StreamReader streamRead;
		private Stream stream;
		public bool isConnectedStreaming { get; private set; } = false;

		private CancellationTokenSource ct = new CancellationTokenSource();
		private CancellationToken token;

		public delegate void DUserstreamChangedStatus(bool isConnected);
		public event DUserstreamChangedStatus OnChangedStatus = null;
	

		public void ConnectUserStreaming()
		{
			PacketUserStream parameter = new PacketUserStream();
			Task t = Task.Factory.StartNew(new Action((() => SyncStreaming(parameter))), token);
			t.ContinueWith(TaskComplete);
		}

		private void TaskComplete(Task obj)
		{

		}

		public void DisconnectStreaming()
		{
			streamRead?.Dispose();
			ct?.Cancel();
			ct = new CancellationTokenSource();
			if (ct != null)
				token = ct.Token;
		}

		private async void SyncStreaming(BasePacket parameter)
		{
			bool isRunStreaming = true;
			int retryCount = 0;
			while (isRunStreaming)
			{
				HttpWebRequest req;
				if (parameter.method == "POST")
					req = (HttpWebRequest)WebRequest.Create(parameter.url);
				else//GET일 경우
					req = (HttpWebRequest)WebRequest.Create(parameter.MethodGetUrl());
				try
				{
					req.Proxy = new WebProxy("localhost", 8811);
					req.ContentType = "application/x-www-form-urlencoded;encoding=utf-8";
					req.Method = parameter.method;
					req.Headers.Add("Authorization", OAuth.instence.GetHeader(parameter));
					req.ContentLength = -1;
				}
				catch (Exception e)
				{
					isRunStreaming = false;
					retryCount++;
					await Task.Delay(TimeSpan.FromSeconds(5));
				}
				try
				{
					using (WebResponse response = req.GetResponse())
					using (stream = response.GetResponseStream())
					using (streamRead = new StreamReader(stream))
					{
						string json;
						BridgeManager.instence.ConnectionChanged(true);
						while ((json = streamRead.ReadLine()) != null)
						{
							if (string.IsNullOrWhiteSpace(json)) continue;
							BridgeManager.instence.ResponseJson(json);
						}
					}
				}
				catch (WebException e)
				{
					BridgeManager.instence.ConnectionChanged(false);
				}
				catch (Exception e)
				{
					BridgeManager.instence.ConnectionChanged(false);
				}
				finally
				{
					BridgeManager.instence.ConnectionChanged(false);
					await Task.Delay(TimeSpan.FromSeconds(5));
				}
			}
		}
	}
}

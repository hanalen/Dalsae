using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using StreamingBridge.Hubs;
using Microsoft.AspNetCore.SignalR.Client;
using System.Threading.Tasks;
using System.IO;
using System.Windows.Forms;

namespace StreamingBridge
{
	public class BridgeManager
	{
		private static BridgeManager _instence = new BridgeManager();
		public static BridgeManager instence { get { return _instence; } }

		HubConnection connection;
		public void Start()
		{
			StartHub();
		}

		private async void StartHub()
		{
			connection = new HubConnectionBuilder()
			  .WithUrl("http://localhost:5001/TweetHub")
			  .Build();
			await connection.StartAsync();
			connection.Closed += Connection_Closed;
			connection.Reconnected += Connection_Reconnected;
			connection.Reconnecting += Connection_Reconnecting;
			var v1 = connection.HandshakeTimeout;
			var v2 = connection.ServerTimeout;
			var v3 = connection.KeepAliveInterval;
			connection.HandshakeTimeout = TimeSpan.FromSeconds(60);
			connection.ServerTimeout = TimeSpan.FromSeconds(60);
			connection.KeepAliveInterval = TimeSpan.FromSeconds(60);
		}

		private Task Connection_Reconnecting(Exception arg)
		{
			Log("Reconnecting");
			Log(arg);
			return null;
		}

		private Task Connection_Reconnected(string arg)
		{
			Log("Reconnected");
			Log(arg);
			return null;
		}

		private async Task Connection_Closed(Exception arg)
		{
			Log("Connection Closesd");
			Log(arg);
			await Task.Delay(3000);
			await connection.StartAsync();
		}

		private BridgeManager()
		{
			//UserStreaming.instence.ConnectUserStreaming();
		}

		public void ConnectionChanged(bool isConnected)
		{
			Form1 form = Application.OpenForms[0] as Form1;
			if (form != null)
			{
				form.ConnectionChanged(isConnected);
			}
		}
		private static readonly object obj = new object();
		List<string> listMsg = new List<string>();
		public async void ResponseJson(string json)
		{
			listMsg.Add(json);
			Form1 form = Application.OpenForms[0] as Form1;
			if (form != null)
			{
				form.Recv();
			}
			//lock (obj)
			//{
			//	using (FileStream fs = new FileStream(@"Recv.txt", FileMode.Append))
			//	using (StreamWriter writer = new StreamWriter(fs))
			//	{
			//		writer.WriteLine(json);
			//		writer.Flush();
			//	}
			//}
			try
			{
				for(int i = 0; i < listMsg.Count; i++)
				{
					if(connection.State == HubConnectionState.Connected)
					{
						await connection.SendAsync("ResponseStreaming", listMsg[i]);
						listMsg.RemoveAt(i);
					}
				}
			}
			catch(Exception e)
			{
				Log(e);
			}
		}

		public void Log(string msg)
		{
			lock (obj)
			{
				using (FileStream fs = new FileStream(@"Log.txt", FileMode.Append))
				using (StreamWriter writer = new StreamWriter(fs))
				{
					writer.WriteLine($"{DateTime.Now.ToShortTimeString()}: {msg}");
					writer.Flush();
				}
			}
		}

		public void Log(Exception e)
		{
			lock (obj)
			{
				using (FileStream fs = new FileStream(@"Log.txt", FileMode.Append))
				using (StreamWriter writer = new StreamWriter(fs))
				{
					writer.WriteLine($"{DateTime.Now.ToShortTimeString()}: {e.Message}");
					writer.WriteLine($"{DateTime.Now.ToShortTimeString()}: {e.StackTrace}");
					writer.Flush();
				}
			}
		}
	}
}

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

		private async Task Connection_Reconnecting(Exception arg)
		{
			LogManager.Log("Reconnecting");
			LogManager.Log(arg);
		}

		private async Task Connection_Reconnected(string arg)
		{
			LogManager.Log("Reconnected");
			LogManager.Log(arg);
		}

		private async Task Connection_Closed(Exception arg)
		{
			LogManager.Log("Connection Closesd");
			LogManager.Log(arg);

			while (true)
			{
				try
				{
					await connection.StartAsync();
					break;
				}
				catch(Exception e)
				{
					LogManager.Log(e);
					await Task.Delay(3000);
				}
			}
		}

		private BridgeManager()
		{
			//UserStreaming.instence.ConnectUserStreaming();
		}

		public void ConnectionChanged(bool isConnected)
		{
			Form1 form = Application.OpenForms[0] as Form1;
			if (form != null)
				form.ConnectionChanged(isConnected);
		}

		List<string> listMsg = new List<string>();
		public async void ResponseJson(string json)
		{
			listMsg.Add(json);
			Form1 form = Application.OpenForms[0] as Form1;
			if (form != null)
				form.Recv();
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
				LogManager.Log(e);
			}
		}
	}
}

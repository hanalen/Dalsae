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
			connection.Closed += async (error) =>
			{
				await Task.Delay(3000);
				await connection.StartAsync();
			};
		}

		private BridgeManager()
		{
			//UserStreaming.instence.ConnectUserStreaming();
		}

		public void ConnectionChanged(bool isConnected)
		{

		}

		public async void ResponseJson(string json)
		{
			//await connection.InvokeAsync<string>("ResponseJson", json);
			await connection.SendAsync("ResponseStreaming", json);
			//await connection.InvokeAsync("ResponseJson", json);
			//await TweetHub.instence.ResponseStreaming(json);
			Debug.Print(json);
		}



	}
}

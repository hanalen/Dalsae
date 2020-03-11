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
			Form1 form = Application.OpenForms[0] as Form1;
			if (form != null)
			{
				form.ConnectionChanged(isConnected);
			}
		}
		private static readonly object obj = new object();
		public async void ResponseJson(string json)
		{
			Form1 form = Application.OpenForms[0] as Form1;
			if (form != null)
			{
				form.Recv();
			}
			else
			{
				Debug.Print("Resv Form NULL");
			}
			lock (obj)
			{
				using (FileStream fs = new FileStream(@"Recv.txt", FileMode.Append))
				using (StreamWriter writer = new StreamWriter(fs))
				{
					writer.WriteLine(json);
					writer.Flush();
				}
			}
			connection.SendAsync("ResponseStreaming", json);
		}



	}
}

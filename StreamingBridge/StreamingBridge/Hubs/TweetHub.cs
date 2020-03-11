using Microsoft.AspNetCore.SignalR;
using StreamingBridge.Packet;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing.Imaging;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace StreamingBridge.Hubs
{
	public class TweetHub:Hub
	{
		public override Task OnDisconnectedAsync(Exception exception)
		{
			LogManager.Log(exception);
			return base.OnDisconnectedAsync(exception);
		}
		public override Task OnConnectedAsync()
		{
			return base.OnConnectedAsync();
		}
		public async Task Keys(string publicUserKey, string secretUserKey, string publicAppKey, string secretAppKey)
		{
			OAuth.instence.SetKey(publicAppKey, secretAppKey, publicUserKey, secretUserKey);
		}

		public async Task StopStreaming()
		{
			UserStreaming.instence.DisconnectStreaming();
		}
		private static readonly object obj = new object();

		public async Task ResponseStreaming(string json)
		{
			Form1 form = Application.OpenForms[0] as Form1;
			if (form != null)
				form.Send();
			Clients.All.SendAsync("ResponseStreaming", json);
		}

	}
}

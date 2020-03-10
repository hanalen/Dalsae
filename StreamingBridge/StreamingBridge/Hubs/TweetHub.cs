using Microsoft.AspNetCore.SignalR;
using StreamingBridge.Packet;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace StreamingBridge.Hubs
{
	public class TweetHub:Hub
	{
		public override Task OnConnectedAsync()
		{
			return base.OnConnectedAsync();
		}
		public async Task Keys(string publicUserKey, string secretUserKey, string publicAppKey, string secretAppKey)
		{
			OAuth.instence.SetKey(publicAppKey, secretAppKey, publicUserKey, secretUserKey);
		}

		public async Task ResponseStreaming(string json)
		{
			await Clients.All.SendAsync("ResponseStreaming", json);
		}
	}
}

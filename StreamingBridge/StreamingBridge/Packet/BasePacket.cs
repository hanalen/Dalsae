using System;
using System.Collections.Generic;
using System.Text;

namespace StreamingBridge.Packet
{
	public class BasePacket
	{
		public bool isMore { get; set; } = false;
		public string url { get; set; }
		public string method;
		public Dictionary<string, string> dicParams = new Dictionary<string, string>();

		public string MethodGetUrl()
		{
			StringBuilder sb = new StringBuilder();
			sb.Append(url);
			sb.Append("?");
			foreach (string item in dicParams.Keys)
			{
				sb.Append(item);
				sb.Append("=");
				sb.Append(Uri.EscapeDataString(dicParams[item]));
				sb.Append("&");
			}
			sb.Remove(sb.Length - 1, 1);

			return sb.ToString();
		}
	}
}

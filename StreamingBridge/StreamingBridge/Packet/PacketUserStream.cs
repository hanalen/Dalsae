using System;
using System.Collections.Generic;
using System.Text;

namespace StreamingBridge.Packet
{
	public class PacketUserStream : BasePacket
	{
		public PacketUserStream()
		{
			url = "https://userstream.twitter.com/1.1/user.json";
			method = "GET";
		}
		public string delimited { get { return dicParams["delimited"]; } set { dicParams["delimited"] = value.ToString(); } }
		public string stall_warnings { get { return dicParams["stall_warnings"]; } set { dicParams["stall_warnings"] = value.ToString(); } }
		public string with { get { return dicParams["with"]; } set { dicParams["with"] = value.ToString(); } }
		public string replies { get { return dicParams["replies"]; } set { dicParams["replies"] = value.ToString(); } }
		public string track { get { return dicParams["track"]; } set { dicParams["track"] = value.ToString(); } }
		public string locations { get { return dicParams["locations"]; } set { dicParams["locations"] = value.ToString(); } }
		public string stringify_friend_ids { get { return dicParams["stringify_friend_ids"]; } set { dicParams["stringify_friend_ids"] = value.ToString(); } }
	}
}

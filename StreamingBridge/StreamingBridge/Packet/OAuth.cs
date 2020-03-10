using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace StreamingBridge.Packet
{
	public class OAuth
	{
		private static OAuth _instence=new OAuth();

		private Dictionary<string, string> dicParameter = new Dictionary<string, string>();
		private static readonly object lockObject = new object();
		public static OAuth instence { get { return _instence; } }

		private string appPublicKey { get; set; }
		private string appSecretKey { get; set; }
		private string userPublicKey { get; set; }
		private string userSecretKey { get; set; }

		public string OAuthConsumerKey//포함
		{
			get { return dicParameter["oauth_consumer_key"]; }
			set { dicParameter["oauth_consumer_key"] = value; }
		}

		public string OAuthConsumerSecret
		{
			get { return dicParameter["oauth_consumer_secret"]; }
			set { dicParameter["oauth_consumer_secret"] = value; }
		}

		public string OAuthTimestamp//포함
		{
			get { return dicParameter["oauth_timestamp"]; }
			set { dicParameter["oauth_timestamp"] = value; }
		}

		public string OAuthNonce//포함
		{
			get { return dicParameter["oauth_nonce"]; }
			set { dicParameter["oauth_nonce"] = value; }
		}

		public string OAuthSignatureMethod//포함
		{
			get { return dicParameter["oauth_signature_method"]; }
			set { dicParameter["oauth_signature_method"] = value; }
		}

		public string OAuthSignature//hash낸 값...?
		{
			get { return dicParameter["oauth_signature"]; }
			set { dicParameter["oauth_signature"] = value; }
		}

		public string OAuthToken//포함
		{
			get { return dicParameter["oauth_token"]; }
			set { dicParameter["oauth_token"] = value; }
		}

		public string OAuthVersion//포함
		{
			get { return dicParameter["oauth_version"]; }
			set { dicParameter["oauth_version"] = value; }
		}

		public OAuth()
		{
			this.OAuthConsumerKey = "UjAH18zoBIuNDxMoENWurP3AO";
			this.OAuthSignatureMethod = "HMAC-SHA1";//트위터에서 사용하는 메소드 이름
			this.OAuthSignature = "";
			this.OAuthVersion = "1.0";
		}

		public void SetKey(string publicAppKey, string appSecret, string userPublic, string userSecret)
		{
			this.OAuthConsumerSecret = appSecret;
			this.OAuthToken = userPublic;
			this.appPublicKey = publicAppKey;
			this.appSecretKey = appSecret;
			this.userPublicKey = userPublic;
			this.userSecretKey = userSecret;
			UserStreaming.instence.ConnectUserStreaming();
		}

		public string GetHeader(BasePacket parameter)
		{
			lock (lockObject)
			{
				Refresh();

				this.OAuthSignature = CalcSignature(parameter);

				StringBuilder sb = new StringBuilder();
				sb.Append("OAuth ");
				foreach (string item in dicParameter.Keys)
				{
					if (!string.IsNullOrEmpty(dicParameter[item]) && !item.EndsWith("_secret")
						/*&& !item.EndsWith("_verifier") && !item.EndsWith("_callback")*/)
					{
						sb.Append(item);
						sb.Append("=\"");
						CalcParamUri(sb, dicParameter[item]);
						//sb.Append(Uri.EscapeDataString(dicParameter[item]));
						sb.Append("\", ");
					}
				}
				foreach (string item in parameter.dicParams.Keys)
				{
					if (!string.IsNullOrEmpty(parameter.dicParams[item]))
					{
						sb.Append(item);
						sb.Append("=\"");
						CalcParamUri(sb, parameter.dicParams[item]);
						//sb.Append(Uri.EscapeDataString(parameter.dicParams[item]));
						sb.Append("\", ");
					}
				}
				sb.Remove(sb.Length - 2, 2);

				return sb.ToString();
			}
		}

		private string CalcSignature(BasePacket parameter)
		{
			SortedDictionary<string, string> dicSorted = new SortedDictionary<string, string>();

			foreach (string item in dicParameter.Keys)
			{
				if (!string.IsNullOrEmpty(dicParameter[item]) && !item.EndsWith("_secret") && !item.EndsWith("_signature")
					/*&& !item.EndsWith("_verifier") && !item.EndsWith("_callback")*/)
					dicSorted[item] = dicParameter[item];
			}
			foreach (string item in parameter.dicParams.Keys)
			{
				if (!string.IsNullOrEmpty(parameter.dicParams[item]) && !item.EndsWith("_secret") && !item.EndsWith("_signature"))
					dicSorted[item] = parameter.dicParams[item];
			}

			StringBuilder sb = new StringBuilder();
			foreach (string item in dicSorted.Keys)
			{
				sb.Append(item);
				sb.Append("=");
				CalcParamUri(sb, dicSorted[item]);
				sb.Append("&");
			}
			sb.Remove(sb.Length - 1, 1);//마지막 & 지우기

			string baseStr = CalcBaseString(parameter.method, parameter.url, sb.ToString());
			string signKey = GetSignKey();//Generate.ConsumerSecret + "&" + Generate.TokenSecret;//이게 문제
			string ret = string.Empty;
			using (HMACSHA1 sha = new HMACSHA1(Encoding.ASCII.GetBytes(signKey)))
			{
				byte[] byteArray = Encoding.ASCII.GetBytes(baseStr);
				//MemoryStream stream = new MemoryStream(byteArray);//버그?
				byte[] hashvalue = sha.ComputeHash(byteArray);
				ret = Convert.ToBase64String(hashvalue);
				sha.Dispose();
			}
			return ret;
		}

		public void Clear()
		{
			lock (lockObject)
			{
				OAuthToken = string.Empty;
			}
		}

		public void CalcParamUri(StringBuilder sb, string text)
		{
			int limit = 100;

			if (text.Length > limit)//media등은 길어서 나눠서 해야됨
			{
				int loops = text.Length / limit;


				for (int i = 0; i <= loops; i++)
				{
					if (i < loops)
					{
						sb.Append(Uri.EscapeDataString(text.Substring(100 * i, limit)));
					}
					else
					{
						sb.Append(Uri.EscapeDataString(text.Substring(limit * i)));
					}
				}
			}
			else
			{
				sb.Append(Uri.EscapeDataString(text));
			}
		}

		private string GetSignKey()
		{
			return string.Format("{0}&{1}", appSecretKey, userSecretKey); 
		}

		private string CalcBaseString(string method, string url, string paramStr)
		{
			StringBuilder sb = new StringBuilder();
			sb.Append(method);
			sb.Append("&");
			CalcParamUri(sb, url);
			sb.Append("&");
			CalcParamUri(sb, paramStr);

			return sb.ToString();
		}

		private void Refresh()
		{
			this.OAuthTimestamp = GetTimestamp();
			this.OAuthNonce = GetNonce();
		}

		private string GetTimestamp()
		{
			TimeSpan span = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
			return Convert.ToInt64(span.TotalSeconds).ToString();
			//DateTime GenerateTimeStampDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0);
			//return Convert.ToInt64((DateTime.UtcNow - GenerateTimeStampDateTime).TotalSeconds).ToString();
		}

		private string GetNonce()
		{
			return Convert.ToBase64String(new ASCIIEncoding().GetBytes(DateTime.Now.Ticks.ToString()));
		}
	}//class End

}

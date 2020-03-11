using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace StreamingBridge
{
	public class LogManager
	{
		private static readonly object obj = new object();
		public static void Log(Exception e)
		{
			lock (obj)
			{
				using (FileStream fs = new FileStream(@"Log.txt", FileMode.Append))
				using (StreamWriter writer = new StreamWriter(fs))
				{
					writer.WriteLine($"{DateTime.Now:HH:mm:ss}: {e.Message}");
					writer.WriteLine($"{DateTime.Now:HH:mm:ss}: {e.StackTrace}");
					writer.Flush();
				}
			}
		}
		public static void Log(string msg)
		{
			lock (obj)
			{
				using (FileStream fs = new FileStream(@"Log.txt", FileMode.Append))
				using (StreamWriter writer = new StreamWriter(fs))
				{
					writer.WriteLine($"{DateTime.Now:HH:mm:ss}: msg");
					writer.Flush();
				}
			}

		}
	}
}

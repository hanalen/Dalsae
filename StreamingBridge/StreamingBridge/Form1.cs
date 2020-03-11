using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace StreamingBridge
{
	public partial class Form1 : Form
	{
		public delegate void DStatusChange(bool isCon);

		private uint sendCount { get; set; } = 0;
		private uint recvCount { get; set; } = 0;
		public Form1()
		{
			InitializeComponent();
			this.ShowInTaskbar = true;
		}

		private void Form1_FormClosing(object sender, FormClosingEventArgs e)
		{
			this.Hide();
			e.Cancel = true;
		}

		private void NotifyIcon1_MouseClick(object sender, System.Windows.Forms.MouseEventArgs e)
		{
			this.Show();
		}

		public void ConnectionChanged(bool isConnected)
		{
			this.Invoke(new MethodInvoker(
			  delegate ()
				  {
					  if (isConnected)
						  this.lbStatus.Text = $"스트리밍 호흡기 연결 됨";
					  else
						  this.lbStatus.Text = $"스트리밍 호흡기 연결 끊어짐";
				  }
			  )
			);
		}

		public void Recv()
		{
			this.recvCount++;
			this.Invoke(new MethodInvoker(
			  delegate ()
			  {
				  this.lbRecv.Text = $"수신 건: {recvCount}";
			  }
			  )
			);
		}

		public void Send()
		{
			this.sendCount++;
			this.Invoke(new MethodInvoker(
			  delegate ()
			  {
				  this.lbSend.Text = $"송신 건: {sendCount}";
			  }
			  )
			);
		}

	}
}

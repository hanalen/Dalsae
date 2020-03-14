using System.Drawing;

namespace StreamingBridge
{
	partial class Form1
	{
		/// <summary>
		///  Required designer variable.
		/// </summary>
		private System.ComponentModel.IContainer components = null;

		/// <summary>
		///  Clean up any resources being used.
		/// </summary>
		/// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
		protected override void Dispose(bool disposing)
		{
			if (disposing && (components != null))
			{
				components.Dispose();
			}
			base.Dispose(disposing);
		}

		#region Windows Form Designer generated code

		/// <summary>
		///  Required method for Designer support - do not modify
		///  the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
			this.lbStatus = new System.Windows.Forms.Label();
			this.lbRecv = new System.Windows.Forms.Label();
			this.lbSend = new System.Windows.Forms.Label();
			this.notifyIcon1 = new System.Windows.Forms.NotifyIcon();
			this.SuspendLayout();
			//
			// notifyIcon1
			//
			this.notifyIcon1.Visible = true;
			this.notifyIcon1.Text = "달새 호흡기";
			this.notifyIcon1.Icon = SystemIcons.Application;
			this.notifyIcon1.MouseClick += NotifyIcon1_MouseClick;
			// 
			// lbStatus
			// 
			this.lbStatus.AutoSize = true;
			this.lbStatus.Location = new System.Drawing.Point(12, 9);
			this.lbStatus.Name = "lbStatus";
			this.lbStatus.Size = new System.Drawing.Size(59, 15);
			this.lbStatus.TabIndex = 0;
			this.lbStatus.Text = "연결 상태";
			// 
			// lbRecv
			// 
			this.lbRecv.AutoSize = true;
			this.lbRecv.Location = new System.Drawing.Point(12, 176);
			this.lbRecv.Name = "lbRecv";
			this.lbRecv.Size = new System.Drawing.Size(55, 15);
			this.lbRecv.TabIndex = 1;
			this.lbRecv.Text = "수신개수";
			// 
			// lbSend
			// 
			this.lbSend.AutoSize = true;
			this.lbSend.Location = new System.Drawing.Point(159, 176);
			this.lbSend.Name = "lbSend";
			this.lbSend.Size = new System.Drawing.Size(55, 15);
			this.lbSend.TabIndex = 1;
			this.lbSend.Text = "송신개수";
			// 
			// Form1
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(300, 200);
			this.Controls.Add(this.lbSend);
			this.Controls.Add(this.lbRecv);
			this.Controls.Add(this.lbStatus);
			this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedToolWindow;
			this.MaximizeBox = false;
			this.Name = "Form1";
			this.ShowInTaskbar = false;
			this.Text = "Form1";
			this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.Form1_FormClosing);
			this.ResumeLayout(false);
			this.PerformLayout();

		}



		#endregion

		private System.Windows.Forms.Label lbStatus;
		private System.Windows.Forms.Label lbRecv;
		private System.Windows.Forms.Label lbSend;
		private System.Windows.Forms.NotifyIcon notifyIcon1;
	}
}


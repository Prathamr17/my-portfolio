from flask import current_app
from flask_mail import Message
from app import mail
from app.models.contact import ContactMessage


def send_contact_notification(msg: ContactMessage) -> None:
    """
    Send an HTML email to the admin whenever a visitor submits the contact form.
    Raises on SMTP failure — caller should catch and log.
    """
    admin_email = current_app.config.get("ADMIN_EMAIL", "prathamraikar8@gmail.com")
    subject_line = f"📬 New Contact: {msg.subject}"

    html_body = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body {{
      margin: 0; padding: 0;
      background: #0F172A;
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #F1F5F9;
    }}
    .wrapper {{ max-width: 600px; margin: 40px auto; }}
    .header {{
      background: linear-gradient(135deg, #7C3AED, #06B6D4);
      padding: 32px 32px 24px;
      border-radius: 12px 12px 0 0;
    }}
    .header h1 {{ margin: 0; font-size: 22px; color: #fff; }}
    .header p  {{ margin: 4px 0 0; font-size: 13px; color: #DDD6FE; }}
    .body {{
      background: #1E293B;
      padding: 28px 32px;
      border-radius: 0 0 12px 12px;
    }}
    .row {{ margin-bottom: 18px; }}
    .label {{
      font-size: 11px; font-weight: 700; letter-spacing: 1px;
      color: #7C3AED; text-transform: uppercase; margin-bottom: 4px;
    }}
    .value {{
      font-size: 15px; color: #E2E8F0;
      background: #0F172A; border-left: 3px solid #7C3AED;
      padding: 10px 14px; border-radius: 0 6px 6px 0;
    }}
    .message-box {{
      font-size: 14px; color: #CBD5E1; line-height: 1.7;
      background: #0F172A; border-left: 3px solid #06B6D4;
      padding: 14px 16px; border-radius: 0 6px 6px 0;
      white-space: pre-wrap;
    }}
    .reply-btn {{
      display: inline-block; margin-top: 24px;
      background: linear-gradient(135deg, #7C3AED, #06B6D4);
      color: #fff; text-decoration: none;
      padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 600;
    }}
    .footer {{
      text-align: center; margin-top: 24px;
      font-size: 12px; color: #475569;
    }}
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>📬 New Portfolio Message</h1>
    <p>Someone reached out via your portfolio contact form</p>
  </div>
  <div class="body">
    <div class="row">
      <div class="label">From</div>
      <div class="value">{msg.sender_name}</div>
    </div>
    <div class="row">
      <div class="label">Email</div>
      <div class="value">{msg.sender_email}</div>
    </div>
    <div class="row">
      <div class="label">Subject</div>
      <div class="value">{msg.subject}</div>
    </div>
    <div class="row">
      <div class="label">Message</div>
      <div class="message-box">{msg.message}</div>
    </div>
    <a class="reply-btn" href="mailto:{msg.sender_email}?subject=Re: {msg.subject}">
      ↩ Reply to {msg.sender_name}
    </a>
  </div>
  <div class="footer">
    Pratham Raikar Portfolio &nbsp;·&nbsp; This notification was auto-generated
  </div>
</div>
</body>
</html>
"""

    sender_email = current_app.config.get("MAIL_USERNAME") or admin_email

    email_msg = Message(
        subject=subject_line,
        sender=sender_email,
        recipients=[admin_email],
        html=html_body,
        reply_to=msg.sender_email,
    )
    mail.send(email_msg)

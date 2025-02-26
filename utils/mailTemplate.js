exports.signUpTemplate = (link,firstName) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cohort 5 Class</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333333;
        background-color: #2c2c2c; /* Dark background */
        margin: 0;
        padding: 0;
      }
      .container {
        width: 80%;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        background-color: #f4f4f4; /* Light grey background */
      }
      .header {
        background: #be5353;
        padding: 20px;
        text-align: center;
        border-bottom: 1px solid #ddd;
        color: #ffffff;
        border-radius: 10px 10px 0 0;
      }
      .content {
        padding: 20px;
        color: #333333;
      }
      .button-container {
        text-align: center;
        margin: 20px 0;
      }
      .button {
        display: inline-block;
        background-color: #19b03c; /* Green background */
        color: #ffffff;
        padding: 15px 30px;
        font-size: 18px;
        text-decoration: none;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: background-color 0.3s ease;
      }
      .button:hover {
        background-color: #731334;
      }
      .footer {
        background: #333333;
        padding: 10px;
        text-align: center;
        border-top: 1px solid #ddd;
        font-size: 0.9em;
        color: #cccccc;
        border-radius: 0 0 10px 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Management system!</h1>
      </div>
      <div class="content">
        <p>Hello ${firstName},</p>
        <p>
          Thank you for joining the student management system. We are excited to
          have you on board .
        </p>
        <p>Please click the button below to verify your account:</p>
        <div class="button-container">
          <a href="${link}" class="button">Verify My Account</a>
        </div>
        <p>If you did not sign up on our platform, kindly ignore this email.</p>
        <p>Best regards,<br />joyDtech girl team</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} . All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`
}



exports.forgotTemplate = (link,firstName) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cohort 5 Class</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333333;
        background-color: #2c2c2c; /* Dark background */
        margin: 0;
        padding: 0;
      }
      .container {
        width: 80%;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        background-color: #f4f4f4; /* Light grey background */
      }
      .header {
        background: #be5353;
        padding: 20px;
        text-align: center;
        border-bottom: 1px solid #ddd;
        color: #ffffff;
        border-radius: 10px 10px 0 0;
      }
      .content {
        padding: 20px;
        color: #333333;
      }
      .button-container {
        text-align: center;
        margin: 20px 0;
      }
      .button {
        display: inline-block;
        background-color: #19b03c; /* Green background */
        color: #ffffff;
        padding: 15px 30px;
        font-size: 18px;
        text-decoration: none;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: background-color 0.3s ease;
      }
      .button:hover {
        background-color: #731334;
      }
      .footer {
        background: #333333;
        padding: 10px;
        text-align: center;
        border-top: 1px solid #ddd;
        font-size: 0.9em;
        color: #cccccc;
        border-radius: 0 0 10px 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Management System!</h1>
      </div>
      <div class="content">
        <p>Hello ${firstName},</p>
        <p>
          
        </p>
        <p>You initiated an action on your forgot password: click the link below to reset password</p>
        <div class="button-container">
          <a href="${link}" class="button">reset password</a>
        </div>
        <p>If you did not initiate this action on our platform, kindly ignore this email.</p>
        <p>Best regards,<br />joyD tech girl team</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} . All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`
}
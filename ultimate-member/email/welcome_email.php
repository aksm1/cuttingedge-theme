<p>&nbsp;</p>
<p>&nbsp;</p>
<p>
    /* Client-specific resets */
    body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important; }
    body, table, td, div, p, a { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; }
    
    /* Font Imports - Works in Apple Mail, iOS, some Android. Gmail falls back to sans-serif */
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&amp;family=Poppins:wght@500;600;700&amp;display=swap');
</p>
<!-- MAIN WRAPPER (Matches #quizWrapper background context) -->
<table style="background-color: #f0f7ff;padding: 40px 20px" border="0" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td align="center"><!-- CONTENT CARD (Matches #mainQuizContainer and Card Styles) --><!-- Note: CSS Variables replaced with Hex codes for Email Compatibility -->
<table style="max-width: 600px;background-color: #ffffff;border-radius: 12px;overflow: hidden;border-collapse: separate" border="0" width="100%" cellspacing="0" cellpadding="0"><!-- BLUE ACCENT BAR (Matches pseudo-element ::before) -->
<tbody>
<tr>
<td style="background-color: #0078d7;font-size: 0;line-height: 0" height="6"> </td>
</tr>
<tr>
<td style="padding: 40px 30px;text-align: center"><!-- HEADLINE (Matches h2 font and color) -->
<h1 style="margin: 0 0 20px 0;font-family: 'Poppins', sans-serif;font-size: 24px;font-weight: bold;color: #005a9c">Welcome to Cutting Edge Education!</h1>
<!-- BODY TEXT -->
<p style="margin: 0 0 25px 0;font-family: 'Open Sans', sans-serif;font-size: 16px;line-height: 1.6;color: #555555">Hi {first_name},</p>
<p style="margin: 0 0 25px 0;font-family: 'Open Sans', sans-serif;font-size: 16px;line-height: 1.6;color: #555555">Thank you for joining our community. We are thrilled to have you on board. At <strong>{site_name}</strong>, we are dedicated to providing the best learning experience possible.</p>
<p style="margin: 0 0 30px 0;font-family: 'Open Sans', sans-serif;font-size: 16px;line-height: 1.6;color: #555555">Your account is now active. You can log in below to track your progress and start exploring our quizzes and content.</p>
<!-- BUTTON (Matches #next and #submit button styling) -->
<table border="0" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td align="center"><a style="padding: 14px 30px;background-color: #0078d7;color: #ffffff;font-family: 'Poppins', sans-serif;font-weight: 600;font-size: 16px;text-decoration: none;border-radius: 6px;text-transform: capitalize" href="{login_url}" target="_blank" rel="noopener"> Login to Your Account </a></td>
</tr>
</tbody>
</table>
<!-- DIVIDER -->
<div style="height: 1px;background-color: #dee2e6;margin: 30px 0"> </div>
<!-- SUB TEXT -->
<p style="margin: 0;font-family: 'Open Sans', sans-serif;font-size: 14px;color: #888888">If you have any questions, feel free to reply to this email.</p>
</td>
</tr>
</tbody>
</table>
<!-- FOOTER -->
<table style="max-width: 600px" border="0" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="padding-top: 20px;font-family: 'Open Sans', sans-serif;font-size: 12px;color: #999999" align="center">© 2024 {site_name}. All rights reserved.</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
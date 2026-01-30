export default function verificationEmail(
  username: string,
  verifyCode: string
) {
  return `
  <div style="background:#f3f4f6;padding:24px;font-family:Arial,Helvetica,sans-serif;">
    <div style="
      max-width:520px;
      margin:0 auto;
      background:#ffffff;
      border-radius:10px;
      padding:32px;
      box-shadow:0 8px 24px rgba(0,0,0,0.05);
    ">

      <!-- Logo / Brand -->
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="
          margin:0;
          font-size:26px;
          font-weight:700;
          color:#4f46e5;
          letter-spacing:0.5px;
        ">
          AnonWave
        </h1>
        <p style="margin-top:6px;color:#6b7280;font-size:14px;">
          Anonymous messaging, made simple
        </p>
      </div>

      <!-- Greeting -->
      <p style="font-size:16px;color:#111827;margin-bottom:16px;">
        Hello <strong>${username}</strong> 👋
      </p>

      <p style="font-size:15px;color:#374151;line-height:1.6;">
        Thanks for signing up! Use the verification code below to confirm your
        email address and activate your AnonWave account.
      </p>

      <!-- OTP Box -->
      <div style="
        margin:28px 0;
        padding:20px;
        background:#f9fafb;
        border:1px dashed #c7d2fe;
        border-radius:10px;
        text-align:center;
      ">
        <p style="margin:0;font-size:14px;color:#6b7280;">
          Your verification code
        </p>
        <div style="
          margin-top:8px;
          font-size:32px;
          font-weight:700;
          letter-spacing:6px;
          color:#4f46e5;
        ">
          ${verifyCode}
        </div>
      </div>

      <!-- Expiry -->
      <p style="font-size:14px;color:#6b7280;margin-bottom:24px;">
        ⏳ This code is valid for <strong>10 minutes</strong>.
      </p>

      <!-- Security Note -->
      <div style="
        background:#eef2ff;
        padding:16px;
        border-radius:8px;
        font-size:13px;
        color:#4338ca;
      ">
        🔒 If you didn’t request this email, you can safely ignore it.
        Your account will remain unverified.
      </div>

      <!-- Footer -->
      <div style="
        margin-top:32px;
        padding-top:16px;
        border-top:1px solid #e5e7eb;
        text-align:center;
        font-size:12px;
        color:#9ca3af;
      ">
        <p style="margin:0;">
          © ${new Date().getFullYear()} AnonWave. All rights reserved.
        </p>
        <p style="margin-top:6px;">
          Built with privacy in mind 🌊
        </p>
      </div>

    </div>
  </div>
  `;
}

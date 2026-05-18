export const generateRandomPassword = (): string => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*";

  let password =
    uppercase[Math.floor(Math.random() * uppercase.length)] +
    lowercase[Math.floor(Math.random() * lowercase.length)] +
    specialChars[Math.floor(Math.random() * specialChars.length)];

  for (let i = password.length; i < 7; i++) {
    password += numbers[Math.floor(Math.random() * numbers.length)];
  }

  return password;
};

export const adminWelcomeEmailTemplate = ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome Admin</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f7fb;
          font-family: Arial, Helvetica, sans-serif;
        "
      >
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="padding: 40px 0"
        >
          <tr>
            <td align="center">
              <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                style="
                  background: #ffffff;
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                "
              >
                <!-- Header -->
                <tr>
                  <td
                    align="center"
                    style="
                      background: #111827;
                      padding: 30px;
                      color: #ffffff;
                    "
                  >
                    <h1 style="margin: 0; font-size: 28px">
                      Welcome to HiredNow
                    </h1>

                    <p
                      style="
                        margin-top: 10px;
                        font-size: 14px;
                        color: #d1d5db;
                      "
                    >
                      Your admin account has been created successfully.
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 35px">
                    <h2
                      style="
                        margin-top: 0;
                        color: #111827;
                        font-size: 22px;
                      "
                    >
                      Hello ${name},
                    </h2>

                    <p
                      style="
                        font-size: 16px;
                        line-height: 1.7;
                        color: #4b5563;
                      "
                    >
                      A super admin has created an admin account for you in
                      <strong>HiredNow</strong>.
                    </p>

                    <p
                      style="
                        font-size: 16px;
                        line-height: 1.7;
                        color: #4b5563;
                      "
                    >
                      Please use the following credentials to log in to your
                      account.
                    </p>

                    <!-- Credentials Box -->
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        margin: 25px 0;
                        background: #f9fafb;
                        border: 1px solid #e5e7eb;
                        border-radius: 10px;
                      "
                    >
                      <tr>
                        <td style="padding: 20px">
                          <p
                            style="
                              margin: 0 0 12px 0;
                              font-size: 15px;
                              color: #374151;
                            "
                          >
                            <strong>Email:</strong> ${email}
                          </p>

                          <p
                            style="
                              margin: 0;
                              font-size: 15px;
                              color: #374151;
                            "
                          >
                            <strong>Temporary Password:</strong> ${password}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Warning -->
                    <p
                      style="
                        font-size: 14px;
                        line-height: 1.6;
                        color: #dc2626;
                        margin-top: 20px;
                      "
                    >
                      For security reasons, please change your password
                      immediately after your first login.
                    </p>

                    <!-- Button -->
                    <table
                      cellpadding="0"
                      cellspacing="0"
                      style="margin-top: 30px"
                    >
                      <tr>
                        <td align="center">
                          <a
                            href="http://localhost:5173/signin"
                            style="
                              display: inline-block;
                              background: #111827;
                              color: #ffffff;
                              text-decoration: none;
                              padding: 14px 28px;
                              border-radius: 8px;
                              font-size: 15px;
                              font-weight: bold;
                            "
                          >
                            Login to Dashboard
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    align="center"
                    style="
                      background: #f9fafb;
                      padding: 20px;
                      border-top: 1px solid #e5e7eb;
                    "
                  >
                    <p
                      style="
                        margin: 0;
                        font-size: 13px;
                        color: #6b7280;
                      "
                    >
                      © ${new Date().getFullYear()} HiredNow. All rights
                      reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

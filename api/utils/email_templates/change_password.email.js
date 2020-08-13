module.exports.default = function (token) {
  return (
    `<html>
        <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />
        </head>
        <body>
            <div class="container">
                <div class="row">
                    <div class="col">
                      <p>You have received this email because you requested a password change.<br/> If you didnt, you can safely ignore this email.</p>

                      <p>Click <a href="${process.env.HOST}/change_password/${token}">here</a> to change your password.
                    </div>
                </div>
            </div>

        </body>
    </html>`
  );
}
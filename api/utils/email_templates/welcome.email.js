module.exports.default = function (otp) {
  return (
    `<html>
        <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />
        </head>
        <body>
            <div class="container">
                <div class="row">
                    <div class="col">
                      <p>Welcome to Digital Qari!</p>
                      <p>Your otp is ${otp}</p>
                    </div>
                </div>
            </div>

        </body>
    </html>`
  );
}
module.exports.default = function (email, body) {
  return (
    `<html>
        <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />
        </head>
        <body>
            <div class="container">
                <div class="row">
                    <div class="col">
                      <p>Support requested from ${email}</p>
                      <p>Message:</p>
                      <p>${body}</p>
                    </div>
                </div>
            </div>
        </body>
    </html>`
  );
}
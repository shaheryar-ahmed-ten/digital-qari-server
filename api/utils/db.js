const mongoose = require('mongoose');
const { ERRORS } = require("./constants");
var debug = require('debug')(`${process.env.SERVER_NAME}:server`);

mongoose.connect(process.env.DB_CONN_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).catch(err => debug(err));
let db = mongoose.connection;
db.on('error', () => debug(ERRORS.MONGODB_CONNECTION_FAILED));
db.on('open', () => debug(ERRORS.MONGODB_CONNECTION_SUCCESSFUL));
mongoose.set('debug', true);
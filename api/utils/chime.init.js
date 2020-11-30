const {AWS} = require("./aws.init");

const Chime = new AWS.Chime({apiVersion: '2018-05-01', region: 'us-east-1'});
Chime.endpoint = new AWS.Endpoint('https://service.chime.aws.amazon.com/console');    

module.exports = {
  Chime
};
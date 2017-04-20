'use strict';

console.log('Loading function');

/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 */
exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    var parseResult = function(res) {
          var str = '';
          res.on('data', function(chunk) {
            str += chunk;
          });

          res.on('end', function() {
            var obj = JSON.parse(str);
            obj.next_link = "/";
            obj.prev_link = (obj.num === 1 ? "/" : "/" + (obj.num - 1).toString() );
            str = JSON.stringify(obj);
            sendResult(res.statusCode, res.statusCode === 200 ? str : res.statusMessage);
          });
          res.on('error', function(e) {
            sendResult(res.statusCode, e.message);
          });
    }
    const sendResult = function(code, message) {
      callback(null, {
        statusCode: code,
        body: message,
        headers: {
            'Content-Type': 'application/json',
        }}
        );
    }
    
    const https = require('https');
    var options = {
        host: 'xkcd.com',
        path: '/info.0.json',
        agent: false
    };
    https.get(options, parseResult);
}
const { Console } = require('console');
const https = require('https');
const { resolve } = require('path');
const config = require('../config.js');

module.exports = {
    query: async (path, method, data, port)=> {
      return new Promise((resolve, reject) => {
        if(data == null || data === undefined){
            data = '';
        }

        let options = {
            hostname: '127.0.0.1',
            port: port,
            path: path,
            method: method,
            headers: {
              'Authorization': 'Basic ' + config.auth,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'Content-Length': data.length
            },
            encoding: 'utf8',
          }

        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
                
                  const req = https.request(options, res => {
                    let queryResponse = ``;
                    res.on('data', x => {
                      queryResponse += x;
                    });
                    res.on('end', ()=> {
                      resolve(queryResponse);
                    });
                  }).on('error', () =>{
                    resolve(0);
                  });
                  
                  if(method === 'POST' || method === 'PATCH')
                  req.write(data);

                  req.end();
                });
  },
};
const https = require('https');
const config = require('../config.js');

module.exports = {
    query: async (url, metodo, requestData, puerto)=> {
      
      return new Promise((resolve, reject) => {
        if(requestData == null || requestData === undefined){
            requestData = '';
        }

        let options = {
            hostname: '127.0.0.1',
            port: puerto,
            path: url,
            method: metodo,
            headers: {
              'Authorization': 'Basic ' + config.auth,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'Content-Length': requestData.length
            },
            encoding: 'utf8',
          }

        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
                const req = https.request(options, res => {
                    let __data = ``;
                    res.on('data', d => {
                      __data += d;
                    });
                    res.on('end', ()=> {
                      resolve(__data);
                    });
                  });
                  
                  if(metodo === 'POST' || metodo === 'PATCH')
                  req.write(requestData);

                  req.end();
                });
  },
};
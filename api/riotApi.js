const https = require('https');
const config = require('../config.js');
const fs = require('fs');

module.exports = {
    consulta: async (url, metodo, apiFileName, requestData, puerto)=> {
      try {
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
                        fs.writeFile(`api/respuestas/${apiFileName}.json`, __data, (err) =>{
                          if (err) return console.log(err);
                        });
                    });
                  });
                  
                  if(metodo === 'POST' || metodo === 'PATCH')
                  req.write(requestData);

                  await config.sleep(0.1);
                  req.end();
                }catch(error){
                  //error.
                }
  },
};
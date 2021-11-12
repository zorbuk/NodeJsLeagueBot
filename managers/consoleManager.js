let datetime = new Date().toLocaleTimeString('en-US', { hour12: false, 
    hour: "numeric", 
    minute: "numeric"});

module.exports = {
    escribir : (mensaje)=>{
        console.log(`[ ${datetime} ] (JsLeagueBot) ${mensaje}`);
    }
};
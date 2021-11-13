let datetime = new Date().toLocaleTimeString('en-US', { hour12: false, 
    hour: "numeric", 
    minute: "numeric"});

module.exports = {
    write : (message)=>{
        console.log(`[ ${datetime} ] (JsLeagueBot) ${message}`);
    }
};
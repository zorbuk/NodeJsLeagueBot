const config = require('../config.js');
const gameManager = require('../managers/gameManager.js');

module.exports = {
    getBestAlly: async () => {
        let inGamePlayerList = await gameManager.getPlayerList(config.portIngame);
        let inGamePlayerListParsed = JSON.parse(inGamePlayerList);
        let currentPlayingPlayerName = await gameManager.getActivePlayerName(config.portIngame);
        currentPlayingPlayerName = currentPlayingPlayerName.replace(/\"/g, "");
        let playerIndex = 2;
        let choosenPlayerIndex = 2;
        let mostKills = -1;

        if(inGamePlayerListParsed){
            inGamePlayerListParsed.forEach(player => {
            if(player["summonerName"] !== currentPlayingPlayerName && player["team"] == "ORDER"){
                if(player["scores"]["kills"] > mostKills){
                    mostKills = player["scores"]["kills"];
                    choosenPlayerIndex = playerIndex;
                }
                playerIndex++;
                }
            });
        }

        return choosenPlayerIndex;
    },
    getEventHappend: async (name) => {
        let events = await gameManager.getGameEvents(config.portIngame);
        let parsedEvents = JSON.parse(events);

        parsedEvents["Events"].forEach(event => {
            if(event["EventName"] === name){
                return true;
            }
        });

        return false;
    },
    getGameTime: async () => {
        let gameStats = await gameManager.getGameStats(config.portIngame);
        return JSON.parse(gameStats)["gameTime"];
    }
}
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
    getScore: async () => {
        let inGamePlayerList = await gameManager.getPlayerList(config.portIngame);
        let inGamePlayerListParsed = JSON.parse(inGamePlayerList);
        let currentPlayingPlayerName = await gameManager.getActivePlayerName(config.portIngame);
        if(currentPlayingPlayerName == 0)
            currentPlayingPlayerName = "";
        currentPlayingPlayerName = currentPlayingPlayerName.replace(/\"/g, "");
        let score = {
            "assists": 0,
            "creepScore": 0,
            "deaths": 0,
            "kills": 0,
            "wardScore": 0.0
        };

        if(inGamePlayerListParsed){
            inGamePlayerListParsed.forEach(player => {
                if(player["summonerName"] == currentPlayingPlayerName && player["team"] == "ORDER"){
                    score = player["scores"];
                }
            });
        }

        return score;
    },
    getGameTime: async () => {
        let gameStats = 0.0;
        try{
            gameStats = await gameManager.getGameStats(config.portIngame);
        }catch{
            return gameStats;
        }
        
        return JSON.parse(gameStats)["gameTime"];
    }
}
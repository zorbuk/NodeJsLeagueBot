const config = require('../config.js');
const gameManager = require('../managers/gameManager.js');
const clientManager = require('../managers/clientManager.js');
const { puertoIngame } = require('../config.js');

module.exports = {
    obtenerMejorAliado: () => {
        let inGamePlayerList = JSON.parse(gameManager.obtenerPlayerList(config.puertoIngame));
        let currentPlayingPlayerName = gameManager.obtenerActivePlayerName(config.puertoIngame);
        currentPlayingPlayerName = currentPlayingPlayerName.replace(/\"/g, "");
        let playerIndex = 2;
        let choosenPlayerIndex = 2;
        let mostKills = -1;

        if(inGamePlayerList){
            inGamePlayerList.forEach(player => {
            if(player["summonerName"] !== currentPlayingPlayerName && player["team"] == "ORDER"){
                if(player["scores"]["kills"] > mostKills){
                    mostKills = player["scores"]["kills"];
                    choosenPlayerIndex = playerIndex;
                }
                //consoleManager.escribir(`Jugador ${player["summonerName"]} [F${playerIndex}] con ${player["scores"]["kills"]} asesinatos.`);
                playerIndex++;
                }
            });
        }

        return choosenPlayerIndex;
    },
    ocurrioEvento: (nombre) => {
        let eventos = JSON.parse(gameManager.obtenerGameEvents(puertoIngame));

        eventos["Events"].forEach(evento => {
            if(evento["EventName"] === nombre){
                return true;
            }
        });

        return false;
    }
}
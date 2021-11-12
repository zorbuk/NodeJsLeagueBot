const fs = require('fs');
const riotApi = require('../api/riotApi.js');

module.exports = {
    // --------------- Funciones https://lcu.vivide.re/#operation--lol-summoner-v1-current-summoner-get
    obtenerGameFlow: (puerto)=>{
        riotApi.consulta('/lol-gameflow/v1/gameflow-phase', 'GET', 'gameflow-phase', '', puerto);
        return fs.readFileSync('api/respuestas/gameflow-phase.json').toString();
    },
    obtenerActivePlayerName: (puerto)=>{
        riotApi.consulta('/liveclientdata/activeplayername', 'GET', 'activeplayername', '', puerto);
        return fs.readFileSync('api/respuestas/activeplayername.json').toString();
    },
    obtenerAllGameData: (puerto)=>{
        riotApi.consulta('/liveclientdata/allgamedata', 'GET', 'allgamedata', '', puerto);
        return fs.readFileSync('api/respuestas/allgamedata.json').toString();
    },
    obtenerActivePlayerData: (puerto)=>{
        riotApi.consulta('/liveclientdata/activeplayer', 'GET', 'activeplayer', '', puerto);
        return fs.readFileSync('api/respuestas/activeplayer.json').toString();
    },
    obtenerActivePlayerHabilities:(puerto)=>{
        riotApi.consulta('/liveclientdata/activeplayerabilities', 'GET', 'activeplayerabilities', '', puerto);
        return fs.readFileSync('api/respuestas/activeplayerabilities.json').toString();
    },
    obtenerActivePlayerRunes:(puerto)=>{
        riotApi.consulta('/liveclientdata/activeplayerrunes', 'GET', 'activeplayerrunes', '', puerto);
        return fs.readFileSync('api/respuestas/activeplayerrunes.json').toString();
    },
    obtenerPlayerList:(puerto)=>{
        riotApi.consulta('/liveclientdata/playerlist', 'GET', 'playerlist', '', puerto);
        return fs.readFileSync('api/respuestas/playerlist.json').toString();
    },
    obtenerPlayerScore:(puerto, playerName)=>{
        riotApi.consulta(`/liveclientdata/playerscores?summonerName=${playerName}`, 'GET', 'playerscores', '', puerto);
        return fs.readFileSync('api/respuestas/playerscores.json').toString();
    },
    obtenerPlayerSummonerSpells:(puerto, playerName)=>{
        riotApi.consulta(`/liveclientdata/playersummonerspells?summonerName=${playerName}`, 'GET', 'playersummonerspells', '', puerto);
        return fs.readFileSync('api/respuestas/playersummonerspells.json').toString();
    },
    obtenerPlayerItems:(puerto, playerName)=>{
        riotApi.consulta(`/liveclientdata/playeritems?summonerName=${playerName}`, 'GET', 'playeritems', '', puerto);
        return fs.readFileSync('api/respuestas/playeritems.json').toString();
    },
    obtenerGameEvents:(puerto)=>{
        riotApi.consulta('/liveclientdata/eventdata', 'GET', 'eventdata', '', puerto);
        return fs.readFileSync('api/respuestas/eventdata.json').toString();
    },
    obtenerGameStats:(puerto)=>{
        riotApi.consulta(`/liveclientdata/gamestats`, 'GET', 'gamestats', '', puerto);
        return fs.readFileSync('api/respuestas/gamestats.json').toString();
    }
};
const riotApi = require('../api/riotApi.js');

module.exports = {
    // --------------- Funciones : https://lcu.vivide.re/#operation--lol-summoner-v1-current-summoner-get
    getGameFlow: (port)=>{
        return new Promise((resolve) => {
            riotApi.query('/lol-gameflow/v1/gameflow-phase', 'GET', '', port).then(result => {
                resolve(result);
            })
        });
    },
    getActivePlayerName: (port)=>{
        return new Promise((resolve) => {
            riotApi.query('/liveclientdata/activeplayername', 'GET', '', port).then(result => {
                resolve(result);
            })
        });
    },
    getAllGameData: (port)=>{
        return new Promise((resolve) => {
            riotApi.query('/liveclientdata/allgamedata', 'GET', '', port).then(result => {
                resolve(result);
            })
        });
    },
    getActivePlayerData: (port)=>{
        return new Promise((resolve) => {
            riotApi.query('/liveclientdata/activeplayer', 'GET', '', port).then(result => {
                resolve(result);
            })
        });
    },
    getActivePlayerAbilities:(port)=>{
        return new Promise((resolve) => {
            riotApi.query('/liveclientdata/activeplayerabilities', 'GET', '', port).then(result => {
                resolve(result);
            })
        });
    },
    getActivePlayerRunes:(port)=>{
        return new Promise((resolve) => {
            riotApi.query('/liveclientdata/activeplayerrunes', 'GET', '', port).then(result => {
                resolve(result);
            })
        });
    },
    getPlayerList:(port)=>{
        return new Promise((resolve) => {
            riotApi.query('/liveclientdata/playerlist', 'GET', '', port).then(result => {
                resolve(result);
            })
        });
    },
    getPlayerScore:(port, playerName)=>{
        return new Promise((resolve) => {
            riotApi.query(`/liveclientdata/playerscores?summonerName=${playerName}`, 'GET', '', port).then(result => {
                resolve(result);
            })
        });
    },
    getPlayerSummonerSpells:(port, playerName)=>{
        return new Promise((resolve) => {
            riotApi.query(`/liveclientdata/playersummonerspells?summonerName=${playerName}`, 'GET', '', port).then(result => {
                resolve(result);
            })
        });
    },
    getPlayerItems:(port, playerName)=>{
        return new Promise((resolve) => {
            riotApi.query(`/liveclientdata/playeritems?summonerName=${playerName}`, 'GET', '', port).then(result => {
                resolve(result);
            })
        });
    },
    getGameEvents:(port)=>{
        return new Promise((resolve) => {
            riotApi.query('/liveclientdata/eventdata', 'GET', '', port).then(result => {
                resolve(result);
            })
        });
    },
    getGameStats:(port)=>{
        return new Promise((resolve) => {
            riotApi.query(`/liveclientdata/gamestats`, 'GET', '', port).then(result => {
                resolve(result);
            })
        });
    }
};
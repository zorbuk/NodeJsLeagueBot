const fs = require('fs');
const config = require('../config.js');
const riotApi = require('../api/riotApi.js');

module.exports = {
    // -------------- //
    //  ClientStartup //
    // -------------- //
    initialization: ()=>{
        const buffer = fs.readFileSync(config.leagueOfLegendsLockfile);
        const args = buffer.toString().split(":");
        config.auth = Buffer.from('riot:'+args[3]).toString('base64');
        config.port = args[2];
    },
    // --------------- Informaciones Basicas
    getCurrentSummoner: async (port)=>{
        return new Promise((resolve) => {
            riotApi.query('/lol-summoner/v1/current-summoner', 'GET', '', port).then(result => {
                resolve(result);
            })
        });
    },
    // --------------- Funciones
    createGame: (port, type)=>{
        return new Promise((resolve) => {
        let data = JSON.stringify({ queueId: type });
        riotApi.query(`/lol-lobby/v2/lobby`, 'POST', data, port).then(result => {
                resolve(result);
            })
        });
    },
    findGame: (port)=>{
        return new Promise((resolve) => {
        let data = ``;
        riotApi.query(`/lol-lobby/v2/lobby/matchmaking/search`, 'POST', data, port).then(result => {
                resolve(result);
            })
        });
    },
    acceptGame: (port)=>{
        return new Promise((resolve) => {
        let data = ``;
        riotApi.query(`/lol-matchmaking/v1/ready-check/accept`, 'POST', data, port).then(result => {
                resolve(result);
            })
        });
    },
    getPickableChampions: (port)=>{
        return new Promise((resolve) => {
        riotApi.query('/lol-champ-select/v1/pickable-champion-ids', 'GET').then(result => {
            resolve(result);
            })
        });
    },
    // TODO: Mejorar el sistema de pickear campeón
    pickChampion: (port, campeon)=>{
            for (let randomId = 0; randomId < 10; randomId++) {
                let data = JSON.stringify({ actorCellId: 0, championId: campeon, completed: true, id:randomId, isAllyAction:true, type:'string' });
                riotApi.query(`/lol-champ-select/v1/session/actions/${randomId}`, 'PATCH', data, port);
            }
    },
};
'use strict';
const robot = require("robotjs");
const config = require("./config.js");
const clientManager = require("./managers/clientManager.js");
const gameManager = require("./managers/gameManager.js");
const ingameManager = require("./managers/ingameManager.js");
const consoleManager = require("./managers/consoleManager.js");
const { Champion, QueueType } = require("./config.js");
const ks = require('node-key-sender');
const http = require('http');
const express = require('express');
const ip = require("ip");

/* ********************
    Este proyecto ha sido realizado por Zorbuk.
    https://github.com/zorbuk

    Las donaciones por paypal son bienvenidas: @mvrec

    Las dependencias usadas se pueden ver en package.json

    Configuración Básica:
    leagueBot.js || __queue : [por defecto, Bots Introducción]
    leagueBot.js || __champion : [Por defecto, Ashe]
    config.js || screenSize : [Por defecto, 1920*1080]
    config.js || leagueOfLegendsLockfile : [Donde esta tu archivo lockfile de league of legends]

*/

/*
    npm run build32 if you want to target 32 bit processes
    npm run build64 if you want to target 64 bit processes
*/

// ********************

/*
    Web Local
*/

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("web/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/*
    Rutas
*/

app.get('/', async function(req,res){
    let __player = await clientManager.getCurrentSummoner(config.port);
    let __parsedPlayer = JSON.parse(__player);

    let __status = await gameManager.getGameFlow(config.port);

    res.render('index', 
    {playerName: __parsedPlayer["displayName"], 
    playerLevel: __parsedPlayer["summonerLevel"], 
    playerIcon: __parsedPlayer["profileIconId"], 
    playerLevelProgress: __parsedPlayer["percentCompleteForNextLevel"],
    playerStatus: __status}
    );
  });

app.get('/iniciar', function(req, res){
    __execute = true;
    processStartGame();
    res.redirect('/');
});


app.get('/detener', function(req, res){
    __execute = false;
    res.redirect('/');
});

/*
    Server
*/

const server = http.createServer(app);

// ********************

main();
let __queue = QueueType.IntroBots;
let __champion = Champion.Ashe;
let __botClientStatus;
let __botLookingForGame = false;
let __execute = true;

// ********************

async function main(){
    console.clear();
    consoleManager.write("LeagueBot JS hecho por Zorbuk en Nodejs con Robotjs");
    consoleManager.write("☕ Si deseas apoyar el proyecto, las donaciones son bienvenidas, pero no obligatorias 🙏");
    consoleManager.write("❤️ Paypal: @mvrec")
    consoleManager.write("👉 Las actualizaciones las encontrarás en https://github.com/zorbuk/NodeJsLeagueBot")
    consoleManager.write("👽 Si tienes algun problema publicalo en https://github.com/zorbuk/NodeJsLeagueBot/issues")
    consoleManager.write("🗣 Discord: https://discord.gg/KZXVh8SbA9")

    while(config.auth===null){
        clientManager.initialization();
        await config.sleep(2);
    }

    consoleManager.write(`✅ Auth '${config.auth}'`);
    consoleManager.write(`✅ Puertos 'Cliente: ${config.port}, Juego: ${config.portIngame}'`);

    server.listen(config.localServerPort);
    consoleManager.write(`✅ ${ip.address()}:${config.localServerPort}`);
}

async function processStartGame(){
    while(__execute){
        
        // ********************
        // Evitar el spam en consola.
        // ********************

        if(await gameManager.getGameFlow(config.port) != __botClientStatus){
            __botClientStatus = await gameManager.getGameFlow(config.port);
            consoleManager.write(`👁‍🗨 Estado del bot: ${__botClientStatus}`);
        }

        // ********************
        switch(await gameManager.getGameFlow(config.port)){
                // Inactivo.
            case `"None"`:
                await clientManager.createGame(config.port, __queue);
                break;
                // Partida creada.
            case `"Lobby"`:
                if(!__botLookingForGame){
                    await clientManager.findGame(config.port);
                    __botLookingForGame = true;
                }
                break;
                // Una partida ha sido encontrada.
            case `"ReadyCheck"`:
                await clientManager.acceptGame(config.port);
                break;
                // En seleccion de campeón.
            case `"ChampSelect"`:
                if(__queue != config.QueueType.Aram)
                clientManager.pickChampion(config.port, __champion);
                break;
                // La partida está en progreso.
            case `"InProgress"`:
                // TODO: Mejorar esto.
                if(await ingameManager.getGameTime() > 30.0){
                    let iBestAlly = await ingameManager.getBestAlly();

                    robot.keyTap(`f${iBestAlly}`);

                    robot.moveMouse((config.screenSize.x /2) + 60, (config.screenSize.y /2) - 60)
                        
                    ks.sendKey('a');

                    await config.sleep(1);

                    robot.moveMouse((config.screenSize.x /2) - 60, (config.screenSize.y /2) + 60)
                    robot.mouseClick("right");

                    ks.sendKey(`f${iBestAlly}`);
                }
                break;
                // Dar honor
            case `"PreEndOfGame"`:
                robot.moveMouse((config.screenSize.x /2) + 60, (config.screenSize.y /2) - 60)
                robot.mouseClick("left");
                break;
                // Salir de la partida
            case `"EndOfGame"`:
                __botLookingForGame = false;
                await clientManager.createGame(config.port, __queue);
                break;
            default:
                await config.sleep(0.1);
                break;
        }
        await config.sleep(1);
    }
}
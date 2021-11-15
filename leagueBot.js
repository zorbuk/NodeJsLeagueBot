'use strict';
const robot = require("robotjs");
const config = require("./config.js");
const clientManager = require("./managers/clientManager.js");
const gameManager = require("./managers/gameManager.js");
const ingameManager = require("./managers/ingameManager.js");
const consoleManager = require("./managers/consoleManager.js");
const fileManager = require("./managers/fileManager.js");
const ks = require('node-key-sender');
const http = require('http');
const express = require('express');
const ip = require("ip");

/* *******************
    Este proyecto ha sido realizado por Zorbuk.
    https://github.com/zorbuk

    Las donaciones por paypal son bienvenidas: @mvrec

    Las dependencias usadas se pueden ver en package.json
*///******************

/*
    Web Local
*/

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/*
    Rutas
*/

app.get('/', async function(req,res){
    let __player = await clientManager.getCurrentSummoner(config.port);
    let __parsedPlayer = JSON.parse(__player);

    let __status = await gameManager.getGameFlow(config.port);
    let __gameTime = await ingameManager.getGameTime() >> 0;

    var __hours = ~~(__gameTime / 3600);
    var __minutes = ~~((__gameTime % 3600) / 60);
    var __seconds = ~~__gameTime % 60;

    let __kda = await ingameManager.getScore();

    res.render('index', 
    {playerName: __parsedPlayer["displayName"], 
    playerLevel: __parsedPlayer["summonerLevel"], 
    playerIcon: __parsedPlayer["profileIconId"], 
    playerLevelProgress: __parsedPlayer["percentCompleteForNextLevel"],
    playerStatus: __status,
    currentGameTime: `${__hours}h : ${__minutes}m : ${__seconds}s `,
    currentKda: __kda}
    );
});

app.get('/settings', function(req, res){

    let settings = fileManager.loadFile("./settings.json");

    res.render('config', {
        selectedChampionId: settings["selectedChampion"],
        allChampionsList: config.Champion, 
        selectedQueueId: settings["selectedQueue"],
        allQueues: config.QueueType,
        settingScreenSizeX: settings["screenSizeX"],
        settingScreenSizeY: settings["screenSizeY"],
    });
});

app.post('/applySettings', (req, res) => {

    fileManager.writeFile("./settings.json",{
        selectedQueue: req.body.selectedQueue,
        selectedChampion: req.body.selectedChampion,
        screenSizeX: req.body.screenSizeX,
        screenSizeY: req.body.screenSizeY
    })

    consoleManager.write("Configuración guardada.")

    res.redirect('/');
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
                await clientManager.createGame(config.port, fileManager.loadFile("./settings.json")["selectedQueue"]);
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
                if(fileManager.loadFile("./settings.json")["selectedQueue"] != config.QueueType.Aram)
                    clientManager.pickChampion(config.port, fileManager.loadFile("./settings.json")["selectedChampion"]);
                break;
                // La partida está en progreso.
            case `"InProgress"`:
                // TODO: Mejorar esto.
                    let gameTime = await ingameManager.getGameTime();

                    if(gameTime > 30.0){
                        let iBestAlly = await ingameManager.getBestAlly();

                        robot.keyTap(`f${iBestAlly}`);

                        robot.moveMouse((fileManager.loadFile("./settings.json")["screenSizeX"] /2) + 60, (fileManager.loadFile("./settings.json")["screenSizeY"] /2) - 60)
                            
                        ks.sendKey('a');

                        await config.sleep(1);

                        robot.moveMouse((fileManager.loadFile("./settings.json")["screenSizeX"] /2) - 60, (fileManager.loadFile("./settings.json")["screenSizeY"] /2) + 60)
                        robot.mouseClick("right");

                        ks.sendKey(`f${iBestAlly}`);
                    }
                break;
                // Dar honor
            case `"PreEndOfGame"`:
                robot.moveMouse((fileManager.loadFile("./settings.json")["screenSizeX"] /2) + 60, (fileManager.loadFile("./settings.json")["screenSizeX"] /2) - 60)
                robot.mouseClick("left");
                ks.sendKey("escape");
                break;
                // Salir de la partida
            case `"EndOfGame"`:
                __botLookingForGame = false;
                await clientManager.createGame(config.port, fileManager.loadFile("./settings.json")["selectedQueue"]);
                break;
            default:
                await config.sleep(0.1);
                break;
        }
        await config.sleep(1);
    }
}
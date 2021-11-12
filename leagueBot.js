const robot = require("robotjs");
const config = require("./config.js");
const clientManager = require("./managers/clientManager.js");
const gameManager = require("./managers/gameManager.js");
const ingameManager = require("./managers/ingameManager.js");
const consoleManager = require("./managers/consoleManager.js");
const { tipoCola, campeon } = require("./config.js");
const ks = require('node-key-sender');
const http = require('http');
const express = require('express');
const path = require('path');
const ip = require("ip");
const { nextTick } = require("process");
const fs = require('fs');

/* ********************
    Este proyecto ha sido realizado por Zorbuk.
    https://github.com/zorbuk

    Las donaciones por paypal son bienvenidas: @mvrec

    Se ha usado lo siguiente:
    - Visual Studio Code, el editor.
    - Node.js, el framework.
    - Npm, el package manager.
    - Robot.js, framework para pixeles, control del ratón y del teclado.
    - ks, control del teclado ya que robot.js da algunos problemas.
    - Fs, modulo para archivos del sistema.
    - MemoryJs, leer datos del juego desde los offsets de la memoria.
    - Express, http, ip, path, ejs, para la web local.

    Configuración Básica:
    leagueBot.js || __cola : [por defecto, Bots Introducción]
    leagueBot.js || __campeon : [Por defecto, Ashe]
    config.js || screenSize : [Por defecto, 1920*1080]

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

app.get('/', function(req,res){
    let __player = JSON.parse(clientManager.obtenerCurrentSummoner(config.puerto));
    let __status = gameManager.obtenerGameFlow(config.puerto);
    res.render('index', 
    {playerName: __player["displayName"], 
    playerLevel: __player["summonerLevel"], 
    playerIcon: __player["profileIconId"], 
    playerLevelProgress: __player["percentCompleteForNextLevel"],
    playerStatus: __status}
    );
  });

app.get('/iniciar', function(req, res){
    __ejecutar = true;
    procesoIniciarPartida();
    res.redirect('/');
});


app.get('/detener', function(req, res){
    __ejecutar = false;
    res.redirect('/');
});

/*
    Server
*/

const server = http.createServer(app);

// ********************

main();
let __cola = tipoCola.botsIntroduccion;
let __campeon = campeon.Ashe;
let __botClientStatus;
let __botBuscandoPartida = false;
let __botPartidaIniciada = false;
let __ejecutar = true;

// ********************

async function main(){
    console.clear();
    consoleManager.escribir("LeagueBot JS hecho por Zorbuk en Nodejs con Robotjs");
    consoleManager.escribir("☕ Si deseas apoyar el proyecto, las donaciones son bienvenidas, pero no obligatorias 🙏");
    consoleManager.escribir("❤️ Paypal: @mvrec")
    consoleManager.escribir("👉 Las actualizaciones las encontrarás en https://github.com/zorbuk/NodeJsLeagueBot")
    consoleManager.escribir("👽 Si tienes algun problema publicalo en https://github.com/zorbuk/NodeJsLeagueBot/issues")
    consoleManager.escribir("🗣 Discord: https://discord.gg/KZXVh8SbA9")

    while(config.auth===null){
        clientManager.inicializar();
        await config.sleep(2);
    }

    consoleManager.escribir(`✅ Auth '${config.auth}'`);
    consoleManager.escribir(`✅ Puertos 'Cliente: ${config.puerto}, Juego: ${config.puertoIngame}'`);

    server.listen(config.localServerPuerto);
    consoleManager.escribir(`✅ ${ip.address()}:${config.localServerPuerto}`);

    fs.writeFile(`api/respuestas/gameflow-phase.json`, '"None"', (err) =>{
        if (err) return console.log(err);
    });
}

async function procesoIniciarPartida(){
    while(__ejecutar){
        
        // ********************
        // Evitar el spam en consola.
        // ********************

        if(gameManager.obtenerGameFlow(config.puerto) != __botClientStatus){
            __botClientStatus = gameManager.obtenerGameFlow(config.puerto);
            consoleManager.escribir(`👁‍🗨 Estado del bot: ${JSON.parse(__botClientStatus)}`);
        }

        // ********************
        switch(gameManager.obtenerGameFlow(config.puerto)){
                // Inactivo.
            case `"None"`:
                clientManager.crearPartida(config.puerto, __cola);
                break;
                // Partida creada.
            case `"Lobby"`:
                if(!__botBuscandoPartida){
                    clientManager.buscarPartida(config.puerto);
                    __botBuscandoPartida = true;
                }
                break;
                // Una partida ha sido encontrada.
            case `"ReadyCheck"`:
                clientManager.aceptarPartida(config.puerto);
                break;
                // En seleccion de campeón.
            case `"ChampSelect"`:
                if(__cola != config.tipoCola.aram)
                    clientManager.pickearCampeon(config.puerto, __campeon);
                break;
                // La partida está en progreso.
            case `"InProgress"`:
                if(__botGameStarted){
                    // TODO: Mejorar esto, se puede hacer mejor
                    let indexMejorAliado = ingameManager.obtenerMejorAliado();

                    robot.keyTap(`f${indexMejorAliado}`);

                    robot.moveMouse((config.screenSize.x /2) + 60, (config.screenSize.y /2) - 60)
                        
                    ks.sendKey('a');

                    await config.sleep(1);

                    robot.moveMouse((config.screenSize.x /2) - 60, (config.screenSize.y /2) + 60)
                    robot.mouseClick("right");

                    ks.sendKey(`f${indexMejorAliado}`);
                }else{
                    if(ingameManager.ocurrioEvento("GameStart"))
                    __botPartidaIniciada = true;
                }

                break;
                // Dar honor
            case `"PreEndOfGame"`:
                robot.moveMouse((config.screenSize.x /2) + 60, (config.screenSize.y /2) - 60)
                robot.mouseClick("left");
                break;
                // Salir de la partida
            case `"EndOfGame"`:
                __botBuscandoPartida = false;
                __botPartidaIniciada = false;
                clientManager.crearPartida(config.puerto, __cola);
                break;
            default:
                await config.sleep(0.1);
                break;
        }
        await config.sleep(1);
    }

    fs.writeFile(`api/respuestas/gameflow-phase.json`, '"None"', (err) =>{
        if (err) return console.log(err);
    });
}
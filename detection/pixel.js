/*
-------------------------
ESTE MODULO NO SE USA.
-------------------------
*/

const robot = require("robotjs");

module.exports = {
    color:{
        partida_en_curso:`101d1e`,
        campeon_controlado:`3e3406`,
        campeon_aliado:`0f2737`,
        campeon_enemigo:`3a0600`,
        subdito_aliado:`498ec5`,
        subdito_enemigo:`d05e5e`,
        torreta_enemiga:`ad9252`,
        minimapa_campeon_controlado:`ffffff`,
        minimapa_subditos_enemigos:`d9392f`,
        minimapa_subditos_aliados:`4c98d8`,
        minimapa_monstruos_jungla:`99691f`
    },
    obtenerColor: (color, startX, startY, width, height)=>{
        var img = robot.screen.capture(startX, startY, width, height);
        for (let x = startX; x < width; x++) {
            for (let y = startY; y < height; y++) {

                console.log(`buscando el color: ${color} ; ${x},${y}`);

                if(img.colorAt(x, y).toLowerCase() === color.toLowerCase()){
                    return {X:x,Y:y};
                }
            }
        }
    
        return null;
    },
    existeColorPuntoExacto: (color,x,y)=>{
        var img = robot.screen.capture(0, 0, 1920, 1080);
        if(img.colorAt(x, y).toLowerCase() === color.toLowerCase()){
            return true;
        }else{
            return false;
        }
    }
};
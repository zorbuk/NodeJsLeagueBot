/*
-------------------------
ESTE MODULO NO SE USA.
-------------------------
*/

const memoryjs = require('memoryjs');
const { LONG } = require('memoryjs');
const { offsets } = require('../config.js');
const __gameProcess = `League of Legends.exe`;

module.exports = {
    getBase: ()=>{
        //internal static Process[] TargetProcess = Process.GetProcessesByName("League of Legends");
        //return TargetProcess[0].MainModule.BaseAddress.ToInt32();

        //return 
    },
    getLocalPlayer: ()=>{
        return memoryjs.readMemory(__gameProcess, offsets.LocalPlayer, LONG);
    }
};
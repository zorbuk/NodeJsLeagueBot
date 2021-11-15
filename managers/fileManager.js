const fs = require('fs');

module.exports = {
    loadFile: (file) =>{
        try {
            const buffer = fs.readFileSync(file)
            const stringData = buffer.toString()
            return JSON.parse(stringData)
        } catch (error) {
            consoleManager.write(error);
            return []
        }
    },
    writeFile: (file, data) =>{
        const textJSON = JSON.stringify(data)
        fs.writeFileSync(file, textJSON)
    }
}
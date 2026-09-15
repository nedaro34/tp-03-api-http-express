const fileSystem = require("node:fs/promises");

async function leerDatos(ruta){
    const datosTexto = await fileSystem.readFile(ruta, "utf8");
    const datosObjeto = JSON.parse(datosTexto);
    return datosObjeto;
}

module.exports = { leerDatos };
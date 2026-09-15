const { leerDatos } = require("./archivos.js")
const path = require("node:path");
const express = require("express");

const puerto = 3000;
const rutaDatos = path.join(__dirname, "..", "datos", "instrumentos.json");

async function main() {
    try {
        const instrumentos = await leerDatos(rutaDatos);
        const aplicacion = express();
        aplicacion.use(express.json());

        aplicacion.get("/", (request, response) => {
            response.status(200).json({ disponibilidadAPI: true });
        })

        aplicacion.get("/api/instrumentos", (request, response) => {
            const filtro = request.query.familia;
            if (!filtro) {
                return response.status(200).json(instrumentos);
            }
            const familiaInstrumentos = instrumentos.filter(instrumento =>
                instrumento.familia.toLowerCase() === String(filtro).toLowerCase());
            response.status(200).json(familiaInstrumentos);
        })

        aplicacion.get("/api/instrumentos/:id", (request, response) => {
            const identificador = request.params.id;
            const instrumentoIdentificado = instrumentos.find(instrumento =>
                instrumento.id === Number(identificador))
            if (!instrumentoIdentificado) {
                return response.status(404).json({ error: "instrumento no encontrado" })
            }
            response.status(200).json(instrumentoIdentificado);
        })

        aplicacion.post("/api/instrumentos", (request, response) => {
            const { nombre, familia, origen, descripcion, disponible } = request.body;
            if (!nombre || !familia || !origen || !descripcion || disponible === undefined) {
                return response.status(400).json({ error: "faltan datos obligatorios para poder realizar el proceso" });
            }
            const id = instrumentos.length === 0 ? 1 : instrumentos[instrumentos.length - 1].id + 1;
            const nuevoInstrumento = {
                "id": id,
                "nombre": nombre,
                "familia": familia,
                "origen": origen,
                "descripcion": descripcion,
                "disponible": disponible,
            }
            instrumentos.push(nuevoInstrumento)
            response.status(201).json(nuevoInstrumento)
        })

        aplicacion.listen(puerto, () => {
            console.log(`Servidor disponible en http://localhost:${puerto}`);
        })

    } catch (error) {
        console.log("No se pudo iniciar el servidor debido a un error inesperado: ", error.message);
        process.exitCode = 1;
    }
}

main()
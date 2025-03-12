import mongoose from "mongoose";
import { mensajes } from "../libs/mensajes.js";
export async function conectarBD() {
    try {
        const conexionBD = await mongoose.connect("mongodb://localhost:27017/MongoDBApp");
        return mensajes(200,'Conexion exitosa');   
    } catch (error) {
        return mensajes(400, 'Error en Base de Datos Mongo', error);
    }
}

export async function desconectarBD() {
    try {
        const conexionBD = await mongoose.disconnect();
        return mensajes({'status': 200, 'mensaje': 'Desconectado Correctamente'});
    } catch (error) {
        return mensajes({'status': 400, 'mensaje': 'Error en Base de Datos Mongo', error});
    }
}
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import "dotenv/config";
import { mensajes } from '../libs/mensajes.js';
import { buscarUsuario, isAdmin } from '../db/usuariosDB.js';

export function encriptarPassword(password){
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10, 64, 'sha512').toString('hex');
    return {salt, hash};
}

export function validarPassword(password, salt, hash){
    const hashEvaluar = crypto.pbkdf2Sync(password, salt, 10, 64, 'sha512').toString('hex');
    return hashEvaluar === hash;
}

export function usuarioAutorizado(token, req){
    if(token == undefined){
        return mensajes(400, 'Usuario no autorizado');
    }
    
    jwt.verify(token,process.env.SECRET_TOKEN, (error, usuario)=>{
        if(error){
            return mensajes(400, 'Usuario no autorizado', error);
        } else {
            req.usuario = usuario;
            return mensajes(200, 'Bienvenido', usuario);
        }
    });
    return mensajes(200, 'Bienvenido', req.usuario);
}

export async function adminAutorizado(respuesta){
    const admin = await isAdmin(respuesta.id);
    if (!admin) {
        return mensajes(400, 'Admin no autorizado');
    } else {
        return mensajes(200, 'Admin autorizado');
    }
}
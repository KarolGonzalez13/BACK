import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { mensajes } from './mensajes.js';
export function crearCookie(data) {
   return new Promise((resolve, reject) => {
      jwt.sign(data, process.env.SECRET_TOKEN, { expiresIn: "1d" }, (error, token) => {
         if (error) {
            reject(mensajes(400, "Error, no se pudo crear el token"));
         }
         resolve(token);
      });
   });
}
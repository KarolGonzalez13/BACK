import { Router } from "express";
import { registro, login, modificarUsuario, eliminarUsuario, mostrarUsuarios, buscarUsuario } from "../db/usuariosDB.js";
import { adminAutorizado, usuarioAutorizado } from "../middlewares/funcionesPassword.js";

const router = Router();

router.post("/registro", async (req, res) => {
    const respuesta = await registro(req.body);
    res.cookie('token', respuesta.token,{
        httpOnly: true,  
        secure: false,   
        sameSite: "lax", 
        path: "/",          
    }).status(respuesta.status).json(respuesta.mensajeUsuario);
});

router.put("/modificar/:id", async (req, res) => {
    const respuesta = await modificarUsuario(req.params.id, req.body);
    res.status(respuesta.status).json(respuesta.mensajeUsuario);
});

router.delete("/eliminar/:id", async (req, res) => {
    const respuesta = await eliminarUsuario(req.params.id);
    res.status(respuesta.status).json(respuesta.mensajeUsuario);
});

router.get("/mostrar", async (req, res) => {
    const respuesta = await usuarioAutorizado(req.cookies.token, req);
    if (respuesta.status === 400) {
        return res.status(respuesta.status).json(respuesta.mensajeUsuario);
    }

    const usuarios = await mostrarUsuarios(req.usuario);
    res.status(usuarios.status).json(usuarios.mensajeUsuario);
});

router.get("/buscar/:id", async (req, res) => {
    const respuesta = await buscarUsuario(req.params.id);
    res.status(respuesta.status).json(respuesta.mensajeUsuario);
});

router.post("/login", async (req, res) => {
    const respuesta = await login(req.body);
    res.cookie("token", respuesta.token, {
        httpOnly: true,  
        secure: false,  
        sameSite: "lax", 
        path: "/",          
    }).status(respuesta.status).json(respuesta.mensajeUsuario);
});

router.get("/logout", (req, res) => {
    res.cookie("token","",{expires:new Date(0)}).clearCookie("token").status(200).json("Sesion cerrada correctamente");
});

router.get("/usuariosLogueados", (req, res) => {
    const respuesta = usuarioAutorizado(req.cookies.token, req);
    res.status(respuesta.status).json(respuesta.mensajeUsuario);
});

router.get("/admin", async (req, res) => {
    const respuesta = usuarioAutorizado(req.cookies.token, req);
    if (respuesta.status == 400) {
        res.status(respuesta.status).json(respuesta.mensajeUsuario);
    } else {
        const respuesta2 = await adminAutorizado(req.usuario);
        res.status(respuesta2.status).json(respuesta2.mensajeUsuario);
    }
});

router.get("/libre", (req, res) => {
    res.send("Ruta libre");
});

export default router;
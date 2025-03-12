import { Router } from "express";
import { registro, login, modificarUsuario, eliminarUsuario, mostrarUsuarios, buscarUsuario } from "../db/usuariosDB.js";
import { adminAutorizado, usuarioAutorizado } from "../middlewares/funcionesPassword.js";

const router = Router();

router.post("/registro", async (req, res) => {
    const respuesta = await registro(req.body);
    console.log(respuesta.mensajeOriginal);
    res.cookie('token', respuesta.token,{
        httpOnly: true,  
        secure: false,   
        sameSite: "lax", 
        path: "/",          
    }).status(respuesta.status).json(respuesta.mensajeUsuario);
});

router.put("/modificar/:id", async (req, res) => {
    console.log("Parametros que recibio la ruta: ", req.params.id, req.body);
    const respuesta = await modificarUsuario(req.params.id, req.body);
    console.log("Esto es lo que da respuesta de la ruta /modificar", respuesta);
    res.status(respuesta.status).json(respuesta.mensajeUsuario);
});

router.delete("/eliminar/:id", async (req, res) => {
    const respuesta = await eliminarUsuario(req.params.id);
    res.status(respuesta.status).json(respuesta.mensajeUsuario);
});

router.get("/mostrar", async (req, res) => {
    console.log("Respuesta de mostrar");
    const respuesta = await usuarioAutorizado(req.cookies.token, req);
    console.log("Esto es lo que da respuesta de la ruta /mostrar", respuesta);
    if (respuesta.status === 400) {
        return res.status(respuesta.status).json(respuesta.mensajeUsuario);
    }
    console.log("Mensaje para ver sobre req.usuario", req.usuario, "Esto es todo");
    const usuarios = await mostrarUsuarios(req.usuario);
    console.log(usuarios);
    res.status(usuarios.status).json(usuarios.mensajeUsuario);
});

router.get("/buscar/:id", async (req, res) => {
    const respuesta = await buscarUsuario(req.params.id);
    console.log("Esto es el resultado de la respuesta busca: " , respuesta);
    res.status(respuesta.status).json(respuesta.mensajeUsuario);
});

router.post("/login", async (req, res) => {
    console.log("Respuesta de login");
    const respuesta = await login(req.body);
    console.log(respuesta);
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
    console.log("Respuesta de usuariosLogeados");
    const respuesta = usuarioAutorizado(req.cookies.token, req);
    console.log(respuesta);
    console.log(req.usuario);
    res.status(respuesta.status).json(respuesta.mensajeUsuario);
});

router.get("/admin", async (req, res) => {
    console.log("Respuesta de admin");
    const respuesta = usuarioAutorizado(req.cookies.token, req);
    if (respuesta.status == 400) {
        res.status(respuesta.status).json(respuesta.mensajeUsuario);
    } else {
        const respuesta2 = await adminAutorizado(req.usuario);
        console.log(respuesta2);
        res.status(respuesta2.status).json(respuesta2.mensajeUsuario);
    }
});

router.get("/libre", (req, res) => {
    res.send("Ruta libre");
});

export default router;
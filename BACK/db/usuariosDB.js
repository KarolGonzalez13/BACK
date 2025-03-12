import User from '../models/usuarioModelo.js';
import { encriptarPassword, validarPassword } from '../middlewares/funcionesPassword.js';
import { mensajes } from '../libs/mensajes.js';
import { crearCookie } from '../libs/jwt.js';

export const registro = async ({ username, email, password }) => {
    try { 
        const usuarioDuplicado = await User.findOne({ username }); 
        const emailDuplicado = await User.findOne({ email }); 
        if (usuarioDuplicado || emailDuplicado) { 
            return mensajes(400, 'Usuario registrado'); 
        };
        const { salt, hash } = encriptarPassword(password);
        const dataUser = new User({ 
        username,
        email,
        password: hash,
        salt
        });
        const respuestaMongo = await dataUser.save(); 
        const token = await crearCookie({
            id: respuestaMongo._id, 
            username, 
            email
        });
        return mensajes(200, 'Registro exitoso', '', token); 
    } catch (error) {
        return mensajes(400, 'Error, registro no exitoso', error);
    }
}

export const modificarUsuario = async (id, datosActualizados) => {
    try {
        if (datosActualizados.password) {
            const { salt, hash } = encriptarPassword(datosActualizados.password);
            datosActualizados.password = hash;
            datosActualizados.salt = salt;
        }
        const usuario = await User.findByIdAndUpdate(id, datosActualizados, { new: true });
        if (!usuario) {
            return mensajes(404, 'Usuario no encontrado');
        }
        return mensajes(200, 'Modificado exitosamente', usuario);
    } catch (error) {
        return mensajes(400, 'Error, modificacion no exitosa', error);
    }
}

export const eliminarUsuario = async (id) => {
    try {
        const usuario = await User.findByIdAndDelete(id);
        if (!usuario) {
            return mensajes(404, 'Usuario no encontrado');
        }
        return mensajes(200, 'Eliminado exitosamente');
    } catch (error) {
        return mensajes(400, 'Error, eliminacion no exitosa', error);
    }
}

export const mostrarUsuarios = async (usuario) => {
    try {
        let usuarios;
        const usuarioData = await User.findById(usuario.id);
        console.log("UsuarioData: ", usuarioData.tipoUsuario);
        if (usuarioData.tipoUsuario === 'admin') {
            usuarios = await User.find();
        } else {
            usuarios = await User.find({ _id: usuario.id });
        }
        console.log(usuarios);
        return mensajes(200, usuarios);
    } catch (error) {
        return mensajes(400, 'Error, usuarios no obtenidos', error);
    }
}

export const buscarUsuario = async (id) => {
    try {
        const usuario = await User.findById(id);
        return mensajes(200, usuario);
    } catch (error) {
        return mensajes(400, 'Error, usuarios no encontados');
    }
}

export const isAdmin = async (id) => {
    try {
        const usuario = await User.findById(id);
        console.log("Tipo de usuario: " + usuario.tipoUsuario);
        if (usuario.tipoUsuario == 'admin') {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

export const login = async ({ username, password }) => {
    try {
        const usuarioValido = await User.findOne({username});
        if (!usuarioValido) {
            return mensajes(400, "Usuario incorrecto");
        }
        const passwordValido = validarPassword(password, usuarioValido.salt, usuarioValido.password);
        if (!passwordValido) {
            return mensajes(400, "Password incorrecto")
        }
        const token = await crearCookie({id:usuarioValido._id});
        return mensajes(200, "Logeado exitosamente", "", token);
    } catch (error) {
        return mensajes(400, "Error al logearse", error);
    }
}
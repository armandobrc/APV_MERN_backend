import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import createToken from "../helpers/createToken.js";
import emailRegistro from '../helpers/emailRegistro.js';
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {

    const {email, nombre} = req.body;

    // Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email});
    if(existeUsuario) {
        const error = new Error("El correo ya existe");
        return res.status(400).json({msg : error.message}); // El mensaje del error creado arriba se almacena .message
    }

    try {
        // Guardar un nuevo usuario en la BD
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        // Enviar el email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });

        res.json(veterinarioGuardado)
    } catch (error) {
        console.log(error);
    }
}

const perfil = (req, res) => {

    const { veterinario } = req
    res.json(veterinario);
}

const confirmar = async (req, res) => {
    const {token} = req.params // req.params para leer datos de la url

    const usuarioConfirmar = await Veterinario.findOne({token});

    if(!usuarioConfirmar){
        const error = new Error("Token no valido");
        return res.status(404).json({msg: error.message});
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;

        await usuarioConfirmar.save();

        res.json({msg : 'Usuario confirmado correctamente'});
    } catch (error) {
        console.log(error);
    }
}

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    // Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email});

    if(!usuario){
        const error = new Error("El Usuario no existe");
        return res.status(404).json({msg: error.message});
    }

    // Comprobar si el usuario esta confirmado
    if(!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message});
    }

    // Revisar el password
    if(await usuario.comprobarPassword(password)) {
        // Autenticar
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });
    } else {
        const error = new Error("La contraseña es incorrecta")
        return res.status(403).json({msg : error.message});
    }

}

const olvidePassword = async(req, res) => {
    // Si el usuario NO existe
    const {email} = req.body; // req.body es usualmente la informacion de un formulario
    const existeVeterinario = await Veterinario.findOne({email});
    if(!existeVeterinario) {
        const error = new Error("El Usuario no existe");
        return res.status(400).json({msg : error.message});
    }
    // Si el usuario existe
    try {
        existeVeterinario.token = createToken();
        await existeVeterinario.save();

        // Enviar email con instrucciones

        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({msg : "Hemos enviado un email con las instrucciones"});
    } catch (error) {
        console.log(error)
    }
}

const comprobarToken = async (req, res) => {
    const {token} = req.params // req.params es la informacion de la url

    const tokenValido = await Veterinario.findOne({token});

    if(tokenValido) {
        res.json({msg : "Token valido, el usuario existe"});
    } else {
        const error = new Error("Token no valido");
        return res.status(400).json({msg : error.message});
    }
}

const nuevoPassword = async(req, res) => {
    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token});

    if(!veterinario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({msg : error.message});
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json("Password modificado correctamente");
    } catch (error) {
        console.log(error);
    }
}

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id); // req.params es el registro que se editara, obtenidod e la url
    if(!veterinario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    // Si el usuario agrega un correo nuevo que ya exite en la bd
    const {email} = req.body
    if(email !== req.body.email) { // req.body la informacion que va a editar el registro
        const existeEmail = await Veterinario.findOne(email);
        if(existeEmail) {
            const error = new Error("Este Email ya existe");
            return res.status(400).json({msg: error.message});
        }
    }
    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();

        res.json(veterinarioActualizado); // Se retorna porque una vez que se presione en guardar cambios y se obtenga una respuesta correcta, se sincronizara el state de auth con la repsuesta que venga de la bd. De esta forma estaran sincronizados el backend con el state
    } catch (error) {
        console.log(error)
    }

}

const actualizarPassword = async (req, res) => {
    // Leer datos
    const {id} = req.veterinario;
    const {pwd_actual, pwd_nuevo} = req.body;


    // Comprobar que el vet exista
    const veterinario = await Veterinario.findById(id);
    if(!veterinario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    // Comprobar su password
    if(await veterinario.comprobarPassword(pwd_actual)){
        // Almacenar nuevo password
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({msg: "El password se ha modificado correctamente"});
    } else {
        const error = new Error("El Password actual es incorrecto");
        return res.status(400).json({msg: error.message});
    }

}

export { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword };
import jwt from 'jsonwebtoken';

const generarJWT = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "30d",
    }) // Sign crea un nuevo jwt. Se le pasa un objeto con lo que se va a agregar al jwt. Lo siguiente es agregar el secret key. Luego podemos agregarle opciones, entre ellas cuando expira el jwt
}

export default generarJWT;
const createToken = () => {
    return Date.now().toString(32) + Math.random().toString(32).substring(2); // 32 para generar un radio de 32 posibles caracteres substring(2) para eliminar los dos primeros caracteres (en este caso el 0.)
}

export default createToken;
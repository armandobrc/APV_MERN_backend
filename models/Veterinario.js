import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import createToken from '../helpers/createToken.js';

const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true, // Required para tambien tener validacion en el servidor
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true // trim para eliminar espacios en blanco al inicio y final
    },
    telefono: {
        type: String,
        default: null, // default null cuando no es obligatorio el campo
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: createToken()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

// Hay ciertas acciones que ocurren antes y despues de guardar nuevos registros. Para hashear, se hace antes de
veterinarioSchema.pre('save', async function (next) {
    // Para evitar que se hashee el password nuevamente cuando el usuario quiera modificar su contraseña
    if(!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10) // Salt son rondas de hasheo. 10 es el default
        this.password = await bcrypt.hash(this.password, salt)
}) // Antes de almacenarlo en la base de datos. Usamos function ya que haremos referencia a this que tendra los datos del nuevo registro

veterinarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password) // Uno de los metodos de bcrypt es .compare que permite comparar, en este caso, los password ya hasheados con los que escribe el usuario. Toma dos parametros, el password que escribe el usuario, y el que ya esta hasheado
} // Con .methods podemos registrar funciones que se ejecutan unicamente en donde lo utilizamos

// Para registralo en mongoose. Con model ya queda registrado como un modelo, como algo que tiene que interactuar con la base de datos. Le damos un nombre que se recomienda sea el mismo. Sin embargo, esto solo lo registra como modelo. Tenemos que decirle que el Schema es la forma que tendra los datos, por lo tanto, la variable de veterinarioSchema se pasa como segundo argumento
const Veterinario = mongoose.model('Veterinario', veterinarioSchema);

export default Veterinario;
import mongoose from "mongoose";

const pacientesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    propietario: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now()
    },
    sintomas: {
        type: String,
        required: true
    },

    veterinario: {
        type: mongoose.Schema.Types.ObjectId,     // Para alamacenar una referencia de a cual veterinario le pertenece este paciente. Lo hacemos mediante el id del veterinario
        ref: "Veterinario" // En caso de que queramos traernos la informacion del veterinario
    }
},
    {
        timestamps: true, // Para que nos cree las columnas de editado y creado
    }
)

const Paciente = mongoose.model("Paciente", pacientesSchema);

export default Paciente;
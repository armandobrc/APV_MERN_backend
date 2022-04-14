import express from "express"; // Cuando son dependencias instaladas via npm no requiere la extension
import dotenv from "dotenv";
import cors from 'cors';
import conectarDB from "./config/db.js"; // Debido a que es un archivo que hemos creado, le debemos indicar a node la extension
import veterinarioRoutes from './routes/veterinarioRoutes.js'; // No tiene que llamarse igual a la variable (router)
import pacienteRoutes from './routes/pacienteRoutes.js';

const app = express();

// Especificar que enviaremos datos tipo json
app.use(express.json());

dotenv.config(); // Escanea y busca el archivo .env automaticamente
conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback) {
        if(dominiosPermitidos.indexOf(origin) !== -1){
            // El origin del request esta permitido
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'))
        }
    }
}

app.use(cors(corsOptions));

app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes)

const PORT = process.env.PORT || 4000; // Como no existe la variable en el archivo .env, aplicara el puerto 4000. Esta variable existira una vez hecho el deployment

app.listen( PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});
import mongoose from "mongoose";

const conectarDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {

        useNewUrlParser: true,
        useUnifiedTopology: true

        }
        );
        const url = `${db.connection.host}:${db.connection.port}` // Nos da una url y el puerto donde se esta conectando
        console.log(`MongoDB conectado en: ${url}`)
    } catch (error) {
        console.log(`error: ${error}`)
        process.exit(1); // Permite mostar el mensaje de error
    }
}

export default conectarDB;
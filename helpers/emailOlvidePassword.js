import nodemailer from 'nodemailer';

const emailOlvidePassword = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    // Enviar el email
    const {nombre, email, token} = datos;

    const info = await transporter.sendMail({
        from: "APV - Administrador de Pacientes de Veterinaria",
        to: email,
        subject: "Reestablece tu contraseña",
        text: "Reestablece tu contraseña", // version sin HTML
        html:`<p>Hola ${nombre}, has solicitado reestablecer tu password</p>
        <p>Da click en el siguiente enlace para generar un nuevo password:</p>
        <p><a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablece tu contraseña</a></p>

        <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
        `
    })
}

export default emailOlvidePassword;
import express from 'express';
import { registrar, 
        perfil,
        confirmar,
        autenticar,
        olvidePassword,
        comprobarToken,
        nuevoPassword,
        actualizarPerfil,
        actualizarPassword
} from '../controllers/veterinarioController.js';
import checkAuth from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas para el area publica
router.post('/', registrar); // Es lo mimso que visitar api/veterinarios
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword);
router.get('/olvide-password/:token', comprobarToken).post(nuevoPassword);

// Area privada
router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actulizar-password', checkAuth, actualizarPassword);

export default router;
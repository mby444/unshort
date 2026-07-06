import express from 'express';
import { renderHome, renderAbout } from '../controllers/indexController.js';

const router = express.Router();

// Define routes
router.get('/', renderHome);
router.get('/about', renderAbout);

export default router;

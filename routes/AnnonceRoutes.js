const express = require('express');
const router = express.Router();
const {
    createAnnonce,
    getAnnonces,
    getAnnonce,
    getAnnoncesByCategory,
    getAnnoncesByUser,
    updateAnnonce,
    deleteAnnonce
} = require('../controllers/AnnonceController');

const upload = require("../config/multer");

const isAuthenticated = require('../middlewares/isAuthenticated');

router.post('/post_annonce', isAuthenticated, upload.array('pics', 10), createAnnonce);
router.get('/get_annonces', getAnnonces);
router.get('/get_annonce/:id', getAnnonce);
router.get('/get_annonces_by_category/:id', getAnnoncesByCategory);
router.get('/get_annonces_by_user/:id', getAnnoncesByUser);
router.put('/update_annonce/:id', isAuthenticated, updateAnnonce);
router.delete('/delete_annonce/:id', isAuthenticated, deleteAnnonce);


module.exports = { router };
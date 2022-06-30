const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
const {
    createReservation,
    getUserReservations,
    getReceiverReservations,
    deleteReservation
} = require('../controllers/ReservationController');

const isAuthenticated = require('../middlewares/isAuthenticated');

router.post('/create_reservation', isAuthenticated, createReservation);
router.get('/get_user_reservations', isAuthenticated, getUserReservations);
router.get('/get_receiver_reservations', isAuthenticated, getReceiverReservations);
router.delete('/delete_reservation/:id', isAuthenticated, deleteReservation)

module.exports = { router };
const express = require('express');
const router = express.Router();
const {
    createReservation,
    getUserReservations,
    getReceiverReservations
} = require('../controllers/ReservationController');

const isAuthenticated = require('../middlewares/isAuthenticated');

router.post('/create_reservation', isAuthenticated, createReservation);
router.get('/get_user_reservations', isAuthenticated, getUserReservations);
router.get('/get_receiver_reservations', isAuthenticated, getReceiverReservations);

module.exports = { router };
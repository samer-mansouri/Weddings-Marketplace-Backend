const express = require('express');
const mongoose = require('mongoose');
const Reservation = mongoose.model('Reservation');

const createReservation = async (req, res) => {
    const reservation = new Reservation({
        userId: req.user,
        receiver: req.body.receiver,
        annonceId: req.body.annonceId
    });
    const savedReservation = await reservation.save();
    res.send({
        message: 'Reservation created successfully',
        reservation: savedReservation
    });
}

const getUserReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({userId: req.user})
        .populate("annonceId", "title description price")
        .exec();
        res.send({
            message: 'Reservations retrieved successfully',
            reservations: reservations
        });
    } catch (err) {
        res.status(500).send({"Error": "Internal Server Error"})
    }
}

const getReceiverReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({receiver: req.user})
        .populate("annonceId", "title description price")
        .exec();
        res.send({
            message: 'Reservations retrieved successfully',
            reservations: reservations
        });
    } catch (err) {
        res.status(500).send({"Error": "Internal Server Error"})
    }
}



module.exports = {
    createReservation,
    getUserReservations,
    getReceiverReservations
}
const express = require('express');
const mongoose = require('mongoose');
const Reservation = mongoose.model('Reservation');

const createReservation = async (req, res) => {
    const reservation = new Reservation({
        userId: req.user,
        receiver: req.body.receiver,
        annonceId: req.body.annonceId,
        reservationDate: req.body.reservationDate
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
        .populate("annonce", "title description price")
        .populate("annonceur", "firstName lastName picture")
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
        .populate("user", "firstName lastName picture")
        .populate("annonce", "title description price")
        .exec();
        res.send({
            message: 'Reservations retrieved successfully',
            reservations: reservations
        });
    } catch (err) {
        res.status(500).send({"Error": "Internal Server Error"})
    }
}


const deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);
        res.send({
            message: 'Reservation deleted successfully',
            reservation: reservation
        });
    } catch (err) {
        res.status(500).send({"Error": "Internal Server Error"})
    }
}


module.exports = {
    createReservation,
    getUserReservations,
    getReceiverReservations,
    deleteReservation
}
const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Annonce = mongoose.model('Annonce');
const Category = mongoose.model('Category');
const cloudinary = require('../config/cloudinary');

let createAnnonce = async (req, res) => {
        let pics = req.files;
        console.log(req.files)
        let userId = req.user;
        if(!pics){
            res.status(400).send({"Error": "No pictures provided"})
        }

        let multiplePicsPromise = await pics.map((pic) => 
            cloudinary.uploader.upload(pic.path)
        );
        let imageResponses = await Promise.all(multiplePicsPromise);

        const newAnnonce = await new Annonce({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            categoryId: req.body.categoryId,
            userId: userId,
            images: imageResponses.map((pic) => pic.secure_url)
        });

        
        await newAnnonce.save();
        res.send({
            message: 'Annonce created successfully',
            annonce: newAnnonce
        });

        

}

const getAnnonces = async (req, res) => {
    try {
        const annonces = await Annonce.find({})
        .populate("user", "firstName lastName picture address")
        .populate("category", "name")
        .sort('-createdAt')
        .exec();
        res.send({
            message: 'Annonces retrieved successfully',
            annonces: annonces
        });
    } catch (err) {
        res.status(500).send({"Error": "Internal Server Error"})
    }
}

const getAnnonce = async (req, res) => {
    try {
        const annonce = await Annonce.findById(req.params.id)
        .populate("user", "firstName lastName picture address")
        .populate("category", "name")
        .exec();
        res.send({
            message: 'Annonce retrieved successfully',
            annonce: annonce
        });
    } catch (err) {
        res.status(500).send({"Error": "Internal Server Error"})
    }
}


const getAnnoncesByCategory = async (req, res) => {
    try {
        const annonces = await Annonce.find({categoryId: req.params.id})
        .populate("user", "firstName lastName picture")
        .populate("category", "name")
        .sort('-createdAt')
        .exec();
        res.send({
            message: 'Annonces retrieved successfully',
            annonces: annonces
        });
    } catch (err) {
        res.status(500).send({"Error": "Internal Server Error"})
    }
}


const getAnnoncesByUser = async (req, res) => {
    try {
        const annonces = await Annonce.find({userId: req.params.id})
        .populate("user", "firstName lastName picture")
        .populate("category", "name")
        .sort('-createdAt')
        .exec();
        res.send({
            message: 'Annonces retrieved successfully',
            annonces: annonces
        });
    } catch (err) {
        res.status(500).send({"Error": "Internal Server Error"})
    }
}


const updateAnnonce = async (req, res) => {
    try {
        const annonce = await Annonce.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send({
            message: 'Annonce updated successfully',
            annonce: annonce
        });
    } catch (err) {
        res.status(500).send({"Error": "Internal Server Error"})
    }
}

const deleteAnnonce = async (req, res) => {
    try {
        const annonce = await Annonce.findByIdAndDelete(req.params.id);
        res.send({
            message: 'Annonce deleted successfully',
            annonce: annonce
        });
    } catch (err) {
        res.status(500).send({"Error": "Internal Server Error"})
    }
}



module.exports = {
    createAnnonce,
    getAnnonces,
    getAnnonce,
    getAnnoncesByCategory,
    getAnnoncesByUser,
    updateAnnonce,
    deleteAnnonce
}
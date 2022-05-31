const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Annonce = mongoose.model('Annonce');
const Category = mongoose.model('Category');
const cloudinary = require('../config/cloudinary');


const createCategory = async (req, res) => {

    const result = await cloudinary.uploader.upload(req.file.path);
    const category = new Category({
        name: req.body.name,
        description: req.body.description,
        image: result.secure_url
    });
    const savedCategory = await category.save();
    res.send({
        message: 'Category created successfully',
        category: savedCategory
    });
}

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({})
        .populate("annonces", "title description price")
        .exec();
        res.send({
            message: 'Categories retrieved successfully',
            categories: categories
        });
    } catch (err) {
        res.status(500).send({"Error": "Internal Server Error"})
    }
}

const getCategoriesNames = async (req, res) => {
    try {
        const categories = await Category.find({})
        .select("name")
        .exec();
        res.send({
            message: 'Categories names retrieved successfully',
            categories: categories
        });
    } catch (err) {
        res.status(500).send({"Error": "Internal Server Error"})
    }
}


const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        .populate("annonces", "title description price")
        .exec();
        res.send({
            message: 'Category retrieved successfully',
            category: category
        });
    } catch (err) {
        res.status(500).send({"Error": "Internal Server Error"})
    }
}

const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            picture: req.body.picture
        }, {
            new: true
        });
        res.send({
            message: 'Category updated successfully',
            category: category
        });
    } catch (err) {
        res.status(500).send({"Error": "Internal Server Error"})
    }
}

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        const annonces = await Annonce.find({categoryId: req.params.id});
        await category.remove();
        await annonces.forEach(async annonce => {
            await annonce.remove();
        });
        res.send({
            message: 'Category deleted successfully'
        });
    } catch (err) {
        res.status(500).send({"Error": "Internal Server Error"})
    }
}


module.exports = {
    createCategory,
    getCategories,
    getCategoriesNames,
    getCategory,
    updateCategory,
    deleteCategory
}
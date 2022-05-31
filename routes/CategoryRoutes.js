const express = require('express');
const router = express.Router();

const {
    createCategory,
    getCategories,
    getCategoriesNames,
    getCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/CategoryController');

const upload = require("../config/multer");

const isAuthenticated = require('../middlewares/isAuthenticated');

router.post('/create_category', isAuthenticated, upload.single('picture'), createCategory);
router.get('/get_categories', getCategories);
router.get('/get_categories_names', getCategoriesNames);
router.get('/get_category/:id', getCategory);
router.put('/update_category/:id', isAuthenticated, updateCategory);
router.delete('/delete_category/:id', isAuthenticated, deleteCategory);

module.exports = { router };
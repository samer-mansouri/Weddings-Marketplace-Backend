const express = require('express');
const router = express.Router();
const {
    getMessages,
    addMessage,
    getUserContactedUsers, getUserConactedUsersWithLastMessage
} = require('../controllers/MessageController');

const isAuthenticated = require('../middlewares/isAuthenticated');


router.post('/get_messages', isAuthenticated, getMessages);
router.post('/add_message', isAuthenticated, addMessage);
router.get('/get_user_contacted_users', isAuthenticated, getUserContactedUsers);
router.get('/get_user_conacted_users_with_last_message', isAuthenticated, getUserConactedUsersWithLastMessage);


module.exports = { router };
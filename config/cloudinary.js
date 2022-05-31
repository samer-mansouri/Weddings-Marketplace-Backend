const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'daoeyqp1y', 
    api_key: '334393628931839', 
    api_secret: 'v0K2vcroNdL3WRXVi4zn8TMFWNg' 
});

module.exports = cloudinary;
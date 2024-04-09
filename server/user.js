const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    subscription: Object // Assuming subscription details are stored as an object
});

module.exports = mongoose.model('User', userSchema);
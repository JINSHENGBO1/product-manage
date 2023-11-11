const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userId: String,
    password: String
});


module.exports = {
    UserSchema
}
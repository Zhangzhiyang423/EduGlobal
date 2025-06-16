const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 


const userSchema = new mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};



userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            id: this._id,
            name: this.name,
            email: this.email,
            role: this.role
        },
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );
};


module.exports = mongoose.models.User || mongoose.model('User', userSchema);

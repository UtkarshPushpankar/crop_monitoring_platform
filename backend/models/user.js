const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    provider: { type: String }, // google or microsoft
    providerId: { type: String },
    createdAt: { type: Date, default: Date.now },
    password : { type: String }
});

module.exports = mongoose.model("User", userSchema);

const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'connected', 'not connected'], default: 'not connected' },
});

const UserSchema = new mongoose.Schema({
    
    name: { type: String, required: true },
    email: { type: String, required : true , unique : true},
    password: { type: String, required: true},
    isJobProvider: { type: Boolean, required: true },
    connections: [connectionSchema]
}, {
    timestamps : true
});

module.exports = mongoose.model('User', UserSchema);

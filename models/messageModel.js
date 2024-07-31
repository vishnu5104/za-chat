const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'connected'], default: 'pending' },
    isJobProvider: { type: Boolean, required: true },
  }, {
    timestamps: true,
  });

module.exports = mongoose.model("Message", messageSchema);

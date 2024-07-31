
const express = require("express");
const mongoose = require('mongoose');

const authRoutes = require("./routes/userRoute");
const logger = require("./logger/logger");
const chatRouter = require('./routes/sendMessagesRoute'); 
const cronJob = require('./utils/cronJob');
// const PORT = process.env.PORT || 5000;

// app.use(bodyparser.json());


const createChatApp = (config) => {
  const app = express();

  app.use(express.json());
  
app.use('/api/auth', authRoutes);



app.use('/api/chat',chatRouter);

const startServer = async () => {
  try {
    await mongoose.connect(config.mongodbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

startServer();
return app;
};


module.exports = createChatApp;
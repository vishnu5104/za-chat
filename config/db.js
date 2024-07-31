const { MongoClient, ServerApiVersion } = require('mongodb');
const { default: mongoose } = require('mongoose');
require('dotenv').config();

const uri = 'mongodb+srv://development:8iQ74acC8CkUQF9b@cluster0.vmc4p0z.mongodb.net/chatdb?retryWrites=true&w=majority&appName=Cluster0' ;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = mongoose.connect(uri,{
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
}).then(()=>console.log("MongoDB Connected"))
.catch(err => console.log(err));

module.exports = client;
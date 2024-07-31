 //const admin = require('firebase/app');
 const { initializeApp } = require("firebase/app");
 const { getMessaging, getToken } = require("firebase/messaging");
  //const serviceAccount = require('./serviceAccountKey.json');
 
 
 
 //  admin.initializeApp({
 //   credential: serviceAccount
 // });
 
 
 
 
 
 
   
 //   // Initialize Firebase
 // const app = initializeApp(firebaseConfig)
 
 
 // const messaging = getMessaging();
 // getToken(messaging, { vapidKey: 'BNW1F8jzbiJKU50VzfXxz40NhmZ94DPtR9hJ4zR8el6Y0C2-Zi88YgZmZi5CMCRmXMpr8RYc0xnbIcOf90rlSvw' }).then((currentToken) => {
 //   if (currentToken) {
 //     // Send the token to your server and update the UI if necessary
 //     // ...
 //   } else {
 //     // Show permission request UI
 //     console.log('No registration token available. Request permission to generate one.');
 //     // ...
 //   }
 // }).catch((err) => {
 //   console.log('An error occurred while retrieving token. ', err);
 //   // ...
 // });
 
 
 const Conversation = require("../models/conversationModel.js");
 const Message = require("../models/messageModel.js");
 const User = require("../models/userModel.js");
 const { getReceiverSocketId, io } = require("../socket/socket.js");
 
 
 
 
 
 
 // Send message
 const sendMessage = async (req, res) => {
	try {
	  const { message } = req.body;
	  const { id: receiverId } = req.params;
	  const senderId = req.user._id.toString();
  
	  if (!message) {
		return res.status(400).json({ error: "Message content is required" });
	  }
  
	  const sender = await User.findById(senderId);
	  const receiver = await User.findById(receiverId);
  
	  if (!sender) {
		return res.status(404).json({ error: "Sender not found" });
	  }
  
	  if (!receiver) {
		return res.status(404).json({ error: "Receiver not found" });
	  }
  
	  // Check connection status
	  const senderConnection = sender.connections.find(
		(conn) => conn.userId.toString() === receiverId
	  );
	  const receiverConnection = receiver.connections.find(
		(conn) => conn.userId.toString() === senderId
	  );
  
	  console.log('Sender Connection:', senderConnection);
	  console.log('Receiver Connection:', receiverConnection);
  
	  // Determine if both users are connected
	  const isConnected = (senderConnection && senderConnection.status === 'accepted') ||
		(receiverConnection && receiverConnection.status === 'accepted');
  
	  console.log('Is Connected:', isConnected);
  
	  // Determine message status based on connection
	  const messageStatus = isConnected ? 'accepted' : 'pending';
  
	  // Find or create conversation
	  let conversation = await Conversation.findOne({
		participants: { $all: [senderId, receiverId] }
	  });
  
	  if (!conversation) {
		conversation = new Conversation({
		  participants: [senderId, receiverId],
		  messages: []
		});
	  }
  
	  console.log('sendeer info', sender)
	  // Create new message
	  const newMessage = new Message({
		senderId,
		receiverId,
		message,
		status: messageStatus,
		isJobProvider: sender.isJobProvider, // Set profileType correctly
	  });
  
	  // Add message to conversation
	  conversation.messages.push(newMessage._id);
  
	  // Save conversation and message
	  await Promise.all([conversation.save(), newMessage.save()]);
  
	  // Update past pending messages if now connected
	  if (isConnected) {
		await Message.updateMany(
		  { senderId, receiverId, status: "pending" },
		  { $set: { status: "accepted" } }
		);
		await Message.updateMany(
		  { senderId: receiverId, receiverId: senderId, status: "pending" , isJobProvider},
		  { $set: { status: "accepted" } }
		);
	  }
  
	  // Emit to receiver if connected
	  const receiverSocketId = getReceiverSocketId(receiverId);
	  if (receiverSocketId) {
		io.to(receiverSocketId).emit("newMessage", newMessage);
	  }
  
	  res.status(201).json(newMessage);
	} catch (error) {
	  console.log("Error in sendMessage controller: ", error.message);
	  res.status(500).json({ error: "Internal server error" });
	}
  };
  
  
 
 
   
 // const sendMessage = async (req, res) => {
 // 	try {
 // 	  const { message } = req.body;
 // 	  const { id: receiverId } = req.params;
 // 	  const senderId = req.user._id.toString();
   
 // 	  if (!message) {
 // 		return res.status(400).json({ error: "Message content is required" });
 // 	  }
   
 // 	  const sender = await User.findById(senderId);
 // 	  const receiver = await User.findById(receiverId);
   
 // 	  if (!receiver) {
 // 		return res.status(404).json({ error: "Receiver not found" });
 // 	  }
   
 // 	  // Check connection status
 // 	  const senderConnection = sender.connections.find(
 // 		(conn) => conn.userId.toString() === receiverId
 // 	  );
 // 	  const receiverConnection = receiver.connections.find(
 // 		(conn) => conn.userId.toString() === senderId
 // 	  );
   
 // 	  console.log('Sender Connection:', senderConnection);
 // 	  console.log('Receiver Connection:', receiverConnection);
   
 // 	  // Determine if both users are connected
 // 	  const isConnected = senderConnection && senderConnection.status === 'accepted' ||
 // 		receiverConnection && receiverConnection.status === 'accepted';
   
 // 	  console.log('Is Connected:', isConnected);
 // 	  if(senderConnection || receiverConnection){
 // 		console.log('Is Connected to receiver connection or sender connection')
 // 	  }
   
 // 	  // Determine message status based on connection
 // 	  const messageStatus = isConnected ? 'accepted' : 'pending';
   
 // 	  // Find or create conversation
 // 	  let conversation = await Conversation.findOne({
 // 		participants: { $all: [senderId, receiverId] }
 // 	  });
   
 // 	  if (!conversation) {
 // 		conversation = new Conversation({
 // 		  participants: [senderId, receiverId],
 // 		  messages: []
 // 		});
 // 	  }
   
 // 	  // Create new message
 // 	  const newMessage = new Message({
 // 		senderId,
 // 		receiverId,
 // 		message,
 // 		status: messageStatus,
 // 	  });
   
 // 	  // Add message to conversation
 // 	  conversation.messages.push(newMessage._id);
   
 // 	  // Save conversation and message
 // 	  await Promise.all([conversation.save(), newMessage.save()]);
   
 // 	  // Update past pending messages if now connected
 // 	  if (isConnected) {
 // 		await Message.updateMany(
 // 		  { senderId, receiverId, status: "pending" },
 // 		  { $set: { status: "accepted" } }
 // 		);
 // 		await Message.updateMany(
 // 		  { senderId: receiverId, receiverId: senderId, status: "pending" },
 // 		  { $set: { status: "accepted" } }
 // 		);
 // 	  }
   
 // 	  // Emit to receiver if connected
 // 	  const receiverSocketId = getReceiverSocketId(receiverId);
 // 	  if (receiverSocketId) {
 // 		io.to(receiverSocketId).emit("newMessage", newMessage);
 // 	  }
   
 // 	  console.log("sender check",sender);
 // 	  // Send FCM notification to the receiver
 // 	  if (receiver.fcmToken) {
 // 		const message = {
 // 		  notification: {
 // 			title: 'New Message',
 // 			body: `You have a new message from ${sender.name}: ${message}`
 // 		  },
 // 		  token: receiver.fcmToken
 // 		};
   
 // 		admin.messaging().send(message)
 // 		  .then((response) => {
 // 			console.log('Successfully sent message:', response);
 // 		  })
 // 		  .catch((error) => {
 // 			console.log('Error sending message:', error);
 // 		  });
 // 	  }
   
 // 	  res.status(201).json(newMessage);
 // 	} catch (error) {
 // 	  console.log("Error in sendMessage controller: ", error.message);
 // 	  res.status(500).json({ error: "Internal server error" });
 // 	}
 //   };
   
   
   
   
   
 
 // Send connection request
 const sendConnectionRequest = async (req, res) => {
   try {
	 const senderId = req.user._id.toString();
	 const { userId: receiverId } = req.body;
 
	 await User.findByIdAndUpdate(receiverId, {
	   $push: { connections: { userId: senderId, status: 'pending' } },
	 });
 
	 res.status(200).json({ message: "Connection request sent" });
   } catch (error) {
	 console.log("Error in sendConnectionRequest controller: ", error.message);
	 res.status(500).json({ error: "Internal server error" });
   }
 };
 
 // Accept connection request
 const acceptConnectionRequest = async (req, res) => {
	 try {
	   const receiverId = req.user._id.toString();
	   const { userId: senderId } = req.body;
   
	   // Update connection status to accepted for both users
	   const receiverUpdate = await User.updateOne(
		 { _id: receiverId, "connections.userId": senderId },
		 { $set: { "connections.$.status": "accepted" } }
	   );
   
	   const senderUpdate = await User.updateOne(
		 { _id: senderId, "connections.userId": receiverId },
		 { $set: { "connections.$.status": "accepted" } }
	   );
   
	   console.log('Receiver Update: ', receiverUpdate);
	   console.log('Sender Update: ', senderUpdate);
   
	   // Retrieve updated documents to verify connection status
	   const updatedReceiver = await User.findById(receiverId);
	   const updatedSender = await User.findById(senderId);
   
	   console.log('Updated Receiver Connections: ', updatedReceiver.connections);
	   console.log('Updated Sender Connections: ', updatedSender.connections);
   
	   // Update status of past pending messages to accepted
	   await Message.updateMany(
		 { senderId, receiverId, status: "pending" },
		 { $set: { status: "accepted" } }
	   );
   
	   await Message.updateMany(
		 { senderId: receiverId, receiverId: senderId, status: "pending" },
		 { $set: { status: "accepted" } }
	   );
   
	   res.status(200).json({ message: "Connection request accepted and messages updated" });
	 } catch (error) {
	   console.log("Error in acceptConnectionRequest controller: ", error.message);
	   res.status(500).json({ error: "Internal server error" });
	 }
   };
   
   
   
   
   
 
 // Get messages
 const getMessages = async (req, res) => {
   try {
	 const { id: userToChatId } = req.params;
	 const senderId = req.user._id;
 
	 const conversation = await Conversation.findOne({
	   participants: { $all: [senderId, userToChatId] },
	 }).populate("messages");
 
	 if (!conversation) return res.status(200).json([]);
 
	 const messages = conversation.messages;
 
	 res.status(200).json(messages);
   } catch (error) {
	 console.log("Error in getMessages controller: ", error.message);
	 res.status(500).json({ error: "Internal server error" });
   }
 };
 
 // Accept message
 const acceptMessage = async (req, res) => {
   try {
	 const { id: messageId } = req.params;
 
	 const message = await Message.findById(messageId);
	 if (!message) return res.status(404).json({ error: "Message not found" });
 
	 message.status = 'accepted';
	 await message.save();
 
	 res.status(200).json(message);
   } catch (error) {
	 console.log("Error in acceptMessage controller: ", error.message);
	 res.status(500).json({ error: "Internal server error" });
   }
 };
 
 module.exports = { sendMessage, getMessages, acceptMessage, sendConnectionRequest, acceptConnectionRequest };
 
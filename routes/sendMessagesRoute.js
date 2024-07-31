const express = require('express');
const { getMessages, sendMessage, acceptMessage, sendConnectionRequest, acceptConnectionRequest } = require('../controllers/messageController');
const { protectRoute } = require('../middleware/protectRoute');
const router = express.Router();

router.get('/:id', protectRoute, getMessages);
router.post('/send/:id', protectRoute, sendMessage);
// router.post('/accept/:connectionId', protectRoute, acceptConnect);
router.post('/accept/:id', protectRoute, acceptMessage);

router.post('/connect', protectRoute, sendConnectionRequest);
router.post('/accept', protectRoute, acceptConnectionRequest);

module.exports = router;

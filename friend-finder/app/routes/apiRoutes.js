const friendFinder = require('../friendFinder');
const friends = require('../data/friends.js');
const express = require('express');
const router = express.Router();

// Routes
router.get('/api/friends', (req, res) => res.json(friends));

router.post('/api/friends', (req, res) => {
    let newUser = req.body;
    let match = friendFinder.findCompatibleFriend(newUser, friends);

    friends.push(newUser);

    res.send(match);
    res.end();
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Clients = require('../data/clients').clients;

// GET Route Clients
router.get('/clients', (req, res) => {
  res.send(
    Clients.filter(
      element =>
        element.gender === req.query.gender && element.age <= req.query.age
    )
  );
});

module.exports = router;
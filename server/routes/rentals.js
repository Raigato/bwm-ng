const express = require('express')
const router = express.Router()
const Rental = require('../models/rental')

router.get('', function(req, res) {
  Rental.find({}, function(err, foundRentals) {
    res.json(foundRentals)
  })
})

router.get('/:rentalId', function(req, res) {
  const rentalId = req.params.rentalId

  Rental.findById(rentalId, function(err, foundRental) {
    if (err) {
      res.status(422).send({errors: [{title: 'Rental error!', detail: 'Could not find Rental!'}]})
    }

    res.json(foundRental)
  })
})

module.exports = router
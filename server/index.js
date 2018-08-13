const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./config')
const path = require('path')

const FakeDb = require('./fake-db')
const rentalRoutes = require('./routes/rentals')
const userRoutes = require('./routes/users')
const bookingRoutes = require('./routes/bookings')

mongoose.connect(config.DB_URI, { useNewUrlParser: true }).then(() => {
  if (process.env.NODE_ENV !== 'production') {
    const fakeDb = new FakeDb()
    //fakeDb.seedDb()
  }
})

const app = express()

app.use(bodyParser.json())

app.use('/api/v1/rentals', rentalRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/bookings', bookingRoutes)

if (process.env.NODE_ENV === 'production') {
  const appPath = path.join(__dirname, '..', 'dist')
  app.use(express.static(appPath))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(appPath, 'index.html'))
  })
}

const PORT = process.env.PORT || 3001

app.listen(PORT, function () {
  console.log('App is running!')
})
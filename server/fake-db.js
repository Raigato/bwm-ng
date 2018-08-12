const Rental = require('./models/rental')
const User = require('./models/user')
const Booking = require('./models/booking')

const FakeDbData = require('./data.json')

class FakeDb {

  constructor() {
    this.rentals = FakeDbData.rentals

    this.users = FakeDbData.users
  }

  async cleanDb() {
    await User.remove({})
    await Rental.remove({})
    await Booking.remove({})
  }

  pushDataToDb() {
    const user = new User(this.users[0])
    const user1 = new User(this.users[1])

    this.rentals.forEach((rental) => {
      const newRental = new Rental(rental)

      newRental.user = user
      user.rentals.push(newRental)

      newRental.save()
    })

    user.save()
    user1.save()
  }

  async seedDb() {
    await this.cleanDb()
    this.pushDataToDb()
  }
}

module.exports = FakeDb
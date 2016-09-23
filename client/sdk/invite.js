/**
 * Created by budde on 06/05/16.
 */

const request = require('superagent')

class BookingClientSdk {

  constructor (id) {
    this.id = id
  }

  deleteInvite () {
    return request
      .delete(`/api/invites/${this.id}`)
      .then()
  }
}

module.exports = BookingClientSdk
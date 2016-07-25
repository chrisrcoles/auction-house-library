'use strict';

const btoa = require('btoa');
const TEST_AUCTIONEER = {
  username:  'sjackson',
  password: 'auctioneersrock'
};


const TEST_PARTICIPANT = {
  username: 'wtrincherp',
  password: 'participantsrock'
};

module.exports = {

  getAuth: function (type) {
    let authPrefix = "Basic ";
    let auth, token;
    if (type === 'participant') {
      token = TEST_PARTICIPANT.username + ":" + TEST_PARTICIPANT.password
      auth = authPrefix + btoa(token);
    }

    if (type === 'auctioneer') {
      token = TEST_AUCTIONEER.username + ":" + TEST_AUCTIONEER.password
      auth = authPrefix + btoa(token);
    }
    return {'Authorization': auth, 'Content-Type': 'application/json'}
  }
}
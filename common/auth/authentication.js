'use strict';
const Bcrypt = require('bcrypt');

/*
* #getAuthPrivileges is a helper method that checks who has
* resource privileges by performing a Regex match on the incoming
* resource path. Since we know that Participants only have access
* to bidding, we will check for that, rendering all other paths
* as only privileged for the auctioneer; unless the path is a
* query for items by name (both participants and auctioneers have
* privileges), we check. This is noted in the Get handler for items
* as there is no authentication strategy used.
*
* @param {String} path - Request path.
*
* */
function getAuthPrivileges (path) {
  let participant = false;
  let auctioneer = false;

  // only specific participant action, everything else is either
  // auctioneer specific or shared - GET resource
 if (/^\/api\/v1\/items\/\d+\/bids$/gm.test(path)) {
    participant = true
  }
  else {
    auctioneer = true;
  }

  return {participant, auctioneer}
};

/*
* #validate is a public method that is used when defining the server.
* This method validates authentication privileges by comparing the stored
* hash password with the hashed incoming password sent by the user.
*
* For more information on Hapi Basic Auth,
* see here: https://github.com/hapijs/hapi-auth-basic
* 
* @param {request}  Object 
* @param {username} String - user's username
* @param {password} String - user's password
* @param {callback} Function - call back hook that carries us to response handler
*  if validation is successful. 
*  
* */
module.exports.validate = function(request, username, password, callback) {
  let authPrivileges = getAuthPrivileges(request.path);
  let privileged = authPrivileges.participant ? 'participant' : 'auctioneer';
  let select = 'SELECT * FROM ' + privileged + ' WHERE username = $1;';

  Database.query(select, [username], (err, data) => {
    let user = data.rows[0];
    Bcrypt.compare(password, user.password, (err, res) => {
      if (err) callback(null, false);
      if (res) {
        delete user.password;
        callback(null, true, user)
      }
    });
  })
};

'use strict';

console.log('hi')
let SALT_FACTOR = 'ish';
var bcrypt = require('bcrypt');

var bcrypt = require('bcrypt');
let pwd;

// bcrypt.genSalt(10, function (err, salt) {
//   bcrypt.hash("participantsrock", salt, function (err, hash) {
//     // Store hash in your password DB.
//     console.log('hash = ', hash);
//     console.log('salt = ', salt);
//
//     // pwd = hash
//     // setTimeout(() => {
//     //   bcrypt.compare("my password", pwd, function (err, res) {
//     //     res === true
//         // console.log('res = ', res)
//       // });
//     // }, 5000)
//
//   });
// });


bcrypt.compare("participantsrock", '$2a$10$gQb1kJPdMMLy4lascoaGIu3JdrTWUiG6lH34IgoSFoc4bLkvWWflS', (err, res) => {
  console.log('res = ', res)
});

'use strict';

require('dotenv').config({silent: true});

global.Database = require('./db');
const Authentication = require('./common/auth/authentication');

const Hapi          = require('hapi');
const HapiSwagger   = require('hapi-swagger');
const Inert         = require('inert');
const Vision        = require('vision');
const Good          = require('good');
const HapiAuthBasic = require('hapi-auth-basic');

let auctionRoutes = require('./routes/auctions');
let itemRoutes = require('./routes/items');

let routes          =  auctionRoutes.concat(itemRoutes);

let pluginsArray = [];

const server = new Hapi.Server();
server.connection({
  port: process.env.PORT || 8080,
  labels: ['api']
                  });

pluginsArray.push(Inert);
pluginsArray.push(HapiAuthBasic);
pluginsArray.push(Vision);

pluginsArray.push(Good);

pluginsArray.push({
  register: HapiSwagger,
  options: {
    info: {
      title: 'Auction House',
      description: 'Backend Library for Auction House',
      version: 'v1'
    },
    enableDocumentation: true,
    basePath: '/',
    jsonPath: '/docs/swagger.json',
    lang: 'en',
    tags: [
      {name: "api"},
      {name: "health"}
    ],
    documentationPath: '/'
  }
                  });


server.register(pluginsArray, (err) => {
  if (err) throw err;

  server.auth.strategy('simple', 'basic', {
    validateFunc: Authentication.validate
  });

  routes.forEach(route => {
    server.route(route)
  });

  server.start(() => {
    console.log('Server running at: ', server.info.uri)
  })
});
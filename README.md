# I. Auction House Backend Library Exercise

Write a backend library for an auction house's online auction
system so that it supports simple interactions with interacting
with the auction house, i.e. placing bids, starting, stopping
an auction, etc.

## Solution Outline
For the entire solution outline. See the [doc](/docs/solution-outline.md)

## Configuration
- Platform: [Node.js](https://nodejs.org)
- Server Framework: [Hapi.js](https://hapijs.com)
- Database: [Postgres](https://www.postgresql.org/)
- Unit Testing: [Mocha.js](https://mochajs.org)
- Authentication: [Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication)
- Deployment: None

## Application Architecture

Directory Structure:

- `api`    - Contains the public handler functions for the API resource endpoints.
- `common` - Contains components shared throughout the application.
- `db`     - Defines the Postgres Client and the query method that interfaces with database.
- `routes` - Defines all of the routes for the entire application.
- `tests`  - Contains all of the functional tests for the API endpoints.

## API Documentation

API documentation for all the endpoints is hosted via the [Hapi Swagger JSON plugin](https://github.com/glennjones/hapi-swagger).
After you get the app running. Thorough information regarding the client/server
contracts can be found [here at the root url](https://localhost:8081). I.e.,
all payloads, http response codes, descriptions and implementation notes for all endpoints.

## Setting up the Application

# [Install Postgres, Create User, and Database](/docs/install-postgres.md)

# Create .env file with the appropriate credentials just created
*see example.env for help*

# Install and Run the application

```
>$ git clone https://github.com/chrisrcoles/auction-house-library.git
>$ npm install
>$ node app.js
```

# Run tests

```
>$ npm install -g mocha
>$ mocha tests
```

OR
```
>$ node node_modules/mocha/bin/mocha tests/<file_name>
```



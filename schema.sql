BEGIN

CREATE TYPE status AS ENUM('waiting to be auctioned',  'in auction', 'sold');

CREATE TABLE IF NOT EXISTS auctioneer (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS auction (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    auctioneer_id INTEGER REFERENCES auctioneer(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS participant (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS item (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    type TEXT,
    reserved_price FLOAT NOT NULL,
    status status,
    sold TIMESTAMP,
    auction_id SERIAL REFERENCES auction(id) NOT NULL,
    owner_id INTEGER REFERENCES participant(id)
);

CREATE TABLE IF NOT EXISTS bid (
    id SERIAL PRIMARY KEY,
    price FLOAT NOT NULL,
    item_id INTEGER REFERENCES item(id) NOT NULL,
    bidder INTEGER REFERENCES participant(id) NOT NULL
);

INSERT INTO auctioneer(username, password) VALUES ('sjackson', '$2a$10$Q7818ePhD4jyCRxK6BAtWunDZBXsGQ9exe0H6ON9jAUJlddRpjyC.');

INSERT INTO participant(username, password) VALUES('wtrincherp', '$2a$10$gQb1kJPdMMLy4lascoaGIu3JdrTWUiG6lH34IgoSFoc4bLkvWWflS');

INSERT INTO auction(name, auctioneer_id)
    VALUES('Major Clearance Auction', (SELECT id FROM auctioneer WHERE username = 'sjackson'));

INSERT INTO item(name, description, type, reserved_price, status, auction_id)
    VALUES ('bmw m1', 'sleek shiny whip', 'automobile', 34999.99, 'in auction', (SELECT id FROM auction WHERE id = 1));

INSERT INTO item(name, description, type, reserved_price, status, auction_id)
    VALUES ('michael jordan signed basketball', 'priceless collectors', 'memoribilia', 99999.99, 'in auction', (SELECT id FROM auction WHERE id = 1));

INSERT INTO item(name, description, type, reserved_price, status, auction_id)
    VALUES ('new car', 'hot new whip', 'automobile', 50000.00, 'waiting to be auctioned', (SELECT id FROM auction WHERE id = 1));

INSERT INTO item(name, description, type, reserved_price, status, auction_id)
    VALUES('apple iphone', 'best new phone', 'Electronics', 699.99, 'in auction', (SELECT id FROM auction WHERE id = 1));

INSERT INTO item(name, description, type, reserved_price, status, auction_id)
    VALUES ('suzuki gsxr', 'hot street bike', 'automobile/motorcycles', 10999.99, 'waiting to be auctioned', (SELECT id FROM auction WHERE id = 1));

INSERT INTO item(name, description, type, reserved_price, status, auction_id)
    VALUES ('elektron machinedrum', 'classic beat machine', 'electronics/music', 1500.00, 'in auction', (SELECT id FROM auction WHERE id = 1));

INSERT INTO item(name, description, type, reserved_price, status, auction_id)
    VALUES('air conditioner', 'Best AC every', 'Homegoods', 100.99, 'waiting to be auctioned', (SELECT id FROM auction WHERE id = 1));

INSERT INTO item(name, description, type, reserved_price, status, auction_id)
    VALUES('lifetime supply of peanut butter', 'best deal ever', 'Foodstufss', 8000.99, 'waiting to be auctioned', (SELECT id FROM auction WHERE id = 1));

INSERT INTO item(name, description, type, reserved_price, status, auction_id)
    VALUES('invisible man', 'signed copy. awesome book', 'Book', 40.99, 'sold', (SELECT id FROM auction WHERE id = 1));


COMMIT
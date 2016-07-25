## Part I Find Consecutive Runs

See [docs](/docs/find-consecutive-runs.md)

## Part II Solution Outline

Write a backend library for an auction house’s online
auction system so that it supports the following
operations (assume that we have an in-memory
key-value store and a unique ID generator available):

* Auctioneer adds an item that can be auctioned. An
item has a unique name and reserved price

* Participants submit bids to an auction, a new bid
has to have a price higher than the current highest
 bid otherwise it's not allowed.

* Participant/Auctioneer queries the latest action of
an item by item name. The library should return the
status of the auction if there is any, if the item
is sold, it should return the information regarding
the price sold and to whom it was sold to.

* Auctioneer starts an auction on an item

* Auctioneer calls the auction (when s/he makes the
 judgement on her own that there will be no more
 higher bids coming in). If the current highest bid
 is higher than the reserved price of the item, the
 auction is deemed as a success otherwise it's marked
 as failure. The item sold should be no longer
 available for future auctions.


Viable languages:
- Ruby
- Python
- Node.JS
- Scala
- Java
- Go
- C/C++


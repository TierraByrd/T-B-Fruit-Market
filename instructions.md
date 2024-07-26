## The Fruit Market
For this challenge, you will be working with 4 commodities; Apples, Oranges, Bananas, and Grapes. Delicious, right?

## Required Feature List
When the application loads, you will need to have information for each of the commodities, specifically the name and the ‘market price’ of each. This information will need to be displayed in a meaningful way on the DOM.

Every 15 seconds, the prices should change however, and with it, the listed price on the DOM. Specifically, the market price of each of the items should fluctuate up or down 50 cents (between 1 cent and 50 cents) with each 15 second interval. Any given fruit is not allowed to go below a cost of 50 cents, or above the cost of 9 dollars and 99 cents.

The information displayed for each of the fruit should have a ‘button like’ functionality where the user can interact with each of the fruit displays.

Available to the user is a ‘total cash’ and an inventory display that shows how much of each of the fruits they have purchased. Also in the user display, should be an ‘average purchased price’, which shows, on average, how much money they have spent on a given fruit in their inventory.

The user can ‘buy’ one of the fruits, at market price, which will be deducted from the total cash. The user is not allowed to spend more than they have. 

A button below each of the Fruit buttons that allows the User to ‘sell’ one of their fruits of the same type at the current market price. This will also remove one from their inventory. The money should adjust per the price sold. The user should be not able to sell fruits they do not already own.

The user will start with $100.

## Mockup
Note, this is not a feature-complete mockup. Just something to start.
![Wireframe](https://i36.photobucket.com/albums/e2/antoinette-prime/FruitStandMockup_zpsvkm4otcq.png)

## ERD

User < (1-M) Purchased_Fruit / Inventory > (M-1) Fruit

- User contains the total dollars available, username, password
- Purchased Fruit contains the fruit_id, the price purchased at
- Fruit contains the Fruit info, and current price.


## Research Tech
- [nodecron](https://github.com/node-cron/node-cron) for timing database regular updates
- [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) for having the client polling for price changes. 


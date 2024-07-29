const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route to fetch all fruits
 */
router.get('/', (req, res) => {
    const queryText = `
      SELECT * 
      FROM "fruit"
    `;
    pool.query(queryText)
      .then((result) => {
        console.log('GET fruit route works:', result.rows);
        res.send(result.rows);
      })
      .catch((error) => {
        console.error('Error in GET for fruit: ', error);
        res.sendStatus(500);
      });
  });

/**
 * POST route to buy a fruit
 */
router.post('/buy', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.sendStatus(401); // Unauthorized
    }

    const { fruitId, quantity } = req.body;

    if (!fruitId || !quantity) {
        return res.sendStatus(400); // Bad Request
    }

    // Start database transaction
    pool.connect()
     .then(client => {
     return client.query('BEGIN')
    .then(() => {
     // Fetch fruit price
     return client.query('SELECT "current_price" FROM "fruit" WHERE "id" = $1', [fruitId])
     .then(result => {
     if (result.rows.length === 0) {
    throw new Error('Fruit not found');
         }
    const fruitPrice = parseFloat(result.rows[0].current_price);

     // Calculate total cost
    const totalCost = fruitPrice * quantity;

     // Fetch user total cash
     return client.query('SELECT "total_cash" FROM "user" WHERE "id" = $1', [req.user.id])
    .then(result => {
     const userCash = parseFloat(result.rows[0].total_cash);
     if (userCash < totalCost) {
     throw new Error('Insufficient funds');
         }

     // Deduct cash from user
     return client.query('UPDATE "user" SET "total_cash" = "total_cash" - $1 WHERE "id" = $2', [totalCost, req.user.id])
    .then(() => {
    // Add fruit to user inventory
    return client.query(`
    INSERT INTO "purchased_fruit" ("user_id", "fruit_id", "quantity", "purchased_price")
    VALUES ($1, $2, $3, $4)
    ON CONFLICT ("user_id", "fruit_id")
    DO UPDATE SET "quantity" = "purchased_fruit"."quantity" + $3, "purchased_price" = $4
    `, [req.user.id, fruitId, quantity, fruitPrice])
    .then(() => {
    // Commit the transaction
    return client.query('COMMIT')
    .then(() => {
    client.release();
    res.sendStatus(200); // OK
     });
     });
     });
     });
     });
     })
    .catch(error => {
    console.error('Error in transaction:', error);
    return client.query('ROLLBACK')
    .finally(() => {
    client.release();
    res.sendStatus(500); 
     });
     });
     })
    .catch(error => {
    console.error('Error connecting to the database:', error);
        res.sendStatus(500); // Internal Server Error
        });
});


module.exports = router;
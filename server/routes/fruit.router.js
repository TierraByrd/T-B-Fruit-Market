const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route to fetch all fruits
 */
router.get('/', async (req, res) => {
    const queryText = `
        SELECT f.*, COALESCE(pf.average_price, 0) as average_purchased_price
        FROM "fruit" f
        LEFT JOIN (
            SELECT "fruit_id", 
                   AVG("purchased_price") AS average_price 
            FROM "purchased_fruit" 
            GROUP BY "fruit_id"
        ) pf ON f.id = pf.fruit_id
    `;
    try {
        const result = await pool.query(queryText);
        console.log('GET fruit route works:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error in GET for fruit: ', error);
        res.sendStatus(500);
    }
});

/**
 * POST route to buy a fruit
 */
router.post('/buy', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.sendStatus(401);
    }

    const { fruitId, quantity } = req.body;

    if (!fruitId || !quantity) {
        return res.sendStatus(400);
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Fetch fruit price
        const fruitResult = await client.query('SELECT "current_price" FROM "fruit" WHERE "id" = $1', [fruitId]);
        if (fruitResult.rows.length === 0) {
            throw new Error('Fruit not found');
        }
        const fruitPrice = parseFloat(fruitResult.rows[0].current_price);

        // Calculate total cost
        const totalCost = fruitPrice * quantity;

        // Fetch user total cash
        const userResult = await client.query('SELECT "total_cash" FROM "user" WHERE "id" = $1', [req.user.id]);
        const userCash = parseFloat(userResult.rows[0].total_cash);
        if (userCash < totalCost) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        // Deduct cash from user
        await client.query('UPDATE "user" SET "total_cash" = "total_cash" - $1 WHERE "id" = $2', [totalCost, req.user.id]);

        // Check if fruit already exists in user's inventory
        const existingResult = await client.query(`
            SELECT "quantity", "purchased_price"
            FROM "purchased_fruit"
            WHERE "user_id" = $1 AND "fruit_id" = $2
        `, [req.user.id, fruitId]);

        if (existingResult.rows.length > 0) {
            const currentQuantity = parseFloat(existingResult.rows[0].quantity);
            const currentPurchasedPrice = parseFloat(existingResult.rows[0].purchased_price);

            // Calculate new average purchased price
            const newQuantity = currentQuantity + quantity;
            const newPurchasedPrice = ((currentPurchasedPrice * currentQuantity) + (fruitPrice * quantity)) / newQuantity;

            await client.query(`
                UPDATE "purchased_fruit"
                SET "quantity" = $1, "purchased_price" = $2
                WHERE "user_id" = $3 AND "fruit_id" = $4
            `, [newQuantity, newPurchasedPrice, req.user.id, fruitId]);
        } else {
            // Insert new record if fruit is not already in the user's inventory
            await client.query(`
                INSERT INTO "purchased_fruit" ("user_id", "fruit_id", "quantity", "purchased_price")
                VALUES ($1, $2, $3, $4)
            `, [req.user.id, fruitId, quantity, fruitPrice]);
        }

        await client.query('COMMIT');
        res.sendStatus(200);
    } catch (error) {
        console.error('Error in transaction:', error);
        await client.query('ROLLBACK');
        res.sendStatus(500);
    } finally {
        client.release();
    }
});

/**
 * POST route to sell a fruit
 */
router.post('/sell', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.sendStatus(401);
    }

    const { fruitId, quantity } = req.body;

    if (!fruitId || !quantity) {
        return res.sendStatus(400);
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Fetch fruit price
        const result = await client.query('SELECT "current_price" FROM "fruit" WHERE "id" = $1', [fruitId]);
        if (result.rows.length === 0) {
            throw new Error('Fruit not found');
        }
        const fruitPrice = parseFloat(result.rows[0].current_price);

        // Calculate total revenue
        const totalRevenue = fruitPrice * quantity;

        // Update user cash
        await client.query('UPDATE "user" SET "total_cash" = "total_cash" + $1 WHERE "id" = $2', [totalRevenue, req.user.id]);

        // Remove fruit from user inventory
        await client.query(`
            UPDATE "purchased_fruit"
            SET "quantity" = "quantity" - $1
            WHERE "user_id" = $2 AND "fruit_id" = $3
        `, [quantity, req.user.id, fruitId]);

        // Commit the transaction
        await client.query('COMMIT');
        res.sendStatus(200);
    } catch (error) {
        console.error('Error in transaction:', error);
        await client.query('ROLLBACK');
        res.sendStatus(500);
    } finally {
        client.release();
    }
});

/**
 * POST route to update fruit prices
 */
router.post('/update-prices', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.sendStatus(401);
    }

    const { fruitId, currentPrice } = req.body;

    if (!fruitId || !currentPrice) {
        return res.sendStatus(400);
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Lock the row to prevent concurrent updates
        await client.query('SELECT "current_price" FROM "fruit" WHERE "id" = $1 FOR UPDATE', [fruitId]);

        // Calculate new price 
        const change = (Math.random() * 0.49 + 0.01) * (Math.random() < 0.5 ? -1 : 1);
        let newPrice = Math.max(0.50, Math.min(9.99, parseFloat(currentPrice) + change));
        newPrice = parseFloat(newPrice.toFixed(2));

        // Update fruit price
        await client.query(
            'UPDATE "fruit" SET "current_price" = $1 WHERE "id" = $2',
            [newPrice, fruitId]
        );

        await client.query('COMMIT');
        res.json({ newPrice });
    } catch (error) {
        console.error('Error updating fruit prices:', error);
        await client.query('ROLLBACK');
        res.sendStatus(500);
    } finally {
        client.release();
    }
});

/**
 * GET route to fetch purchased fruits for the authenticated user
 */
router.get('/purchased', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.sendStatus(401);
    }

    const queryText = `
        SELECT f.id, f.name, pf.quantity, pf.purchased_price
        FROM "purchased_fruit" pf
        JOIN "fruit" f ON f.id = pf.fruit_id
        WHERE pf.user_id = $1
    `;

    try {
        const result = await pool.query(queryText, [req.user.id]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching purchased fruits:', error);
        res.sendStatus(500);
    }
});
router.get('/:fruitId/average-price', async (req, res) => {
    const { fruitId } = req.params;

    const queryText = `
        SELECT COALESCE(AVG("purchased_price"), 0) as average_purchased_price
        FROM "purchased_fruit"
        WHERE "fruit_id" = $1
    `;

    try {
        const result = await pool.query(queryText, [fruitId]);
        res.json({ averagePurchasedPrice: parseFloat(result.rows[0].average_purchased_price) });
    } catch (error) {
        console.error('Error fetching average price:', error);
        res.sendStatus(500);
    }
});
module.exports = router;
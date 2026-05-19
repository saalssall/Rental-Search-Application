import express from 'express';
const router = express.Router();

router.get('/', (req, res, next) => {
    // 1. Check for invalid query parameters
    const validParams = []; // no valid query params for this route
    const invalidParams = Object.keys(req.query).filter(key => !validParams.includes(key));

    if (invalidParams.length > 0) {
        // 1.1 If invalid query params, return error response
        res.status(400).json({
            error: true,
            message: `Invalid query parameters: ${invalidParams.join(', ')}`
        });
        return;
    }

    // 2. Retrieve all states from the database
    req.db.from("data").distinct("propertyType").orderBy("propertyType")
        .then(rows => {
            // 3. Return the states as a plain array
            const states = rows.map(row => row["propertyType"]);
            res.status(200).json(states);
        })
        .catch(err => {
            // 4. If error, return error response
            console.log(err);
            res.status(500).json({ error: true, message: "Error in MySQL query" });
        });
});

export default router;
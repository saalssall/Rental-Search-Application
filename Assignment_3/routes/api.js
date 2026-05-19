import express from 'express';
import authorisation from '../middleware/authorisation.js';
const router = express.Router();


router.get('/', function (req, res, next) {
  res.send("<h1>Rental Search API</h1>");
});

export default router;
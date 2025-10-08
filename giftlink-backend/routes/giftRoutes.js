const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const { ObjectId } = require('mongodb');
const logger = require('../logger');

// Get all gifts
router.get('/', async (req, res, next) => {
    logger.info('/api/gifts called');
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const gifts = await collection.find({}).toArray();
        res.json(gifts);
    } catch (e) {
        logger.error('Error fetching all gifts', e);
        next(e);
    }
});

// Get a single gift by ID
router.get('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const id = req.params.id;

        // Find gift by MongoDB _id
        const gift = await collection.findOne({ _id: new ObjectId(id) });

        if (!gift) {
            return res.status(404).send("Gift not found");
        }

        res.json(gift);
    } catch (e) {
        logger.error('Error fetching gift by ID', e);
        next(e);
    }
});

// Add a new gift
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const result = await collection.insertOne(req.body);
        res.status(201).json(result.ops[0]);
    } catch (e) {
        logger.error('Error adding new gift', e);
        next(e);
    }
});

module.exports = router;

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const logger = require('./logger');
const expressPino = require('express-pino-logger')({ logger });

// Task 1: import the natural library
const natural = require('natural');

// Task 2: initialize the express server
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(expressPino);

// Task 3: create the POST /sentiment endpoint
app.post('/sentiment', async (req, res) => {

    // Task 4: extract the sentence parameter from the request body
    const { sentence } = req.body;

    if (!sentence) {
        logger.error('No sentence provided');
        return res.status(400).json({ error: 'No sentence provided' });
    }

    // Initialize the sentiment analyzer
    const Analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    const analyzer = new Analyzer("English", stemmer, "afinn");

    try {
        // Perform sentiment analysis
        const analysisResult = analyzer.getSentiment(sentence.split(' '));

        // Task 5: set sentiment based on score
        let sentiment = "neutral";
        if (analysisResult < 0) {
            sentiment = "negative";
        } else if (analysisResult > 0.33) {
            sentiment = "positive";
        }

        // Logging the result
        logger.info(`Sentiment analysis result: ${analysisResult}`);

        // Task 6: send success response
        res.status(200).json({ sentimentScore: analysisResult, sentiment: sentiment });
    } catch (error) {
        logger.error(`Error performing sentiment analysis: ${error}`);

        // Task 7: send error response
        res.status(500).json({ message: 'Error performing sentiment analysis' });
    }
});

// Start the server
app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});

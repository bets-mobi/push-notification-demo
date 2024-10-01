const express = require('express');
const bodyParser = require('body-parser');
const webPush = require('web-push');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// VAPID keys for web-push
const vapidKeys = {
    publicKey: 'BC6G4FR_RAhD84agfPMiMKnCRKcNlp_M8jDqsqxWvVl-9wrvuCQ2z_9nM8bWxJugOqmeNYLajPKphTlDAHDuqp0',
    privateKey: 'R_DJ7mDY4bA8ICCDXRvo4ug1zfZd7MTKJ8rKTI2kf0Y',
};

webPush.setVapidDetails('mailto:example@example.com', vapidKeys.publicKey, vapidKeys.privateKey);

// Endpoint to save subscription
app.post('/api/save-subscription', (req, res) => {
    const subscription = req.body.subscription;
    if (!subscription) {
        return res.status(400).json({ error: 'Subscription is required.' });
    }
    console.log('Subscription received:', subscription);
    // Here, you can save the subscription to a database or in-memory storage
    res.status(201).json({ success: true });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

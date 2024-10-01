const express = require('express');
const bodyParser = require('body-parser');
const webPush = require('web-push');

const app = express();
app.use(bodyParser.json());

// VAPID keys
const vapidKeys = {
    publicKey: 'BC6G4FR_RAhD84agfPMiMKnCRKcNlp_M8jDqsqxWvVl-9wrvuCQ2z_9nM8bWxJugOqmeNYLajPKphTlDAHDuqp0',
    privateKey: 'R_DJ7mDY4bA8ICCDXRvo4ug1zfZd7MTKJ8rKTI2kf0Y'
};

webPush.setVapidDetails(
    'mailto:your-email@example.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Store subscriptions (in-memory for demo purposes)
const subscriptions = [];

// Endpoint to save subscription details
app.post('/api/save-subscription', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    console.log('Subscription added:', subscription);
    res.status(201).json({ message: 'Subscription saved successfully.' });
});

// Endpoint to send notification
app.post('/api/send-notification', (req, res) => {
    const payload = JSON.stringify({ title: 'Hello', body: 'This is a test notification!' });

    Promise.all(subscriptions.map(subscription => 
        webPush.sendNotification(subscription, payload)
    ))
    .then(() => res.status(200).json({ message: 'Notifications sent' }))
    .catch(err => {
        console.error('Error sending notification:', err);
        res.sendStatus(500);
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

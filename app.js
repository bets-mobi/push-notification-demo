// app.js
const applicationServerKey = 'BC6G4FR_RAhD84agfPMiMKnCRKcNlp_M8jDqsqxWvVl-9wrvuCQ2z_9nM8bWxJugOqmeNYLajPKphTlDAHDuqp0'; // Public VAPID Key
const privateKey = 'R_DJ7mDY4bA8ICCDXRvo4ug1zfZd7MTKJ8rKTI2kf0Y'; // Private VAPID Key

if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('sw.js')
    .then(function(swReg) {
        console.log('Service Worker is registered', swReg);

        document.getElementById('subscribeBtn').addEventListener('click', function() {
            subscribeUser(swReg);
        });
    })
    .catch(function(error) {
        console.error('Service Worker Error', error);
    });
}

function subscribeUser(swReg) {
    const options = {
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(applicationServerKey)
    };

    swReg.pushManager.subscribe(options)
    .then(function(subscription) {
        console.log('User is subscribed:', JSON.stringify(subscription));

        const endpoint = subscription.endpoint;
        const p256dhKey = btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh'))));
        const authKey = btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth'))));

        // Automatically send this subscription object to your server
        sendSubscriptionToServer(endpoint, p256dhKey, authKey);
    })
    .catch(function(err) {
        console.error('Failed to subscribe the user: ', err);
    });
}

function sendSubscriptionToServer(subscription) {
    return fetch('http://localhost:3000/api/save-subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subscription })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Subscription saved:', data);
    })
    .catch(error => {
        console.error('Error saving subscription:', error);
    });
}


function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}

// sw.js
self.addEventListener('push', function(event) {
    const options = {
        body: event.data ? event.data.text() : 'No payload',
        icon: 'icon.png', // Optional: path to an icon image
        badge: 'badge.png' // Optional: path to a badge image
    };

    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});

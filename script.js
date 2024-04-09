const checkPermission = () => {
    if (!('serviceWorker' in navigator)){
        throw new Error('No Service Worker support!');
    }
    if (!('Notification' in window)){
        throw new Error('No Notification support API!');
    }
};

const registerSW = async () => {
    const registration = await navigator.serviceWorker.register('sw.js');
    return registration;
};

const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted'){
        throw new Error('Permission not granted for Notification');
    } 
};

const enableNotifications = async () => {
    checkPermission();
    await requestNotificationPermission();  
    await registerSW();
};

const sendNotification = async () => {
    // Send notification manually
    const response = await fetch('http://localhost:3000/send-notification', {
        method: 'post',
        headers: { 'Content-type': "application/json" },
        body: JSON.stringify({ message: "New Notice from EdConnect Noticeboard!" })
    });
    const result = await response.json();
    console.log(result);
};

const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
};

const saveSubscription = async (subscription) => {
    const response = await fetch('http://localhost:3000/save-subscription', {
        method: 'post',
        headers: { 'Content-type': "application/json" },
        body: JSON.stringify(subscription)
    });

    return response.json();
};

self.addEventListener("activate", async (e) => {
    const subscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('BFKnRoDz48jEu9XMhT7ogCHkMb82kgCIpVBrdWb9MFOoDQ_S7vQ4TXFf9YLGAvB2XAKXufCEeMuRvpoNUkRP8Xg')
    });
    console.log(subscription);
    const response = await saveSubscription(subscription);
    console.log(response);
});

self.addEventListener('push', e => {
    self.registration.showNotification('New Notice ', {body:e.data.text() });
});

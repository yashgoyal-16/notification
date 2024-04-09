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
}
const saveSubscription = async (subscription) => {
    const response = await fetch('http://localhost:3000/save-subscription', {
        method: 'post',
        headers: { 'Content-type': "application/json" },
        body: JSON.stringify(subscription)
    })

    return response.json()
}
self.addEventListener("activate",async (e) => {
    const subscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('BFKnRoDz48jEu9XMhT7ogCHkMb82kgCIpVBrdWb9MFOoDQ_S7vQ4TXFf9YLGAvB2XAKXufCEeMuRvpoNUkRP8Xg')
    });
    console.log(subscription);
    const response = await saveSubscription(subscription);
    console.log(response);
})
self.addEventListener('push', e => {
    self.registration.showNotification('New Notice', {body:e.data.text() })
    
});

// Public Key:
// BFKnRoDz48jEu9XMhT7ogCHkMb82kgCIpVBrdWb9MFOoDQ_S7vQ4TXFf9YLGAvB2XAKXufCEeMuRvpoNUkRP8Xg

// Private Key:
// iSfmen5jReU59t7EUhou-u9i0Gm-AVWrtCQwG3psRJ0
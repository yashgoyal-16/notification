const express = require("express");
const app = express();
const webpush = require('web-push');
const cors = require("cors");

const port = 3000;

const apiKeys = {
    publicKey: "BFKnRoDz48jEu9XMhT7ogCHkMb82kgCIpVBrdWb9MFOoDQ_S7vQ4TXFf9YLGAvB2XAKXufCEeMuRvpoNUkRP8Xg",
    privateKey: "iSfmen5jReU59t7EUhou-u9i0Gm-AVWrtCQwG3psRJ0"
};

webpush.setVapidDetails(
    'mailto:goyalyash1605@gmail.com',
    apiKeys.publicKey,
    apiKeys.privateKey
);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world");
});

const subDatabase = [];

app.post("/save-subscription", (req, res) => {
    subDatabase.push(req.body);
    res.json({ status: "Success", message: "Subscription saved!" });
});

// Function to send notifications to all subscribers
function sendNotificationToAllSubscribers(message) {
    subDatabase.forEach(subscription => {
        webpush.sendNotification(subscription, message)
            .catch(error => {
                console.error("Error sending notification:", error);
            });
    });
}

// Route to handle sending push notification triggered by button click
app.post("/send-notification", (req, res) => {
    const { message } = req.body;
    sendNotificationToAllSubscribers(message);
    res.json({ status: "Success", message: "Notification sent!" });
});

// Trigger the function when the server starts
app.listen(port, () => {
    console.log("Server running on port 3000!");
});

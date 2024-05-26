const express = require("express");
const app = express();
const startBot = require("../startBot.js");

app.get("/", (req, res) => {
    startBot();
    res.send("Started bot...");
});

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;

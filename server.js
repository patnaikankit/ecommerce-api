const express = require('express');
const app = express();
const routes = require("./routes")


// to register all the routes 
app.use("/api", routes);


app.listen(process.env.APP_PORT, (req,res) => {
    console.log("Server is listening on port 3000!");
});
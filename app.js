const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get("/", function(req, res){

    var today = new Date();
    
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    day = today.toLocaleDateString("en-Us", options);

    res.render("list", {kindOfDay: day});


});

app.post("/", function(req, res) {
    const newItem = req.body.nItem;
    console.log(newItem);
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
})
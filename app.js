const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true})

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
  name: "Home Work"
});

const item2 = new Item ({
  name: "Buy Beer"
});

const item3 = new Item ({
  name: "Exercise"
});

const defaultItems = [item1,item2,item3];

Item.insertMany(defaultItems, function(err){
  if (err) {
    console.log(err);
  } else {
    console.log("Successfuly added items to DB");
  }
});

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("list", {kindOfDay: "Today", newListItems: items});
});

app.post("/", function(req, res) {
    const item = req.body.newItem;

    items.push(item);
    res.redirect("/");
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
})

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

const foundItems = [];

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-isac:<PASSWORD>@cluster0.j4wrq.mongodb.net/todolistDB?retryWrites=true&w=majority", {
  useUnifiedTopology: true
}, {
  useNewUrlParser: true
})

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Home Work"
});

const item2 = new Item({
  name: "Buy Beer"
});

const item3 = new Item({
  name: "Exercise"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.set("view engine", "ejs");

app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems) {
    if (foundItems === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfuly added items to DB");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        kindOfDay: "Today",
        newListItems: foundItems
      });
    }
  });
});

app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    })
  }
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (err) {
        console.log(err);
      } else {
        console.log("Successfuly deleted");
      }
    })
    res.redirect("/");
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err) {
        res.redirect("/"+listName);
      }
    })
  }
})

app.get("/:customListName", function(req, res){
  const customListName= _.capitalize(req.params.customListName);
List.findOne({ name: customListName}, function(err, foundList){
  if (!err) {
    if (!foundList) {
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save();
      res.redirect("/"+customListName);
    } else {
      res.render("list", {
        kindOfDay: foundList.name,
        newListItems: foundList.items
      });
    }
  }
});


});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started Successfuly");
})

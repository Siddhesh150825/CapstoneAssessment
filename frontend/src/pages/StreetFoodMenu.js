const mongoose = require("mongoose");
const Menu = require("./models/Menu");

mongoose.connect("mongodb://localhost:27017/restaurant");

const items = [
  {
    name: "Pani Puri",
    price: 40,
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Pani_Puri.jpg"
  },
  {
    name: "Vada Pav",
    price: 25,
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Vada_Pav.jpg"
  },
  {
    name: "Pav Bhaji",
    price: 80,
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Pav_Bhaji.jpg"
  },
  {
    name: "Bhel Puri",
    price: 50,
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Bhel_Puri.jpg"
  }
];

Menu.insertMany(items)
  .then(() => {
    console.log("Street food menu!");
    mongoose.connection.close();
  })
  .catch(err => console.error(err));

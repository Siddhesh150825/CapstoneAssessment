const express = require("express");
const MenuItem = require("../models/MenuItem");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth(["admin"]), async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (category) {
      query.category = category;
    }

    const items = await MenuItem.find(query);
    res.json(items);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", auth(["admin"]), async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu item deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
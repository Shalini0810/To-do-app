const router = require("express").Router();
const User = require("../models/user");
const List = require("../models/list");

// CREATE Task
router.post("/addTask", async (req, res) => {
  try {
    const { title, body, email } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const list = new List({ title, body, user: existingUser._id });
      await list.save();

      if (!existingUser.list) {
        existingUser.list = [];
      }

      existingUser.list.push(list._id);
      await existingUser.save();

      res.status(200).json({ list });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE Task
router.put("/updateTask/:id", async (req, res) => {
  try {
    const { title, body, email } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedTask = await List.findByIdAndUpdate(
      req.params.id,
      { title, body },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE Task
router.delete("/deleteTask/:id", async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOneAndUpdate(
      { email },
      { $pull: { list: req.params.id } }
    );

    if (existingUser) {
      const deleted = await List.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Task not found" });

      res.status(200).json({ message: "Task deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all tasks of a user
router.get("/getTasks/:id", async (req, res) => {
  try {
    const list = await List.find({ user: req.params.id }).sort({createdAt: -1});
    if (list.length > 0) {
        res.status(200).json({ list });
      } else {
        res.status(200).json({ message: "No Tasks" }); // Only message, no list:[]
      }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

const express = require("express");
const { body, validationResult } = require("express-validator");
const verifyToken = require("../middleware");
const taskDataModel = require("../db/schema/taskSchema");
const router = express.Router();

router.post(
  "/createtasks",
  verifyToken,
  body("title").isLength({ min: 1 }),
  async (req, res) => {
    try {
      const errs = validationResult(req);
      if (!errs.isEmpty())
        return res.status(400).json({ errors: errs.array() });
      const task = await new taskDataModel({ ...req.body, owner: req.userId });
      // Save the updated user document
      await task.save();
      console.log("created task ----->", task);
      res.status(200).json(task);
    } catch (error) {
      console.error("error in createtasks API", error.message);
      res.status(500).send(error.message);
    }
  }
);

router.get("/readtasks", verifyToken, async (req, res) => {
  try {
    const tasks = await taskDataModel.find({ owner: req.userId });
    console.log("all tasks ----->", tasks);
    res.json(tasks);
  } catch (error) {
    console.error("error in readtasks API", error.message);
    res.status(500).send(error.message);
  }
});

router.put(
  "/updatetask/:id",
  verifyToken,
  body("title").optional().isLength({ min: 1 }),
  async (req, res) => {
    try {
      const task = await taskDataModel.findOneAndUpdate(
        { _id: req.params.id, owner: req.userId },
        req.body,
        { new: true, runValidators: true }
      );
      if (!task) return res.status(400).json({ message: "Task not found" });
      console.log("updated task ----->", task);
      res.json(task);
    } catch (error) {
      console.error("error in updatetask API", error.message);
      res.status(500).send(error.message);
    }
  }
);

router.delete("/deletetask/:id", verifyToken, async (req, res) => {
  try {
    const result = await taskDataModel.deleteOne({
      _id: req.params.id,
      owner: req.userId
    });
    if (result.deletedCount === 0)
      return res.status(400).json({ message: "Task not found" });
    console.log("deleted task ----->", result);

    res.status(200).json({ message: "Task deletion successful" });
  } catch (error) {
    console.error("error in deletetask API", error.message);
    res.status(500).send(error.message);
  }
});

module.exports = router;

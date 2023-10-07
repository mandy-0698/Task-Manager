const express = require("express");
const Task = require("../models/task");
const router = new express.Router();

router.post("/", async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
  //   task
  //     .save()
  //     .then(() => {
  //       res.status(201).send(task);
  //     })
  //     .catch((e) => {
  //       res.status(400).send(e);
  //     });
});

router.patch("/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid Updates" });
  }
  try {
    const task=await Task.findById(req.params.id);
    updates.forEach((update)=>task[update]=req.body[update]);
    await task.save();
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    if (!task) {
      return res.status(404).send("Task Not Found");
    }
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
  //   Task.find({})
  //     .then((tasks) => {
  //       res.send(tasks);
  //     })
  //     .catch((e) => {
  //       res.status(500).send(e);
  //     });
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).send("task not found");
    }
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
  //   Task.findById(id)
  //     .then((task) => {
  //       if (!task) {
  //         return res.status(404).send("task not found!");
  //       }
  //       res.send(task);
  //     })
  //     .catch((e) => {
  //       res.status(500).send(e);
  //     });
});

router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send("Task not found!");
    }
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;

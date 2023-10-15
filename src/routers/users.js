const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const router = new express.Router();

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please Upload an Image"));
    }
    cb(undefined, true);
  },
});

router.post("/", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    // console.log(user._id);
    const token = await user.generateAuthToken(user._id.toString());
    user.tokens.push({ token });
    await user.save();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }

  //   user
  //     .save()
  //     .then(() => {
  //       res.status(201).send(user);
  //     })
  //     .catch((e) => {
  //       res.status(400).send(e);
  //     });
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredential(req.body.email, req.body.password);
    // console.log(user);
    const token = user.generateAuthToken(user._id.toString());
    user.tokens.push({ token });
    await user.save();
    // console.log(token);
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send("logged out!");
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("logged out all!");
  } catch (e) {
    res.status(500).send(e);
  }
});
router.get("/me", auth, async (req, res) => {
  res.send(req.user);
  // try {
  //   const users = await User.find({});
  //   res.send(users);
  // } catch (e) {
  //   res.status(500).send(e);
  // }

  //   User.find({})
  //     .then((users) => {
  //       res.send(users);
  //     })
  //     .catch((e) => {
  //       res.status(500).send(e);
  //     });
});

router.get("/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);
    4;
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }

  //   User.findById(_id)
  //     .then((user) => {
  //       if (!user) {
  //         return res.status(404).send("User not found");
  //       }
  //       res.send(user);
  //     })
  //     .catch((e) => {
  //       res.status(500).send(e);
  //     });
});

router.patch("/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "password", "email", "age"];
  const validUpdates = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!validUpdates) {
    return res.status(400).send({ error: "invalid updates" });
  }
  try {
    // const user = await User.findById(req.params.id);
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.params.id);
    // if (!user) {
    //   return res.status(404).send("User not found");
    // }
    const user = await User.deleteOne({ _id: req.user._id });
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post(
  "/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ height: 250, width: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.get("/me/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    if (!user || !user.avatar) {
      throw new Error("No Avatar Found");
    }
    res.set("Content-type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send(e);
  }
});
router.delete("/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

module.exports = router;

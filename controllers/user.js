const User = require("../model/user");
const bcrypt = require("bcryptjs");
const userRouter = require("express").Router();

userRouter.post("/", async (req, res, next) => {
  try {
    const { username, password, name } = req.body;
    if (!username || !password || !name) throw new Error("All Fields Required");
    if (password.length < 3)
      res
        .status(500)
        .json({ error: "Password Must be at least three character long" })
        .end();
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({ username, passwordHash, name });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/", async (_req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;

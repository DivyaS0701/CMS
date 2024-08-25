// router.use
const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

router.post("/login");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  //Check all the missing fields
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ error: `Please enter all the required fields.` });

  //Name validation
  if (name.length > 25)
    return res
      .status(400)
      .json({ error: `Name can only be less than or equal to 25 characters` });

  //Email regex
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //Email validation
  if (!emailRegex.test(email))
    return res.status(400).json({ error: `Please enter valid email` });

  //Password validation
  if (password.length < 6)
    return res
      .status(400)
      .json({ error: `Password should atleast contain 6 characters` });

  try {
    const doesUserAlreadyExist = await User.findOne({ email });

    if (doesUserAlreadyExist)
      return res.status(400).json({
        error: `A user with the same credentials exists. Please try using another email id.`,
      });

    //creation
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword });

    //save the user
    const result = await newUser.save();

    result._doc.password = undefined;

    return res.status(201).json({ ...result._doc });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //Email regex
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //Email validation
  if (!emailRegex.test(email))
    return res.status(400).json({ error: `Please enter valid email` });
  try {
    const doesUserExists = await User.findOne({ email });

    if (!doesUserExists)
      return res.status(400).json({ error: `Invalid email or password` });

    const doesPasswordMatch = await bcrypt.compare(
      password,
      doesUserExists.password
    );

    if (!doesPasswordMatch)
      return res.status(400).json({ error: `Invalid Password or password` });

    const payload = {_id: doesUserExists._id};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    const user = {...doesUserExists._doc, password: undefined};
    return res.status(200).json({ token, user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

router.get("/me", auth, async (req, res) => {
  console.log("kjgfwhfbkhfbekf");
  return res.status(200).json({ ...req.user._doc});
});
module.exports = router;

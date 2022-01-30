const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/Users");
const Tables = require("../../models/Tables");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

router.post("/getBookingdetails", (req, res) => {
  User.findById(req.body.id).then((user) => {
    if (!user) return res.status(404).json({ notfound: "User Not found" });
    else {
      res.status(200).json(user.booked_tables);
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            console.log(user);
            res.json({
              success: true,
              token: "Bearer " + token,
              email: user.email,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

// Request a Table, return 200 on success
// @request Table
router.post("/requestTable", (req, res) => {
  console.log(req.body);
  const { table } = req.body;
  const { time, number } = req.body;
  Tables.updateOne(
    { time: time },
    {
      $pull: { available_tables: { number: req.body.number } },
      $addToSet: { booked_tables: table },
    }
  )
    .then((tables) => {
      User.updateOne(
        { email: req.body.email },
        {
          $addToSet: { booked_tables: table },
        }
      ).then((user) => {
        res.status(200).json(user);
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ error: "DB Error" });
    });
});

router.post("/cancelTable", (req, res) => {
  const { table } = req.body;
  const { time, number } = req.body;
  Tables.updateOne(
    { time: time },
    {
      $pull: { booked_tables: { number: req.body.number } },
      $addToSet: { available_tables: table },
    }
  )
    .then(() => {
      User.updateOne(
        { email: req.body.email },
        { $pull: { booked_tables: { number: number } } }
      ).then((user) => {
        res.status(200).json(user);
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ error: "DB Error" });
    });
});

router.get("/getTables/:time?", (req, res) => {
  let time = req.params.time;

  if (time) {
    Tables.findOne({ time: time }).then((tables) => {
      if (tables) {
        res.status(200).json(tables);
      } else {
        res.status(400).json({ noTables: "No Tables Available" });
      }
    });
  } else {
    Tables.find().then((tables) => {
      if (tables) {
        res.status(200).json(tables);
      } else {
        res.status(400).json({ noTables: "No Tables Available" });
      }
    });
  }
});

router.post("/manageTables", (req, res) => {
  let { time, numbers, startNumber, capacity } = req.body;

  const tables = [];
  for (let i = 0; i < numbers; i++) {
    let newTable = {
      number: String(startNumber++),
      capacity: capacity,
      time: time,
      status: "Open",
    };
    tables.push(newTable);
  }

  const newTables = new Tables({
    time: time,
    available_tables: tables,
  });

  Tables.findOne({ time: time }).then((table) => {
    if (table) {
      res.status(400).json({ time: "Time slot filled" });
    } else {
      newTables
        .save()
        .then((tables) => res.status(200).json(tables))
        .catch((err) => console.log(err));
    }
  });
});

module.exports = router;

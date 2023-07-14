const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    require: true,
    minLength: 6,
    maxLength: 100,
  },
  password: {
    type: String,
    require: true,
    minLength: 3,
    maxLength: 1024,
  },
  role: {
    type: String,
    enum: ["student", "instructor", "admin"],
    required: true,
  },
  data: {
    type: Data,
    default: Data.now,
  },
});

userSchema.methods.isStudent = function () {
  return this.role == "student";
};

userSchema.methods.isIntructor = function () {
  return this.role == "instructor";
};

// mongoose schema middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password),
    (err, isMatch) => {
      //   this.password is => after hash, password
      if (err) {
        return cb(err, isMatch);
      }
      cb(null, isMatch);
    };
};

module.exports = mongoose.model("User", userSchema);

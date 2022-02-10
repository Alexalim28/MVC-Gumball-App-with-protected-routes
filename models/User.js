const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "You must provide a name!"],
    lowercase: true,
    trim: true,
    minLength: [3, "Your name must have 5 characters at least!"],
  },
  email: {
    type: String,
    required: [true, "You must provide your email!"],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email!"],
  },
  password: {
    type: String,
    required: [true, "You must provide a password!"],
    minlength: [5, "Your password must have 5 characters at least!"],
  },
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Invalid password!");
  }
  throw Error("Incorrect email!");
};

const User = mongoose.model("user", userSchema);

module.exports = User;

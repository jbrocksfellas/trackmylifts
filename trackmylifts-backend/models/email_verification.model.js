const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const emailVerificationSchema = new mongoose.Schema(
  {
    userId: { type: ObjectId, required: true, ref: "User", unique: true },
    email: { type: String, required: true, unique: true },
    session: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

const EmailVerification = mongoose.model("Email_Verification", emailVerificationSchema);

module.exports = EmailVerification;

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import {
  registerValidation,
  loginValidation,
} from "../validations/authValidation.js";

export const registerUser = async ({
  username,
  email,
  password,
  confirmPassword,
  phone,
  profileImage,
}) => {
  const { error } = registerValidation.validate({
    username,
    email,
    password,
    confirmPassword,
    phone,
    profileImage,
  });
  if (error)
    throw new Error(error.details[0].message);

  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  });
  if (existingUser)
    throw new Error(
      "Email or Phone number already registered."
    );

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(
    password,
    salt
  );

  const user = new User({
    username,
    email,
    password: hashedPassword,
    phone,
    profileImage: profileImage || "",
  });

  await user.save();
  return user;
};

export const loginUser = async (
  email,
  password
) => {
  const { error } = loginValidation.validate({
    email,
    password,
  });
  if (error)
    throw new Error(error.details[0].message);

  const user = await User.findOne({ email });
  if (!user)
    throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );
  if (!isMatch)
    throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token, user };
};

export const getUserProfileService = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.params.id
    ).populate("followers following");
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message });
  }
};

export const updateUserProfileService = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.params.id
    );
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found" });

    user.username =
      req.body.username || user.username;
    // user.profilePicture = req.body.profilePicture || user.profilePicture;
    user.bio = req.body.bio || user.bio;
    await user.save();

    res.json({
      message: "Profile updated",
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message });
  }
};

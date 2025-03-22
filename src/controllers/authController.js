import {
  registerUser,
  loginUser,
  updateUserProfileService,
  getUserProfileService,
} from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      confirmPassword,
      phone,
    } = req.body;
    const profileImage = req.file
      ? req.file.path
      : "";

    const user = await registerUser({
      username,
      email,
      password,
      confirmPassword,
      phone,
      profileImage,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { token, user } = await loginUser(
      req.body.email,
      req.body.password
    );
    res.json({ token, user });
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message });
  }
};

export const getUserProfile = async (
  req,
  res
) => {
  try {
    const user = await getUserProfileService(
      req.params.id
    );
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

export const updateUserProfile = async (
  req,
  res
) => {
  try {
    const updatedUser =
      await updateUserProfileService(
        req.params.id,
        req.body
      );
    res.json({
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message });
  }
};

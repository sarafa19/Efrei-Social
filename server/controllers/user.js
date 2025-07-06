import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModal from "../models/user.js";

const secret = 'test';

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

    const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "1h" } );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    
    console.log(error);
  }
};

export const googleSignIn = async (req, res) => {
  const { credential } = req.body;
  
  try {
    const decoded = jwt.decode(credential);
    const { email, name, sub: googleId } = decoded;

    let user = await UserModal.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = await UserModal.create({
        googleId,
        name,
        email,
        password: 'google-auth' // Mot de passe factice
      });
    }

    const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: user, token });
  } catch (error) {
    res.status(500).json({ message: "Google authentication failed" });
    console.error(error);
  }
};
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"; 
import GetUser from "../Database/UserLogin/GetUser.js";
import CreateUser from "../Database/UserLogin/CreateUser.js";

dotenv.config();
const router = express.Router();


// User Signup
router.post('/Auth/Signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if user exists
    const existingUser = await GetUser(email); 
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt); 

    const newUser = {
      username,
      email,
      password: hashedPass,
      createdAt: new Date()
    }; 

    const result = await CreateUser(newUser); 

    return res.status(201).json({
      message: "User added successfully",
      insertedId: result.insertedId
    }); 

  } catch (err) {
    console.error("Error Adding User", err);
    return res.status(500).json({ error: "Internal server error while adding data" });
  }
}); 




// User Login 
router.post('/Auth/Login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if user exists
    const existingUser = await GetUser(email); 
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    // verify password
    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    // generate JWT
    const tokenData = {
      id: existingUser._id.toString(),
      name: existingUser.username,
      email: existingUser.email,
    };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1h" });

    // set JWT in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, 
      path: "/",
    });

    
    return res.status(200).json({
      message: "Login Successful",
      success: true,
      user: {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      },
    });
  } catch (err) {
    console.error("Error Logging In", err);
    return res.status(500).json({ error: "Internal Server Error while logging in" });
  }
});

// User Logout 
router.get('/Auth/Logout', async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({
      message: "Logout Successful",
      success: true
    });
  } catch (err) {
    console.error("Error Logout", err);
    return res.status(500).json({ error: "Internal Error while Logging Out" });
  }
});
export default router;






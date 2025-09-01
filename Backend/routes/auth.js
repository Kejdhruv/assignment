import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"; 
import GetUser from "../Database/UserLogin/GetUser.js";
import CreateUser from "../Database/UserLogin/CreateUser.js";

dotenv.config();
const router = express.Router();

router.post('/Auth/Signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if user exists
    const existingUser = await GetUser({ email }); 
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
      insertedCount: result.insertedCount,
      insertedIds: result.insertedIds
    }); 

  } catch (err) {
    console.error("Error Adding User", err);
    return res.status(500).json({ error: "Internal server error while adding data" });
  }
}); 


router.post('/Auth/Login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if user exists
    const existingUser = await GetUser({ email }); 
    if (!existingUser) {
      return res.status(409).json({ message: "User Doesn't exists" });
    }

      const validPassword = await bcrypt.compare(
      password,
      existingUser.password
      );
      
      if (!validPassword) {
           return res.status(409).json({ message: "Incorrect Password" });
      }

      

    const tokenData = {
     Name : existingUser.username,
     Email : existingUser.email,
      };  
      
      

    const result = await CreateUser(newUser); 

    return res.status(201).json({
      message: "User added successfully",
      insertedCount: result.insertedCount,
      insertedIds: result.insertedIds
    }); 

  } catch (err) {
    console.error("Error Adding User", err);
    return res.status(500).json({ error: "Internal server error while adding data" });
  }
});

export default router;   








import express from "express";
import mongoose from "mongoose"; 
import cors from "cors";
import dotenv from "dotenv";
import claimRoutes from "./routes/claimRoutes.js";
import auth from "./routes/auth.js"; 
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(express.json());  
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true,               
})); 

const PORT = 4898;
app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)); 

app.use("/", claimRoutes); 
app.use("/", auth); 
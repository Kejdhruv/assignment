import express from "express";
import mongoose from "mongoose"; 
import cors from "cors";
import dotenv from "dotenv";
import claimRoutes from "./routes/claimRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());  

const PORT = 4898 ;
app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)); 
 

app.use("/", claimRoutes); 


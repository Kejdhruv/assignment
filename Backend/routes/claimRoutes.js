import express from "express";
import claimbyid from "../Database/Claims/claimbyid.js";
import claimbyuserid from "../Database/Claims/claimbyuserid.js";
import claims from "../Database/Claims/claims.js";
import Addclaim from "../Database/Claims/Addclaim.js";
import { processClaim } from "../services/claimProcessor.js";
import multer from 'multer';       
import Tesseract from 'tesseract.js'; 
import fs from 'fs';          
import { authMiddleware } from "../Middleware/DecodeToken.js";
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

//  Fetch claim by Claim ID
router.get('/claims/id/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    const data = await claimbyid(_id);
    res.send(data); 
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch claim by ID" });
  }
});

// Fetch claims by User ID
router.get('/claims/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await claimbyuserid(userId);
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch claims for user" });
  }
});

//  Fetch all claims (Admin view)
router.get('/claims', async (req, res) => {
  try {
    const data = await claims();
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch all claims" });
  }
});

//  Add new claim
// OCR + process + insert
router.post('/api/claims',authMiddleware,  upload.array('documents', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No document files were uploaded." });
  }

  try {
    const { id: userId, name, email } = req.user; 
    const ocrPages = [];

    for (const file of req.files) {
      const { data: { text } } = await Tesseract.recognize(file.path, "eng");
      ocrPages.push(text);
      fs.unlinkSync(file.path);
       console.log(`✅ Deleted temp file: ${file.path}`);
    }

    const processedClaims = processClaim(ocrPages, { userId, name, email });

    // Insert each prescription+bill+checks separately
    const result = await Addclaim(processedClaims);

    res.status(201).json({
      message: "Claims submitted successfully",
      insertedCount: result.insertedCount,
      insertedIds: result.insertedIds
    });

  } catch (err) {
    console.error("Error processing claim:", err);
    res.status(500).json({ error: "Internal server error while processing claim" });
  }
});



export default router;







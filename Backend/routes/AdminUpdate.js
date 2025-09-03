import express from "express"; 
import UpdateClaim from "../Database/Claims/UpdateClaim.js"; 
import claims from "../Database/Claims/claims.js";
const router = express.Router();  


router.get('/admin/claims', async (req, res) => {
  try {
    const data = await claims();
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch all claims" });
  }
});

router.put('/admin/claims/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; 

    const result = await UpdateClaim(id, {
      "review.status": "approved",
      "review.decision": "approved",
      "review.reason": reason || "Approved by admin",
      "review.reviewedAt": new Date(),
    });

    res.json({ message: "Claim approved", modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error("Error approving claim:", err);
    res.status(500).json({ error: "Failed to approve claim" });
  }
});  


router.put('/admin/claims/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; 

    if (!reason) {
      return res.status(400).json({ error: "Reason is required for rejection" });
    }

    const result = await UpdateClaim(id, {
      "review.status": "rejected",
      "review.decision": "rejected",
      "review.reason": reason,
      "review.reviewedAt": new Date(),
    });

    res.json({ message: "Claim rejected", modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error("Error rejecting claim:", err);
    res.status(500).json({ error: "Failed to reject claim" });
  }
}); 

export default router;
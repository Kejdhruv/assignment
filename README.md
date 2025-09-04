# Clinikk Insurance Claim Processing System

This project is a full-stack insurance claim management system built with **Node.js, Express, MongoDB, and React**.  
It processes **medical claims** by extracting structured data from OCR, performing business checks, and allowing **admins** to approve/reject claims.

---

## 🚀 Features

- User authentication (Signup, Login, Logout) with JWT + cookies
- OCR-based document upload using **Tesseract.js**
- Automatic extraction of:
  - Prescription details (doctor, diagnosis, orders)
  - Bill details (items, prices, totals)
- Business checks:
  - Visit reason consistency
  - Treatment fulfillment (missing/extra items)
  - Policy exclusions
  - Eligible amount calculation
- User Dashboard:
  - Pending, Approved, Rejected claims (with reasons & eligibility amount)
- Admin Panel:
  - Approve / Reject claims with reason
  - Claims sorted by earliest submission

---

## 📂 JSON Schema

### User Schema
```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "password": "string (hashed)",
  "role": "User | Admin",
  "createdAt": "ISODate"
}
```

### Claim Schema
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "name": "string",
  "email": "string",
  "prescription": {
    "prescription_number": "string",
    "prescription_date": "string (YYYY-MM-DD)",
    "doctor_name": "string",
    "doctor_specialty": "string",
    "diagnosis": ["string"],
    "prescription_orders": [
      { "item": "string", "type": "string", "dose": "string", "frequency": "string" }
    ],
    "visit_reason": "string",
    "referral_reason": "string",
    "specialist_prescription": "boolean"
  },
  "bills": [
    {
      "bill_number": "string",
      "bill_date": "string (YYYY-MM-DD)",
      "line_items": [
        { "name": "string", "type": "string", "final": "number" }
      ],
      "total_paid_amount": "number"
    }
  ],
  "checks": {
    "subtype": "string",
    "visit_reason_consistency": { "passed": "boolean", "flag": "string" },
    "treatment_fulfillment": { "missing": ["string"], "extra": ["string"], "passed": "boolean" },
    "policy_exclusions": { "excluded_items": ["string"], "passed": "boolean" },
    "eligible_amount_calculation": { "totalClaimed": "number", "eligibleAmount": "number", "passed": "boolean" }
  },
  "review": {
    "status": "pending | approved | rejected",
    "decision": "string | null",
    "reason": "string | null",
    "reviewedAt": "ISODate | null"
  },
  "createdAt": "ISODate"
}
```

---

## 🔑 API Endpoints

### Auth APIs
- `POST /Auth/Signup` → Create new user
- `POST /Auth/Login` → User login (sets JWT cookie)
- `GET /Auth/Logout` → User logout
- `GET /API/USER` → Get current logged-in user

### User Claim APIs
- `POST /api/claims` → Upload prescription + bill documents (OCR + processing)
- `GET /claims/id/:id` → Get claim by ID
- `GET /claims/user` → Get all claims of logged-in user
- `GET /claims/user/pending` → Get pending claims of user
- `GET /claims/user/approved` → Get approved claims of user
- `GET /claims/user/rejected` → Get rejected claims of user

### Admin Claim APIs
- `GET /admin/claims` → Get all claims (earliest first)
- `PUT /admin/claims/:id/approve` → Approve claim with reason
- `PUT /admin/claims/:id/reject` → Reject claim with reason

---

## 🧪 Example Requests

### Signup
```bash
curl -X POST http://localhost:4898/Auth/Signup \
-H "Content-Type: application/json" \
-d '{"username":"Dhruv","email":"dhruv@example.com","password":"123456","role":"User"}'
```

### Login
```bash
curl -X POST http://localhost:4898/Auth/Login \
-H "Content-Type: application/json" \
-d '{"email":"dhruv@example.com","password":"123456"}'
```

### Upload Claim (OCR)
```bash
curl -X POST http://localhost:4898/api/claims \
-H "Content-Type: multipart/form-data" \
-F "documents=@prescription.jpg" \
-F "documents=@bill.jpg" \
--cookie "token=YOUR_JWT_COOKIE"
```

### Get Pending Claims
```bash
curl -X GET http://localhost:4898/claims/user/pending --cookie "token=YOUR_JWT_COOKIE"
```

### Approve Claim (Admin)
```bash
curl -X PUT http://localhost:4898/admin/claims/CLAIM_ID/approve \
-H "Content-Type: application/json" \
-d '{"reason":"All documents verified"}' \
--cookie "token=ADMIN_JWT_COOKIE"
```

### Reject Claim (Admin)
```bash
curl -X PUT http://localhost:4898/admin/claims/CLAIM_ID/reject \
-H "Content-Type: application/json" \
-d '{"reason":"Prescription missing signature"}' \
--cookie "token=ADMIN_JWT_COOKIE"
```

---

## 📌 GitHub Repo
[Clinikk Assignment Repo](https://github.com/Kejdhruv/assignment)

---

## ⚡ Setup & Run

1. Clone the repo
   ```bash
   git clone https://github.com/Kejdhruv/assignment.git
   cd assignment
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Add `.env` file
   ```env
   TOKEN_SECRET=Clinnik
   ```
4. Run backend
   ```bash
   npm run dev (nodemon)
   ```
5. Start frontend (React)
   ```bash
   cd frontend
   npm start
   ```

---

## 👨‍💻 Authors
- **Dhruv Kejriwal** - Full Stack Developer  

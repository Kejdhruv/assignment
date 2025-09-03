// claim-processor.js - Final Version

// A helper to normalize strings for better matching in business checks.
function normalizeString(str) {
  return str
    .toLowerCase()
    .replace(/tablet|capsule|syrup|tab\.?/g, "") // remove common medicine forms
    .replace(/[^a-z0-9]/g, "") // remove special characters
    .trim();
}

// A helper to parse date strings like 'DD/MM/YYYY' or 'DD-MM-YYYY' into Date objects.
// Parse many date formats into JS Date
// Parse many date formats and return "YYYY-MM-DD" or null
function parseDateString(dateStr) {
  if (!dateStr) return null;
  dateStr = dateStr.trim();

  // dd-mm-yyyy or dd/mm/yyyy
  let m = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (m) {
    let d = parseInt(m[1], 10);
    let mo = parseInt(m[2], 10);
    let y = parseInt(m[3], 10);
    if (y < 100) y += (y < 70 ? 2000 : 1900);
    return `${y}-${String(mo).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  }

  // dd MMM yyyy (e.g. 30 Aug 2025)
  m = dateStr.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (m) {
    const months = {jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12};
    let d = parseInt(m[1], 10);
    let mo = months[m[2].slice(0,3).toLowerCase()];
    let y = parseInt(m[3], 10);
    return `${y}-${String(mo).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  }

  return null;
}

// Extract date from OCR text (handles single-line and multi-line "Date" cases)
function extractDateFromText(text) {
  if (!text) return null;
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  // Inline case: "Date: 30-08-2025"
  const inlineMatch = text.match(/Date[:\-]?\s*([0-3]?\d[\/\-][0-1]?\d[\/\-]\d{2,4}|[0-3]?\d\s+[A-Za-z]+\s+\d{4})/i);
  if (inlineMatch) return parseDateString(inlineMatch[1]);

  // Multi-line case: "Date" on one line, value on next
  for (let i = 0; i < lines.length; i++) {
    if (/^date$/i.test(lines[i]) && lines[i+1]) {
      const m = lines[i+1].match(/([0-3]?\d[\/\-][0-1]?\d[\/\-]\d{2,4}|[0-3]?\d\s+[A-Za-z]+\s+\d{4})/i);
      if (m) return parseDateString(m[1]);
    }
  }

  return null;
}

// A helper to find and format time into a 24-hour "HH:MM" string.
function extractTime24hr(text) {
  const timeMatch = text.match(/Time[:\-]?\s*(\d{1,2}:\d{2})(?:\s*(AM|PM))?/i);
  if (!timeMatch) return null;

  let [_, time, period] = timeMatch;
  let [hours, minutes] = time.split(':').map(Number);

  if (period) {
    period = period.toUpperCase();
    if (period === 'PM' && hours < 12) {
      hours += 12;
    }
    if (period === 'AM' && hours === 12) { // Handle midnight case (12 AM)
      hours = 0;
    }
  }

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
} 

// Classifies a page based on keywords.
function classifyPage(text) {
  if (/bill|invoice|total|receipt/i.test(text)) return "bill";
  if (/prescription|diagnosis|dr\.|patient|rx/i.test(text)) return "prescription";
  return "unknown";
}

// Extracts the facility name from the text.
function extractFacility(text) {
  const facilityMatch = text.match(/^(.*(?:Hospital|Clinic|Centre|Center).*)$/im);
  if (facilityMatch) {
    // Clean up common prefixes that might be caught
    return facilityMatch[1].trim().replace(/Invoice from|Receipt from/i, '').trim();
  }
  return null;
}

// Extracts the address from the text.
function extractAddress(text) {
  const addressMatch = text.match(/Address[:\-]?\s*(.*)/i);
  return addressMatch ? addressMatch[1].trim() : null;
}

// **FIXED**: Extracts only the actual line items from a bill.
// ------------------ Bill Extraction ------------------

// Extracts individual line items from a bill
function extractBillItems(text) {
  const items = [];
  const ignoreKeywords = /bill no|date|time|address|patient|particulars|total|amount|invoice from|prescription no/i;

  text.split("\n").forEach(line => {
    if (!line.trim() || ignoreKeywords.test(line)) return;

    // Matches formats:
    // "Metoprolol - 120.50"
    // "Metoprolol ₹120.50"
    // "Metoprolol 120.50"
    const match = line.match(/^(.*?)\s*(?:[-:₹]?\s*)(\d+\.?\d*)$/);

    if (match) {
      const itemName = match[1].trim();
      if (itemName && isNaN(itemName)) {
        const price = parseFloat(match[2]);
        items.push({
          name: itemName,
          type: detectItemType(itemName),
          brand: null,
          composition: null,
          price: price,
          discount: 0,
          final: price
        });
      }
    }
  });

  return items;
}

// Extracts all fields from a bill page
function extractBill(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  let billNumber = null;
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let match = line.match(/Bill\s*(?:No\.?|Number)?[:\-]?\s*([A-Za-z0-9\/\-]+)/i);
    if (match) {
      billNumber = match[1].trim();
      break;
    }
    if (/^Bill$/i.test(line) && i + 1 < lines.length) {
      let nextLineMatch = lines[i + 1].match(/No[:\-]?\s*([A-Za-z0-9\/\-]+)/i);
      if (nextLineMatch) {
        billNumber = nextLineMatch[1].trim();
        break;
      }
    }
  }

  return {
    bill_number: billNumber,
    bill_date: extractDateFromText(text),
    bill_time: extractTime24hr(text),
    line_items: extractBillItems(text),
    total_paid_amount: parseFloat(
      text.match(/Total(?: Paid Amount| Amount)?[:\-]?\s*₹?\s*(\d+\.?\d*)/i)?.[1]
    ) || 0,
    facility_name: extractFacility(text),
    facility_address: extractAddress(text),
    prescription_number: text.match(/Presc(?:ription)?\s*No[:\-]?\s*([\w\/-]+)/i)?.[1] || null, // 🔑 here
    tnc_eligible: true
  };
}
// **FIXED**: Extracts only the names of prescribed items.
function extractPrescriptionItems(text) {
  const items = [];
  text.split("\n").forEach(line => {
    // Looks for a line starting with a number (e.g., "1.") and captures the item name.
    const match = line.match(/^\s*\d\.\s+(.*?)\s*(?:\.{3,}|-{2,}|$)/);
    if (match) {
      const itemName = match[1].trim();
      items.push({
        item: itemName,
        type: detectItemType(itemName),
        dose: null, frequency: null
      });
    }
  });
  return items;
}

// A helper to determine the type of an item based on keywords.
function detectItemType(line) {
  if (/tablet|capsule|syrup|cream|ointment|mg/i.test(line)) return "medicine";
  if (/supplement|protein|vitamin/i.test(line)) return "supplement";
  if (/test|scan|xray|mri|blood|urine|physio|ecg/i.test(line)) return "lab";
  return "other";
}



// **FIXED**: Extracts all fields from a prescription page and correctly sets specialist flag.
function extractPrescription(text) {
  const dateMatch = text.match(/Date[:\-]?\s*([\d\-\/]+)/i); 
  const specialty = text.match(/Specialty[:\-]?\s*(.*)/i)?.[1]?.trim() || "General Physician";
  const isSpecialist = specialty.toLowerCase() !== 'general physician';

  return {
    prescription_number: text.match(/Presc(?:ription)?\s*No[:\-]?\s*([\w\/-]+)/i)?.[1] || null,
    prescription_date:  extractDateFromText(text) ,
    prescription_time: extractTime24hr(text),
    visit_reason: text.match(/Reason for Visit[:\-]?\s*(.*)/i)?.[1]?.trim() || null,
    referral_reason: text.match(/Referral[:\-]?\s*(.*)/i)?.[1]?.trim() || null,
    doctor_sign_and_seal_present: /seal|signature/i.test(text),
    doctor_name: text.match(/Dr\.\s*([A-Za-z ]+)/i)?.[1]?.trim() || null,
    doctor_specialty: specialty,
    diagnosis: text.match(/Diagnosis[:\-]?\s*(.*)/i)?.[1]?.trim().split(/\s*,\s*/) || [],
    prescription_orders: extractPrescriptionItems(text), // Uses the new, smarter function
    facility_name: extractFacility(text),
    facility_address: extractAddress(text),
    specialist_prescription: isSpecialist // Correctly sets the flag now
  };
}

// This function was already correct. It runs the business logic on the extracted data.
function runBusinessChecks(prescription, bills) {
  const excludedItems = ["protein supplement", "cosmetic procedure", "vitamins"];
  let subtype = prescription.specialist_prescription ? "specialist" : "general";

  // Visit reason consistency
  let visit_reason_consistency = { passed: true, flag: null };
  if (
    subtype === "specialist" &&
    prescription.visit_reason &&
    prescription.referral_reason &&
    prescription.visit_reason.toLowerCase() !== prescription.referral_reason.toLowerCase()
  ) {
    visit_reason_consistency = {
      passed: false,
      flag: "Visit reason differs from referral reason."
    };
  }

  // Merge line items across all bills
  const allLineItems = bills.flatMap(b => b.line_items || []);

  // Prescribed + billed items
  const prescribed = (prescription.prescription_orders || []).map(o => ({
    original: o.item,
    normalized: normalizeString(o.item)
  }));
  const billed = allLineItems.map(i => ({
    original: i.name,
    normalized: normalizeString(i.name)
  }));

  const missing = prescribed
    .filter(p => !billed.some(b => b.normalized.includes(p.normalized) || p.normalized.includes(b.normalized)))
    .map(p => p.original);


const ignoreForExtra = [
  "prescription no",
  "consultation",
  "registration",
  "service charge",
  "room rent"
];

const extra = billed
  .filter(b => 
    !prescribed.some(p => b.normalized.includes(p.normalized) || p.normalized.includes(b.normalized)) &&
    !ignoreForExtra.some(kw => b.original.toLowerCase().includes(kw))
  )
  .map(b => b.original);

  const treatment_fulfillment = {
    missing,
    extra,
    passed: missing.length === 0 && extra.length === 0
  };

  // Policy exclusions
  const flaggedExclusions = allLineItems
    .filter(item => excludedItems.some(ex => item.name.toLowerCase().includes(ex)))
    .map(item => item.name);

  const policy_exclusions = {
    excluded_items: flaggedExclusions,
    passed: flaggedExclusions.length === 0
  };

  // Eligible amount calculation
  const totalClaimed = allLineItems.reduce((sum, item) => sum + (item.final || 0), 0);
  const eligibleAmount = allLineItems
    .filter(item => !flaggedExclusions.includes(item.name))
    .reduce((sum, item) => sum + (item.final || 0), 0);

  const eligible_amount_calculation = {
    totalClaimed: parseFloat(totalClaimed.toFixed(2)),
    eligibleAmount: parseFloat(eligibleAmount.toFixed(2)),
    passed: eligibleAmount === totalClaimed
  };

  return {
    subtype,
    visit_reason_consistency,
    treatment_fulfillment,
    policy_exclusions,
    eligible_amount_calculation
  };
}
// This is the main function that orchestrates the entire process. It was already correct.
export function processClaim(ocrPages, userInfo) {
  const classified = ocrPages.map((text, idx) => ({
    page: idx + 1,
    type: classifyPage(text),
    raw_text: text
  }));

  const prescriptions = classified
    .filter(p => p.type === "prescription")
    .map(p => extractPrescription(p.raw_text));

  const bills = classified
    .filter(p => p.type === "bill")
    .map(p => extractBill(p.raw_text));

  const claims = [];

  for (const presc of prescriptions) {
    // 🔑 Match bills by prescription_number
    const relatedBills = bills.filter(bill => 
      bill.prescription_number && bill.prescription_number === presc.prescription_number
    );

    const checks = runBusinessChecks(presc, relatedBills);

    claims.push({
      userId: userInfo.userId,
      name: userInfo.name,
      email: userInfo.email,
      prescription: presc,
      bills: relatedBills,
      checks,
      review: { status: "pending", decision: null, reason: null, reviewedAt: null },
      createdAt: new Date()
    });
  }

  return claims; // 🔑 multiple claims inserted individually
}
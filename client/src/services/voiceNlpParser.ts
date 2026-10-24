/**
 * Voice NLP Parser for SAHARA
 * Intelligently extracts structured form fields from spoken natural language
 * Supports English, Hindi, and Hinglish.
 */

export interface ParsedDonationOrNeed {
  title?: string;
  categoryName?: string;
  quantity?: number;
  quantityUnit?: string;
  description?: string;
  city?: string;
  address?: string;
  pincode?: string;
  urgency?: "low" | "medium" | "high" | "critical";
  intent?: "donor" | "receiver" | "volunteer";
  name?: string;
  phone?: string;
  email?: string;
}

const COMMON_CITIES = [
  "Delhi", "New Delhi", "Noida", "Gurgaon", "Gurugram", "Faridabad", "Ghaziabad",
  "Mumbai", "Pune", "Nagpur", "Nashik", "Thane",
  "Bangalore", "Bengaluru", "Hyderabad", "Chennai", "Kolkata",
  "Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer",
  "Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Meerut",
  "Bhopal", "Indore", "Gwalior", "Jabalpur",
  "Ahmedabad", "Surat", "Vadodara", "Rajkot",
  "Patna", "Ranchi", "Chandigarh", "Ludhiana", "Amritsar", "Dehradun"
];

const NUMBER_WORDS: Record<string, number> = {
  one: 1, ek: 1, "1": 1,
  two: 2, do: 2, "2": 2,
  three: 3, teen: 3, "3": 3,
  four: 4, char: 4, chaar: 4, "4": 4,
  five: 5, panch: 5, paanch: 5, "5": 5,
  six: 6, che: 6, chhah: 6, "6": 6,
  seven: 7, saat: 7, "7": 7,
  eight: 8, aath: 8, "8": 8,
  nine: 9, nau: 9, "9": 9,
  ten: 10, das: 10, "10": 10,
  fifteen: 15, pandrah: 15,
  twenty: 20, bees: 20,
  twentyfive: 25, pachees: 25,
  thirty: 30, tees: 30,
  fifty: 50, pachas: 50,
  hundred: 100, sau: 100,
  thousand: 1000, hazar: 1000, hazaar: 1000
};

export function parseVoiceInput(
  rawTranscript: string,
  availableCategories: { id: string; name: string }[] = []
): ParsedDonationOrNeed {
  const text = rawTranscript.trim();
  const lower = text.toLowerCase();
  const result: ParsedDonationOrNeed = {
    description: text
  };

  // 1. Extract Phone Number (10 digits)
  const phoneMatch = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);
  if (phoneMatch) {
    result.phone = phoneMatch[0].replace(/\D/g, "").slice(-10);
  }

  // 2. Extract 6-digit Pincode
  const pincodeMatch = text.match(/\b[1-9][0-9]{5}\b/);
  if (pincodeMatch) {
    result.pincode = pincodeMatch[0];
  }

  // 3. Extract Email (if mentioned like name at domain dot com or user@gmail.com)
  const emailDirect = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailDirect) {
    result.email = emailDirect[0].toLowerCase();
  } else {
    // Handle spoken email: "palak at the rate gmail dot com"
    const spokenEmail = lower.match(/([a-z0-9._]+)\s*(?:at the rate|at)\s*([a-z0-9.-]+)\s*(?:dot)\s*([a-z]{2,})/);
    if (spokenEmail) {
      result.email = `${spokenEmail[1].replace(/\s+/g, "")}@${spokenEmail[2].replace(/\s+/g, "")}.${spokenEmail[3]}`;
    }
  }

  // 4. Extract City
  for (const city of COMMON_CITIES) {
    const cityRegex = new RegExp(`\\b${city}\\b`, "i");
    if (cityRegex.test(lower)) {
      result.city = city;
      break;
    }
  }

  // If no city found from list, check prepositions: "in <City>", "near <City>", "<City> me"
  if (!result.city) {
    const inMatch = lower.match(/(?:in|near|at|me|se)\s+([a-zA-Z]+)/i);
    if (inMatch && inMatch[1] && inMatch[1].length > 3) {
      const candidate = inMatch[1];
      if (!["the", "urgent", "delhi", "need", "food", "help"].includes(candidate.toLowerCase())) {
        result.city = candidate.charAt(0).toUpperCase() + candidate.slice(1);
      }
    }
  }

  // 5. Extract Quantity & Unit
  // Patterns like "10 packets", "5 kg", "20 boxes", "15 plates", "दो पैकेट"
  const qtyDigitMatch = lower.match(/(\d+)\s*(kg|kilo|kilograms?|packets?|boxes|box|plates?|pieces?|items?|meals?|bottles?|pairs?|sets?|log|people|persons?|kambal|blankets?|shirts?|pants?)?/i);
  if (qtyDigitMatch) {
    result.quantity = parseInt(qtyDigitMatch[1], 10);
    if (qtyDigitMatch[2]) {
      result.quantityUnit = normalizeUnit(qtyDigitMatch[2]);
    }
  } else {
    // Check word numbers (e.g. "paanch packets", "five boxes")
    for (const [word, val] of Object.entries(NUMBER_WORDS)) {
      const wordRegex = new RegExp(`\\b${word}\\s+(packets?|boxes|box|plates?|kg|pieces?|items?|meals?|bottles?|kambal|blankets?|people|log)?\\b`, "i");
      const wordMatch = lower.match(wordRegex);
      if (wordMatch) {
        result.quantity = val;
        if (wordMatch[1]) {
          result.quantityUnit = normalizeUnit(wordMatch[1]);
        }
        break;
      }
    }
  }

  // Default quantity unit if none was recognized
  if (result.quantity && !result.quantityUnit) {
    result.quantityUnit = "items";
  }

  // 6. Match Category
  const categoryKeywords: Record<string, string[]> = {
    food: [
      "food", "khana", "ration", "meal", "roti", "rice", "lunch", "dinner", "breakfast",
      "fruits", "vegetables", "sabji", "grain", "atta", "dal", "groceries", "bhojan", "mithai"
    ],
    clothes: [
      "clothes", "clothing", "kapde", "kambal", "blanket", "shirt", "pant", "jacket",
      "sweater", "winter", "garam kapde", "saree", "dress", "uniform", "shoes", "chappal"
    ],
    education: [
      "books", "book", "kitab", "copy", "notebook", "stationery", "pen", "pencil",
      "bag", "school", "padhai", "textbook"
    ],
    medicine: [
      "medicine", "medical", "dawa", "dawain", "tablet", "first aid", "health", "syrup", "sanitizer"
    ],
    essentials: [
      "essentials", "household", "utensils", "bartan", "bedsheet", "mat", "towel", "soap", "brush"
    ]
  };

  let matchedCategoryKey = "";
  for (const [catKey, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      matchedCategoryKey = catKey;
      break;
    }
  }

  // Match with available categories from backend/props
  if (matchedCategoryKey && availableCategories.length > 0) {
    const found = availableCategories.find((c) =>
      c.name.toLowerCase().includes(matchedCategoryKey) ||
      (matchedCategoryKey === "education" && c.name.toLowerCase().includes("book")) ||
      (matchedCategoryKey === "essentials" && c.name.toLowerCase().includes("other"))
    );
    if (found) {
      result.categoryName = found.name;
    }
  }

  // 7. Urgency Detection
  if (/(urgent|emergency|turant|jaldi|asap|critical|immediate|critical)/i.test(lower)) {
    result.urgency = "high";
  } else {
    result.urgency = "medium";
  }

  // 8. Intent (for Register: donor / receiver / volunteer)
  if (/(donor|donate|dena|daan|giving|give)/i.test(lower)) {
    result.intent = "donor";
  } else if (/(receiver|need|chahiye|mangna|madad|zarurat|zaroorat|take|receive)/i.test(lower)) {
    result.intent = "receiver";
  } else if (/(volunteer|seva|social work)/i.test(lower)) {
    result.intent = "volunteer";
  }

  // 9. Name Extraction (for Register: "mera naam <Name>", "my name is <Name>", "I am <Name>")
  const nameMatch = text.match(/(?:my name is|mera naam|i am|name is)\s+([A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*)?)/i);
  if (nameMatch && nameMatch[1]) {
    result.name = nameMatch[1].trim();
  }

  // 10. Auto-generate a Clean Title
  result.title = generateTitle(text, result);

  return result;
}

function normalizeUnit(unit: string): string {
  const u = unit.toLowerCase();
  if (u.includes("pack")) return "packets";
  if (u.includes("box")) return "boxes";
  if (u.includes("plate") || u.includes("meal")) return "plates";
  if (u.includes("kg") || u.includes("kilo")) return "kg";
  if (u.includes("piece") || u.includes("kambal") || u.includes("blanket") || u.includes("shirt")) return "pieces";
  if (u.includes("log") || u.includes("people") || u.includes("person")) return "people";
  return "items";
}

function generateTitle(text: string, parsed: ParsedDonationOrNeed): string {
  if (parsed.quantity && parsed.categoryName) {
    return `${parsed.quantity} ${parsed.quantityUnit || "items"} of ${parsed.categoryName}`;
  }

  // Fallback: extract main keywords
  const cleaned = text
    .replace(/(?:i want to donate|mujhe donate karna hai|i need|mujhe chahiye|we need|humhe chahiye|please help with|in delhi|in mumbai|in jaipur)/gi, "")
    .trim();

  if (cleaned.length > 5 && cleaned.length < 50) {
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  if (parsed.categoryName) {
    return `${parsed.categoryName} Donation`;
  }

  return "Community Contribution";
}

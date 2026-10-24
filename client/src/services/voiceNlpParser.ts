/**
 * Voice NLP Parser for SAHARA
 * Intelligently extracts structured form fields from spoken natural language
 * Supports English, Hindi (Devanagari script), and Hinglish (Latin script).
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

const HINDI_CITY_MAP: Record<string, string> = {
  "दिल्ली": "Delhi",
  "नई दिल्ली": "Delhi",
  "नोएडा": "Noida",
  "गुड़गांव": "Gurugram",
  "गुरुग्राम": "Gurugram",
  "फरीदाबाद": "Faridabad",
  "गाजियाबाद": "Ghaziabad",
  "मुंबई": "Mumbai",
  "बंबई": "Mumbai",
  "पुणे": "Pune",
  "नागपुर": "Nagpur",
  "बैंगलोर": "Bangalore",
  "बेंगलुरु": "Bangalore",
  "हैदराबाद": "Hyderabad",
  "चेन्नई": "Chennai",
  "कोलकाता": "Kolkata",
  "जयपुर": "Jaipur",
  "जोधपुर": "Jodhpur",
  "उदयपुर": "Udaipur",
  "कोटा": "Kota",
  "अजमेर": "Ajmer",
  "लखनऊ": "Lucknow",
  "कानपुर": "Kanpur",
  "वाराणसी": "Varanasi",
  "बनारस": "Varanasi",
  "आगरा": "Agra",
  "प्रयागराज": "Prayagraj",
  "इलाहाबाद": "Prayagraj",
  "मेरठ": "Meerut",
  "भोपाल": "Bhopal",
  "इंदौर": "Indore",
  "ग्वालियर": "Gwalior",
  "जबलपुर": "Jabalpur",
  "अहमदाबाद": "Ahmedabad",
  "सूरत": "Surat",
  "वडोदरा": "Vadodara",
  "राजकोट": "Rajkot",
  "पटना": "Patna",
  "रांची": "Ranchi",
  "चंडीगढ़": "Chandigarh",
  "लुधियाना": "Ludhiana",
  "अमृतसर": "Amritsar",
  "देहरादून": "Dehradun"
};

const NUMBER_WORDS: Record<string, number> = {
  one: 1, ek: 1, "1": 1, "एक": 1,
  two: 2, do: 2, "2": 2, "दो": 2,
  three: 3, teen: 3, "3": 3, "तीन": 3,
  four: 4, char: 4, chaar: 4, "4": 4, "चार": 4,
  five: 5, panch: 5, paanch: 5, "5": 5, "पांच": 5, "पाँच": 5,
  six: 6, che: 6, chhah: 6, "6": 6, "छह": 6, "छः": 6,
  seven: 7, saat: 7, "7": 7, "सात": 7,
  eight: 8, aath: 8, "8": 8, "आठ": 8,
  nine: 9, nau: 9, "9": 9, "नौ": 9,
  ten: 10, das: 10, "10": 10, "दस": 10,
  fifteen: 15, pandrah: 15, "पंद्रह": 15,
  twenty: 20, bees: 20, "बीस": 20,
  twentyfive: 25, pachees: 25, "पच्चीस": 25,
  thirty: 30, tees: 30, "तीस": 30,
  fifty: 50, pachas: 50, "पचास": 50,
  hundred: 100, sau: 100, "सौ": 100,
  thousand: 1000, hazar: 1000, hazaar: 1000, "हज़ार": 1000, "हजार": 1000
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

  // 1. Extract Phone Number (handles continuous digits or spaced-out digits like "945 284 5710" or "94 52 84 57 10")
  const spacedPhoneMatch = text.match(/(?:\+?91[\s-]?)?([6-9](?:[\s-]?\d){9})\b/);
  if (spacedPhoneMatch && spacedPhoneMatch[1]) {
    result.phone = spacedPhoneMatch[1].replace(/\D/g, "");
  } else {
    const digitOnlyString = text.replace(/[^\d]/g, "");
    const tenDigits = digitOnlyString.match(/[6-9]\d{9}/);
    if (tenDigits) {
      result.phone = tenDigits[0];
    }
  }

  // 2. Extract 6-digit Pincode (handles spaced or direct 6 digits)
  const pincodeMatch = text.match(/\b([1-9](?:[\s-]?[0-9]){5})\b/);
  if (pincodeMatch && (!result.phone || !result.phone.includes(pincodeMatch[1].replace(/\D/g, "")))) {
    const cleanPin = pincodeMatch[1].replace(/\D/g, "");
    if (cleanPin.length === 6) {
      result.pincode = cleanPin;
    }
  }

  // 3. Extract Email (direct format or spoken like "name at the rate gmail dot com")
  const emailDirect = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailDirect) {
    result.email = emailDirect[0].toLowerCase();
  } else {
    const spokenEmail = lower.match(/([a-z0-9._]+)\s*(?:at the rate|at)\s*([a-z0-9.-]+)\s*(?:dot)\s*([a-z]{2,})/);
    if (spokenEmail) {
      result.email = `${spokenEmail[1].replace(/\s+/g, "")}@${spokenEmail[2].replace(/\s+/g, "")}.${spokenEmail[3]}`;
    }
  }

  // 4. Extract City (English / Hinglish / Devanagari Hindi)
  for (const [hindiName, engName] of Object.entries(HINDI_CITY_MAP)) {
    if (text.includes(hindiName)) {
      result.city = engName;
      break;
    }
  }

  if (!result.city) {
    for (const city of COMMON_CITIES) {
      const cityRegex = new RegExp(`\\b${city}\\b`, "i");
      if (cityRegex.test(lower)) {
        result.city = city;
        break;
      }
    }
  }

  // If no city found from list, check prepositions: "in <City>", "near <City>", "<City> me"
  if (!result.city) {
    const inMatch = lower.match(/(?:in|near|at|me|se|में|से)\s+([a-zA-Z\u0900-\u097F]+)/i);
    if (inMatch && inMatch[1] && inMatch[1].length > 2) {
      const candidate = inMatch[1];
      if (!["the", "urgent", "delhi", "need", "food", "help", "रोहिणी", "घर"].includes(candidate.toLowerCase())) {
        result.city = candidate.charAt(0).toUpperCase() + candidate.slice(1);
      }
    }
  }

  // 5. Extract Quantity & Unit (must NOT match phone numbers or pincodes)
  let textForQty = lower;
  if (result.phone) {
    textForQty = textForQty.replace(result.phone, " ");
  }
  if (result.pincode) {
    textForQty = textForQty.replace(result.pincode, " ");
  }
  // Strip any remaining 6+ digit numbers (phone/pincode candidates)
  textForQty = textForQty.replace(/\b\d{6,}\b/g, " ");

  // Match digit with explicit unit
  const qtyDigitMatch = textForQty.match(/\b(\d{1,5})\s*(kg|kilo|kilograms?|packets?|boxes|box|plates?|pieces?|items?|meals?|bottles?|pairs?|sets?|log|people|persons?|kambal|blankets?|shirts?|pants?|पैकेट|कंबल|कपड़े|किलो)\b/i);
  if (qtyDigitMatch) {
    result.quantity = parseInt(qtyDigitMatch[1], 10);
    result.quantityUnit = normalizeUnit(qtyDigitMatch[2]);
  } else {
    // Check word numbers (English + Hindi words) with explicit units
    for (const [word, val] of Object.entries(NUMBER_WORDS)) {
      const wordRegex = new RegExp(`(?:\\b${word}\\b|${word})\\s*(packets?|boxes|box|plates?|kg|pieces?|items?|meals?|bottles?|kambal|blankets?|people|log|पैकेट|कंबल|कपड़े)\\b`, "i");
      const wordMatch = text.match(wordRegex);
      if (wordMatch) {
        result.quantity = val;
        if (wordMatch[1]) {
          result.quantityUnit = normalizeUnit(wordMatch[1]);
        }
        break;
      }
    }
  }

  // 6. Match Category (English + Hindi)
  const categoryKeywords: Record<string, string[]> = {
    Food: [
      "food", "khana", "ration", "meal", "meals", "roti", "rice", "lunch", "dinner", "breakfast",
      "fruits", "vegetables", "sabji", "grain", "atta", "dal", "groceries", "bhojan", "mithai",
      "भोजन", "खाना", "रोटी", "चावल", "राशन", "अनाज", "फल", "सब्जी", "दाल"
    ],
    Clothes: [
      "clothes", "clothing", "kapde", "shirt", "pant", "jacket",
      "sweater", "winter", "garam kapde", "saree", "dress", "uniform", "shoes", "chappal",
      "कपड़े", "वस्त्र", "स्वेटर", "जैकेट"
    ],
    Blankets: [
      "blanket", "blankets", "kambal", "quilt", "rajai", "bedsheet", "कंबल", "रजाई", "चादर"
    ],
    Books: [
      "books", "book", "kitab", "copy", "notebook", "stationery", "pen", "pencil",
      "bag", "school", "padhai", "textbook",
      "किताबें", "किताब", "कॉपी", "स्टेशनरी", "पेन", "बैग"
    ],
    "Medicines & First Aid": [
      "medicine", "medicines", "medical", "dawa", "dawain", "tablet", "first aid", "health", "syrup", "sanitizer",
      "दवा", "दवाइयां", "इलाज", "दवाई", "गोलियां"
    ],
    Other: [
      "essentials", "household", "utensils", "bartan", "mat", "towel", "soap", "brush", "toys",
      "बर्तन", "ज़रूरी", "सामान"
    ]
  };

  // 1) First check if any available category name is directly mentioned in text
  for (const cat of availableCategories) {
    if (lower.includes(cat.name.toLowerCase())) {
      result.categoryName = cat.name;
      break;
    }
  }

  // 2) If not directly mentioned, match via keywords
  if (!result.categoryName) {
    for (const [standardCat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((kw) => text.includes(kw) || lower.includes(kw.toLowerCase()))) {
        const found = availableCategories.find(c => 
          c.name.toLowerCase().includes(standardCat.toLowerCase()) || 
          standardCat.toLowerCase().includes(c.name.toLowerCase())
        );
        result.categoryName = found ? found.name : standardCat;
        break;
      }
    }
  }

  // 3) If user explicitly said "category <name>" or "shreni <name>"
  if (!result.categoryName) {
    const explicitCat = lower.match(/(?:category|shreni|श्रेणी)\s+([a-zA-Z\u0900-\u097F]+)/i);
    if (explicitCat && explicitCat[1]) {
      const word = explicitCat[1];
      const found = availableCategories.find(c => c.name.toLowerCase().includes(word));
      result.categoryName = found ? found.name : (word.charAt(0).toUpperCase() + word.slice(1));
    }
  }

  // 7. Urgency Detection
  if (/(urgent|emergency|turant|jaldi|asap|critical|immediate|तत्काल|ज़रूरी|जल्दी|आपातकालीन)/i.test(text)) {
    result.urgency = "high";
  } else {
    result.urgency = "medium";
  }

  // 8. Intent (for Register: donor / receiver / volunteer)
  if (/(donor|donate|dena|daan|giving|give|डोनर|दान|देना|मदद करना)/i.test(text)) {
    result.intent = "donor";
  } else if (/(receiver|need|chahiye|mangna|madad|zarurat|zaroorat|take|receive|रिसीवर|चाहिए|ज़रूरत|मदद चाहिए)/i.test(text)) {
    result.intent = "receiver";
  } else if (/(volunteer|seva|social work|वॉलंटियर|सेवा)/i.test(text)) {
    result.intent = "volunteer";
  }

  // 9. Name Extraction (Support English + Hindi Devanagari)
  const nameDevanagari = text.match(/(?:मेरा नाम|नाम है)\s+([^\s,।]+(?:\s+[^\s,।]+)?)/);
  if (nameDevanagari && nameDevanagari[1]) {
    result.name = nameDevanagari[1].replace(/है$/g, "").trim();
  } else {
    const nameLatin = text.match(/(?:my name is|mera naam|i am|name is)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
    if (nameLatin && nameLatin[1]) {
      result.name = nameLatin[1].trim();
    } else {
      // Smart Fallback: If user starts speech with 1-3 capitalized/name words (e.g. "Priya Sharma, 9876543210...")
      const words = text.split(/[\s,]+/);
      const candidateWords: string[] = [];
      const ignoreWords = new Set([
        "i", "am", "want", "to", "donate", "need", "help", "hello", "hi", "namaste", "please",
        "donor", "receiver", "volunteer", "account", "urgent", "delhi", "mumbai", "lucknow", "jaipur",
        "मेरा", "मेरी", "मुझे", "चाहिए", "दान", "डोनर", "रिसीवर", "नमस्ते"
      ]);

      for (const w of words) {
        const clean = w.toLowerCase().replace(/[^a-z\u0900-\u097F]/g, "");
        if (!clean) continue;
        if (/\d/.test(w) || w.includes("@") || ignoreWords.has(clean) || COMMON_CITIES.some(c => c.toLowerCase() === clean) || HINDI_CITY_MAP[w]) {
          break;
        }
        candidateWords.push(w);
        if (candidateWords.length >= 3) break;
      }

      if (candidateWords.length >= 1 && candidateWords.length <= 3) {
        const combined = candidateWords.join(" ");
        // Avoid single tiny non-name words
        if (combined.length >= 3 && !["the", "and", "aur", "and"].includes(combined.toLowerCase())) {
          result.name = combined;
        }
      }
    }
  }

  // 10. Auto-generate Title
  result.title = generateTitle(text, result);

  return result;
}

function normalizeUnit(unit: string): string {
  const u = unit.toLowerCase();
  if (u.includes("pack") || u.includes("पैकेट")) return "packets";
  if (u.includes("box") || u.includes("बॉक्स")) return "boxes";
  if (u.includes("plate") || u.includes("meal")) return "plates";
  if (u.includes("kg") || u.includes("kilo") || u.includes("किलो")) return "kg";
  if (u.includes("piece") || u.includes("kambal") || u.includes("blanket") || u.includes("कंबल") || u.includes("कपड़े")) return "pieces";
  if (u.includes("log") || u.includes("people") || u.includes("person") || u.includes("लोग")) return "people";
  return "items";
}

function generateTitle(text: string, parsed: ParsedDonationOrNeed): string {
  if (parsed.quantity && parsed.categoryName) {
    return `${parsed.quantity} ${parsed.quantityUnit || "items"} of ${parsed.categoryName}`;
  }
  if (parsed.categoryName) {
    return `Donation / Request of ${parsed.categoryName}`;
  }
  return text.slice(0, 40) + "...";
}

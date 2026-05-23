/**
 * Converts a number into Indian Rupees written text layout (Lakhs & Crores).
 */
export function amtWordsIndian(amount) {
  if (amount === 0) return "Rupees Zero Only";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  function convertBelowThousand(num) {
    if (num < 20) return ones[num];
    const tensPlace = Math.floor(num / 10);
    const onesPlace = num % 10;
    return (tens[tensPlace] + (onesPlace ? " " + ones[onesPlace] : "")).trim();
  }

  function convertBelowLakh(num) {
    if (num < 100) return convertBelowThousand(num);
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    return (ones[hundreds] + " Hundred" + (remainder ? " and " + convertBelowThousand(remainder) : "")).trim();
  }

  function convert(num) {
    if (num === 0) return "";
    
    // Crores
    if (num >= 10000000) {
      const crores = Math.floor(num / 10000000);
      const remainder = num % 10000000;
      return (convert(crores) + " Crore" + (remainder ? " " + convert(remainder) : "")).trim();
    }
    
    // Lakhs
    if (num >= 100000) {
      const lakhs = Math.floor(num / 100000);
      const remainder = num % 100000;
      return (convertBelowThousand(lakhs) + " Lakh" + (remainder ? " " + convert(remainder) : "")).trim();
    }
    
    // Thousands
    if (num >= 1000) {
      const thousands = Math.floor(num / 1000);
      const remainder = num % 1000;
      return (convertBelowThousand(thousands) + " Thousand" + (remainder ? " " + convert(remainder) : "")).trim();
    }
    
    return convertBelowLakh(num);
  }

  const parts = Number(amount).toFixed(2).split(".");
  const rupees = parseInt(parts[0], 10);
  const paise = parseInt(parts[1], 10);

  let rupeeStr = rupees > 0 ? convert(rupees) + " Rupees" : "";
  let paiseStr = paise > 0 ? convertBelowThousand(paise) + " Paise" : "";

  let finalWords = "";
  if (rupeeStr && paiseStr) {
    finalWords = rupeeStr + " and " + paiseStr + " Only";
  } else if (rupeeStr) {
    finalWords = rupeeStr + " Only";
  } else if (paiseStr) {
    finalWords = paiseStr + " Only";
  } else {
    finalWords = "Zero Rupees Only";
  }

  return finalWords;
}

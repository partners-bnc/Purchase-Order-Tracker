const fs = require("fs");
const { PDFParse } = require("pdf-parse");

let dataBuffer = fs.readFileSync("C:\\Users\\anshu\\Desktop\\Purchase Order\\Net solutions Receipt (1).pdf");
const uint8 = new Uint8Array(dataBuffer);

try {
  const parser = new PDFParse(uint8);
  const textPromise = parser.getText();
  textPromise.then(res => {
    console.log("Resolved type:", typeof res, res ? res.constructor.name : "null");
    console.log("Keys of resolved:", Object.keys(res));
    
    // Check common text fields or serialize
    let output = "";
    if (typeof res === "string") {
      output = res;
    } else if (res && typeof res.text === "string") {
      output = res.text;
    } else if (res && typeof res.getText === "function") {
      output = res.getText();
    } else {
      output = JSON.stringify(res, null, 2);
    }
    
    fs.writeFileSync("C:\\Users\\anshu\\Desktop\\Purchase Order\\pdf_text.txt", output || "Empty");
    console.log("Wrote extracted output to pdf_text.txt");
  }).catch(err => console.error("getText() async failed:", err));
} catch (e) {
  console.error("Parser execution failed:", e);
}

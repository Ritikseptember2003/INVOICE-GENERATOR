import { jsPDF } from "jspdf";
import { useEffect, useState } from "react";
import logoImage from "./assets/logo.png";

interface LogoData {
  data: string;
  width: number;
  height: number;
}

const GenerateInvoice = () => {
  const [logoData, setLogoData] = useState<LogoData | null>(null);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Add this for CORS issues if needed
        img.src = logoImage;
  
        img.onload = function () {
          // Use a larger size for better visibility
          const logoWidth = 40; // Increased from 20
          const logoHeight = (logoWidth * img.height) / img.width; 
  
          console.log("Original image dimensions:", img.width, "x", img.height);
          console.log("Scaled dimensions:", logoWidth, "x", logoHeight);
  
          const canvas = document.createElement("canvas");
          canvas.width = logoWidth;
          canvas.height = logoHeight;
          const ctx = canvas.getContext("2d");
          
          if (ctx) {
            // Clear canvas before drawing
            ctx.clearRect(0, 0, logoWidth, logoHeight);
            // Use better quality settings
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, logoWidth, logoHeight);
  
            // Use a higher quality in toDataURL
            const dataUrl = canvas.toDataURL("image/png", 1.0);
            
            setLogoData({
              data: dataUrl,
              width: logoWidth,
              height: logoHeight,
            });
  
            console.log("Logo loaded successfully");
          } else {
            console.error("Failed to get canvas context");
          }
        };
  
        img.onerror = function (error) {
          console.error("Failed to load logo:", error);
          setLogoData(null);
        };
      } catch (error) {
        console.error("Error loading logo:", error);
        setLogoData(null);
      }
    };
  
    loadLogo();
  }, []);  

  const generatePDF = async () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const leftMargin = 20;
    const rightMargin = 20;
    const pageWidth = 210;
    const contentWidth = pageWidth - (leftMargin + rightMargin);
    let currentY = 30;

    const addSpace = (space: number) => {
      currentY += space;
    };

    // Better logo handling
    try {
      if (logoData && logoData.data) {
        // Positioning the logo with more space
        doc.addImage(
          logoData.data, 
          "PNG", 
          leftMargin, 
          currentY - 15, 
          logoData.width, 
          logoData.height
        );
        console.log("Added logo to PDF with dimensions:", logoData.width, "x", logoData.height);
      } else {
        console.log("No logo available to add to PDF");
        // Add a placeholder for debugging
        doc.setFillColor(240, 240, 240);
        doc.rect(leftMargin, currentY - 15, 40, 20, 'F');
        doc.setTextColor(180, 180, 180);
        doc.setFontSize(8);
        doc.text("Logo placeholder", leftMargin + 5, currentY - 5);
      }
    } catch (error) {
      console.error("Error adding logo to PDF:", error);
    }

    // Reset text color
    doc.setTextColor(0, 0, 0);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("INVOICE", pageWidth - rightMargin, currentY + 2, { align: "right" });
    doc.setFontSize(10);
    doc.text("DysonCloud", pageWidth - rightMargin, currentY + 8, { align: "right" });
    doc.text("TIN/PAN: 09BRNPK9651G1Z7", pageWidth - rightMargin, currentY + 14, { align: "right" });
    doc.text("admin@cloudphant.com", pageWidth - rightMargin, currentY + 20, { align: "right" });
    doc.text("https://cloudphant.com", pageWidth - rightMargin, currentY + 26, { align: "right" });
    addSpace(35);

    doc.setFillColor(240, 240, 240);
    doc.roundedRect(leftMargin, currentY, contentWidth, 15, 2, 2, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.text("Invoice no: 007", leftMargin + 5, currentY + 6);
    doc.text("Invoice date: 26-Dec-2024", leftMargin + 5, currentY + 12);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 20, 60);
    doc.text("US$ 40.12", pageWidth - rightMargin - 5, currentY + 6, { align: "right" });
    doc.setFontSize(10);
    doc.text("AMOUNT DUE", pageWidth - rightMargin - 5, currentY + 12, { align: "right" });
    
    doc.setTextColor(0, 0, 0);
    
    addSpace(25);

    doc.setFontSize(12);
    doc.text("BILL TO", leftMargin + 5, currentY);
    addSpace(8);
    doc.setFontSize(11);
    doc.text("My Team", leftMargin + 5, currentY);
    addSpace(6);
    doc.text("cloudphant@gmail.com", leftMargin + 5, currentY);
    addSpace(6);
    doc.text("DYSONCLOUD (GSTN: 09BRNPK9651G1Z7)", leftMargin + 5, currentY);
    addSpace(6);
    doc.text("371, B-Block, Panki, Kanpur, UP, 208020, INDIA", leftMargin + 5, currentY);
    addSpace(6);
    doc.text("7355593866", leftMargin + 5, currentY);
    addSpace(10);

    doc.setFillColor(230, 230, 230);
    doc.rect(leftMargin, currentY, contentWidth, 10, 'F');
    doc.setFontSize(9);
    
    const colWidths = { no: 15, desc: 70, qty: 20, price: 25, amount: 40 };
    const colPos = {
      no: leftMargin + 5,
      desc: leftMargin + colWidths.no + 5,
      qty: leftMargin + colWidths.no + colWidths.desc + 5,
      price: leftMargin + colWidths.no + colWidths.desc + colWidths.qty + 5,
      amount: leftMargin + colWidths.no + colWidths.desc + colWidths.qty + colWidths.price + 5
    };
    
    doc.setFont("helvetica", "bold");
    doc.text("No", colPos.no + 5, currentY + 6);
    doc.text("Items and Description", colPos.desc + 5, currentY + 6);
    doc.text("Qty/Hrs", colPos.qty + 5, currentY + 6);
    doc.text("Price (US$)", colPos.price + 5, currentY + 6);
    doc.text("Amount (US$)", colPos.amount + 5, currentY + 6);
    addSpace(10);

    // Multiple Items Added
    const items = [
      { no: 1, desc: "SERVER - Vultr High Frequency 2C4GB", qty: 1, price: 40.12, amount: 40.12 },
      { no: 2, desc: "SERVER - AWS EC2 t2.medium", qty: 2, price: 60.50, amount: 121.00 },
      { no: 3, desc: "SERVER - DigitalOcean Droplet 4GB", qty: 3, price: 20.00, amount: 60.00 }
    ];

    items.forEach(item => {
      doc.setFont("helvetica", "normal");
      doc.text(item.no.toString(), colPos.no + 5, currentY + 6);
      doc.text(item.desc, colPos.desc + 5, currentY + 6);
      doc.text(item.qty.toString(), colPos.qty + 12, currentY + 6);
      doc.text(item.price.toFixed(2), colPos.price + 10, currentY + 6);
      doc.text(item.amount.toFixed(2), colPos.amount + 15, currentY + 6);
      addSpace(6);
    });

    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, currentY + 10, leftMargin + contentWidth, currentY + 10);
    
    addSpace(15);

    doc.setFontSize(11);
    doc.text("Subtotal:", pageWidth - rightMargin - 70, currentY);
    doc.text("US$ 221.12", pageWidth - rightMargin, currentY, { align: "right" });
    addSpace(8);
    
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(pageWidth/2, currentY - 4, pageWidth - rightMargin, currentY - 4);
    addSpace(4);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL:", pageWidth - rightMargin - 70, currentY);
    doc.text("US$ 221.12 USD", pageWidth - rightMargin, currentY, { align: "right" });
    addSpace(8);

    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(pageWidth/2, currentY - 4, pageWidth - rightMargin, currentY - 4);

    doc.save("invoice.pdf");
  };

  return (
    <button
      onClick={generatePDF}
      className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
    >
      Download Invoice
    </button>
  );
};

export default GenerateInvoice;
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// export const viewPDF = async (htmlString) => {
//   try {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(htmlString, "text/html");

//     // Extract logo if exists
//     let logoImg =
//       doc.querySelector(".logo") ||
//       doc.querySelector("#logo") ||
//       doc.querySelector('img[src*="logo"]') ||
//       doc.querySelector("img");

//     let logoHTML = "";
//     if (logoImg) {
//       logoHTML = logoImg.outerHTML;
//       logoImg.remove();
//     }

//     // Extract the offer letter title from HTML body
//     let offerTitleHTML = "";
//     const firstHeading = doc.body.querySelector("h1, h2, h3, .offer-title");
//     if (firstHeading) {
//       offerTitleHTML = firstHeading.outerHTML;
//       firstHeading.remove();
//     }

//     /* ---------------------------------------------------
//        🔥 NEW LOGIC 1: Increase FONT SIZE of HTML Title
//        --------------------------------------------------- */
//     if (offerTitleHTML) {
//       offerTitleHTML = offerTitleHTML.replace(
//         /<(h1|h2|h3|div)/,
//         `<$1 style="margin:0; padding:0; font-size:28px; font-weight:700; line-height:1.1; text-align:center;"`
//       );
//     }

//     /* ----------------------------------------------------
//        🔥 NEW LOGIC 2: LAST HTML ELEMENT -> RIGHT ALIGN
//        ---------------------------------------------------- */
// // RIGHT-ALIGN + ABSOLUTE POSITION + SMALL BOTTOM GAP
// const elements = doc.body.children;
// if (elements.length > 1) {
//   const secondLast = elements[elements.length - 2];

//   secondLast.style.position = "absolute";
//   secondLast.style.right = "0px";
//   secondLast.style.bottom = "60px"; // 👈 margin-bottom very small now
//   secondLast.style.textAlign = "right";
//   secondLast.style.width = "100%";
// }



//     // Create offscreen container for PDF
//     const container = document.createElement("div");
//     container.style.position = "fixed";
//     container.style.left = "-9999px";
//     container.style.top = "0";
//     container.style.width = "794px";
//     container.style.minHeight = "1123px";
//     container.style.background = "white";
//     container.style.boxSizing = "border-box";
//     container.style.padding = "5px";

//     container.innerHTML = `
//       <div style="width: 100%; max-width: 784px; margin: 0 auto;">

//         <!-- Logo -->
//         <div style="text-align: left; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 5px;">
//           ${logoHTML ? `<div>${logoHTML}</div>` : ""}
//         </div>

//         <!-- Offer Letter Title -->
//         <div style="text-align: center; margin: 0; padding: 0; line-height: 1;">
//           ${offerTitleHTML ?? ""}
//         </div>

//         <!-- Main Content -->
//         <div style="width: 100%;">
//           ${doc.body.innerHTML}
//         </div>

//         <!-- Footer -->
//         <div style="text-align: center; border-top: 2px solid #000; padding-top: 20px; margin-top: 40px;">
//         </div>

//       </div>
//     `;

//     document.body.appendChild(container);

//     await loadAllImages(container);

//     const canvas = await html2canvas(container, {
//       scale: 2,
//       useCORS: true,
//       allowTaint: true,
//       backgroundColor: "#ffffff",
//     });

//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");

//     const pdfWidth = 210;
//     const pdfHeight = 297;
//     const margin = 5;

//     const imgProps = pdf.getImageProperties(imgData);
//     let pdfImgWidth = pdfWidth - 2 * margin;
//     let pdfImgHeight = (imgProps.height * pdfImgWidth) / imgProps.width;

//     if (pdfImgHeight > pdfHeight - 2 * margin) {
//       const scale = (pdfHeight - 2 * margin) / pdfImgHeight;
//       pdfImgHeight = pdfImgHeight * scale;
//       pdfImgWidth = pdfImgWidth * scale;
//     }

//     const xOffset = (pdfWidth - pdfImgWidth) / 2;
//     const yOffset = (pdfHeight - pdfImgHeight) / 2;

//     pdf.addImage(imgData, "PNG", xOffset, yOffset, pdfImgWidth, pdfImgHeight);

//     pdf.save("OfferLetter.pdf");
//     document.body.removeChild(container);
//   } catch (error) {
//     console.error("Preview PDF Error:", error);
//     alert("Error generating PDF preview. Please try again.");
//   }
// };/

export const viewPDF = async (htmlString) => {
    

  
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/offerletters/generate-pdf`,
      { htmlContent: htmlString },
      { 
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Create blob and download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = 'offer-letter.pdf';
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);

  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert("Error generating PDF. Please try again.");
  }
};

// Helper
const loadAllImages = (container) => {
  return new Promise((resolve) => {
    const images = container.getElementsByTagName("img");
    let loadedCount = 0;

    if (images.length === 0) resolve();

    Array.from(images).forEach((img) => {
      img.setAttribute("crossOrigin", "anonymous");
      if (img.complete) {
        loadedCount++;
      } else {
        img.onload = img.onerror = () => {
          loadedCount++;
          if (loadedCount === images.length) resolve();
        };
      }
    });

    if (loadedCount === images.length) resolve();
  });
};

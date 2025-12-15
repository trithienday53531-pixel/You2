import { FileType } from '../types';

declare const mammoth: any; // Global from CDN

export const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

export const extractTextFromDocx = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result;
      if (!arrayBuffer) {
        reject(new Error("Failed to read file"));
        return;
      }
      
      mammoth.extractRawText({ arrayBuffer: arrayBuffer })
        .then((result: any) => {
          resolve(result.value);
        })
        .catch((err: any) => reject(err));
    };
    reader.readAsArrayBuffer(file);
  });
};

export const readFileContent = async (file: File): Promise<{ mimeType: string; data: string }> => {
  // For TXT, we read as text directly to ensure clean input
  if (file.type === FileType.TXT) {
    const text = await file.text();
    // Encode text to base64 to unify the API payload structure
    return {
      mimeType: 'text/plain',
      data: btoa(unescape(encodeURIComponent(text))) 
    };
  }

  // For DOCX, we convert to text using mammoth first, then send as text
  if (file.type === FileType.DOCX) {
    const text = await extractTextFromDocx(file);
    return {
      mimeType: 'text/plain',
      data: btoa(unescape(encodeURIComponent(text)))
    };
  }

  // For PDF, we send the PDF base64 directly to Gemini (Multimodal)
  if (file.type === FileType.PDF) {
    const base64 = await readFileAsBase64(file);
    return {
      mimeType: 'application/pdf',
      data: base64
    };
  }

  throw new Error("Unsupported file type");
};
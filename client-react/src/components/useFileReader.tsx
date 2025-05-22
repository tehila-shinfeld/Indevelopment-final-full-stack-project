import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const useFileReader = () => {
  const [fileContent, setFileContent] = useState<string>("");

  const readFile = async (file: File) => {
    const fileType = file.type;

    if (fileType === "text/plain") {
      const text = await file.text();
      setFileContent(text);
    } else if (fileType === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        text += content.items.map((item: any) => item.str).join(" ") + "\n";
      }
      setFileContent(text);
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setFileContent(result.value);
    } else {
      setFileContent("❌ סוג קובץ לא נתמך");
    }
  };
  return { fileContent, readFile };
};

export default useFileReader;

from pypdf import PdfReader
import io

class ResumeParser:
    @staticmethod
    def extract_text(file_content: bytes) -> str:
        """
        Extracts text from a PDF resume.
        """
        try:
            reader = PdfReader(io.BytesIO(file_content))
            text = ""
            for page in reader.pages:
                text += page.extract_text()
            return text
        except Exception as e:
            print(f"Error parsing PDF: {e}")
            return ""

    @staticmethod
    def parse_metadata(text: str) -> dict:
        """
        A shell for logic that would use LLM to extract structured data from resume text.
        """
        return {
            "suggested_skills": [],
            "experience_years": 0,
            "extracted_bio": text[:500] if text else ""
        }

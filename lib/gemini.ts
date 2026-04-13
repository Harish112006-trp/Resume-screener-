import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please configure it in your environment variables.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export interface AnalysisResult {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  recommendations: string[];
  detailedAnalysis: string;
}

export async function analyzeResume(jobDescription: string, resumeText: string): Promise<AnalysisResult> {
  const ai = getAI();
  const prompt = `
    Analyze the following resume against the provided job description.
    Provide a detailed match analysis including a score from 0 to 100.
    
    Job Description:
    ${jobDescription}
    
    Resume:
    ${resumeText}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are an expert HR recruiter and technical hiring manager. Your task is to screen resumes against job descriptions with high accuracy and provide constructive feedback.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: {
            type: Type.NUMBER,
            description: "A match score from 0 to 100 based on how well the resume fits the job description.",
          },
          summary: {
            type: Type.STRING,
            description: "A brief 2-3 sentence summary of the overall match.",
          },
          strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Key strengths found in the resume that match the job requirements.",
          },
          weaknesses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Areas where the resume falls short or lacks experience required by the job.",
          },
          missingKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Important keywords or skills from the job description that are missing from the resume.",
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Actionable advice for the candidate to improve their resume for this specific role.",
          },
          detailedAnalysis: {
            type: Type.STRING,
            description: "A more in-depth analysis of the candidate's profile relative to the role.",
          },
        },
        required: ["score", "summary", "strengths", "weaknesses", "missingKeywords", "recommendations", "detailedAnalysis"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(text) as AnalysisResult;
}

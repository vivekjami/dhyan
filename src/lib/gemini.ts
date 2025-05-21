// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function rewritePollQuestion(question: string): Promise<string> {
  try {
    const prompt = `Rewrite the following poll question to make it more engaging and clear: "${question}"`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return response.trim();
  } catch (error) {
    console.error('Error rewriting poll question:', error);
    return question; // Return original question if there's an error
  }
}
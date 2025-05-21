// lib/gemini.ts
export async function rewritePollQuestion(question: string): Promise<string> {
    try {
      const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      if (!GEMINI_API_KEY) {
        console.error('Gemini API key not found');
        return question;
      }
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Rewrite the following poll question to make it clearer, more engaging, and professionally phrased: "${question}"`,
                  },
                ],
              },
            ],
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.candidates[0].content.parts[0].text || question;
    } catch (error) {
      console.error('Error accessing Gemini API:', error);
      return question;
    }
  }
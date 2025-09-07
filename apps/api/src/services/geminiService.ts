import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-pro" })

export const summarizeEmail = async (Subject: string, body: string) => {
   const prompt = `Summarize this email clearly and concisely: Subject: ${Subject} Body: ${body}`;

   const result = await model.generateContent(prompt)
   return result.response.text()
}
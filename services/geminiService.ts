
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getAIResponse = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return "Desculpe, a chave da API para o assistente de IA não está configurada. Por favor, adicione-a nas variáveis de ambiente.";
  }
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um assistente de gestão de projetos. Seja conciso e útil. Pergunta do usuário: "${prompt}"`,
    });
    
    const text = response.text;
    if (text) {
        return text;
    } else {
        return "Não consegui gerar uma resposta. Tente novamente.";
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Ocorreu um erro ao contatar o assistente de IA. Verifique o console para mais detalhes.";
  }
};

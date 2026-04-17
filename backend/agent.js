const { ChatOpenAI } = require("@langchain/openai");
const { ChatOllama } = require("@langchain/ollama");
const { PromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
require('dotenv').config();

async function getPlantDiagnosis(plantName, symptoms) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("Warning: OPENAI_API_KEY is missing. OpenAI fallback will not work.");
  }

  try {
    // 1. Primary Model: Ollama with llama3
    const ollamaModel = new ChatOllama({
      model: "llama3",
      temperature: 0.2,
    });

    // 2. Fallback Model: OpenAI gpt-4o-mini
    // We only create this if the key is available, but Langchain will handle fallbacks if we attach it.
    let modelWithFallback = ollamaModel;
    
    if (apiKey) {
      const openAIModel = new ChatOpenAI({
        modelName: "gpt-4o-mini",
        temperature: 0.2,
        openAIApiKey: apiKey,
      });
      // Attach the fallback
      modelWithFallback = ollamaModel.withFallbacks({
        fallbacks: [openAIModel],
      });
    }

    const prompt = PromptTemplate.fromTemplate(`
      You are an expert plant care botanist and diagnostic AI.
      The user has a plant of type or name "{plantName}".
      They report the following symptoms: "{symptoms}"
      
      Diagnose the issue and prescribe a solution. Be concise and write in a warm, human tone.
      CRITICAL: Do NOT use markdown formatting like **bold** or *italics*. Do NOT use asterisks (*) anywhere in your response. Write plain, readable text with simple paragraph breaks or dashes for lists.
      If the issue could be under-watering vs low humidity, explain how to tell the difference.
      Include a confidence level and an immediate action step for the user.
    `);

    const parser = new StringOutputParser();
    const chain = prompt.pipe(modelWithFallback).pipe(parser);

    const response = await chain.invoke({
      plantName,
      symptoms,
    });

    return response;
  } catch (error) {
    return `Error connecting to AI diagnostic service: ${error.message}`;
  }
}

module.exports = { getPlantDiagnosis };



import { GoogleGenAI } from "@google/genai";
import { FinancialData, CalculationResult } from "../types";

export const getAIAdvice = async (data: FinancialData, result: CalculationResult): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    作为一名资深的 FIRE（财务自由）导师，请根据以下数据给用户提供一段尖锐但有启发性的建议：
    - 当前存款: ${data.currentSavings}
    - 年收入: ${data.annualIncome}
    - 年支出: ${data.annualExpenses}
    - 预期收益率: ${data.investmentReturn}%
    - 距离自由还需: ${result.yearsToFire.toFixed(1)} 年
    - 自由门槛金额: ${result.fireTarget.toLocaleString()} 元

    你的语言风格应该是：幽默、洞察人性（贪婪与焦虑）、直击要害。
    请直接输出建议内容，不要包含 Markdown 格式，限制在 150 字以内。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "AI 正在计算你的贪婪指数，请稍后再试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "算不出来了，大概是你太有钱或者太穷了。";
  }
};


import { FinancialData, CalculationResult } from "../types";

export const getLocalAdvice = (data: FinancialData, result: CalculationResult): string => {
  const savingsRate = ((data.annualIncome - data.annualExpenses) / data.annualIncome) * 100;
  const isDeficit = data.annualExpenses > data.annualIncome;
  
  if (isDeficit) {
    return "你这哪是 FIRE，简直是引火烧身。入不敷出的生活就像没有底的木桶，再高的投资回报也填不满你的焦虑。先学会生存，再谈自由。";
  }

  if (result.yearsToFire > 50) {
    return `退休倒计时 ${result.yearsToFire.toFixed(0)} 年？你确定你是在计算退休，而不是在计算人类寿命上限？提高储蓄率吧，哪怕少喝一顿星巴克。`;
  }

  if (data.investmentReturn > 10) {
    return "10% 以上的预期收益率？你一定是巴菲特的远房亲戚，或者你对风险一无所知。贪婪是自由的敌人，小心本金被市场吞噬。";
  }

  if (savingsRate > 60) {
    return "60% 的储蓄率！你真是财务自由届的苦行僧。虽然离目标近了，但也别忘了在‘自由’到来之前，先给自己买个鸡腿犒劳一下。";
  }

  if (result.yearsToFire <= 5) {
    return "自由的钟声已经在耳边回荡了！保持现状，别在终点线前因为一次冲动消费（比如买辆豪车）而翻车。";
  }

  const quotes = [
    "财富自由不是为了不用工作，而是为了拥有拒绝不喜欢工作的权利。",
    "你的每一笔支出，都在为你想要的世界投票，也在为你的自由延期。",
    "欲望的膨胀速度通常比通胀还快，管好你的贪婪，它是唯一的变量。",
    "FIRE 是一场长跑，焦虑是负重，复利是你的唯一战友。"
  ];

  return quotes[Math.floor(Math.random() * quotes.length)];
};

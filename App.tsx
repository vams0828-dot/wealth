
import React, { useState, useEffect, useCallback } from 'react';
import { FinancialData, CalculationResult, ChartDataPoint } from './types';
import { DEFAULT_FINANCIAL_DATA } from './constants';
import CalculatorInput from './components/CalculatorInput';
import AssetChart from './components/AssetChart';
import { getLocalAdvice } from './services/adviceService';

const App: React.FC = () => {
  const [data, setData] = useState<FinancialData>(DEFAULT_FINANCIAL_DATA);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [advice, setAdvice] = useState<string>('分析资产配置中...');

  const calculateFire = useCallback(() => {
    const { 
      currentSavings, 
      annualIncome, 
      annualExpenses, 
      investmentReturn, 
      inflationRate, 
      fireMultiplier,
      manualFireTarget 
    } = data;
    
    const realReturnRate = (investmentReturn - inflationRate) / 100;
    const yearlySavings = annualIncome - annualExpenses;
    const fireTarget = manualFireTarget > 0 ? manualFireTarget : annualExpenses * fireMultiplier;

    let assets = currentSavings;
    let years = 0;
    const yearlyData: ChartDataPoint[] = [{ year: 0, assets: Math.round(assets), target: Math.round(fireTarget) }];

    // 仿真计算最多 100 年
    while (assets < fireTarget && years < 100) {
      const growth = assets * realReturnRate;
      assets = assets + growth + yearlySavings;
      years++;
      yearlyData.push({ 
        year: years, 
        assets: Math.max(0, Math.round(assets)), 
        target: Math.round(fireTarget) 
      });
      
      // 如果资产持续减少且入不敷出，停止计算
      if (assets < 0 || (assets < currentSavings && yearlySavings < 0 && realReturnRate < 0)) break;
    }

    const canReachFire = assets >= fireTarget;
    let preciseYears = years;
    
    if (canReachFire && years > 0) {
        const lastYearAssets = yearlyData[years - 1].assets;
        const currentYearAssets = assets;
        const growth = currentYearAssets - lastYearAssets;
        if (growth > 0) {
           preciseYears = (years - 1) + (fireTarget - lastYearAssets) / growth;
        }
    }

    const calculatedResult: CalculationResult = {
      fireTarget,
      yearsToFire: Math.floor(preciseYears),
      daysToFire: Math.floor((preciseYears % 1) * 365),
      yearlyData,
      canReachFire
    };

    setResult(calculatedResult);
    setAdvice(getLocalAdvice(data, calculatedResult));
  }, [data]);

  useEffect(() => {
    calculateFire();
  }, [calculateFire]);

  return (
    <div className="min-h-screen p-6 md:p-12 lg:p-20 flex flex-col items-center max-w-7xl mx-auto">
      <header className="w-full text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 blur-[120px] rounded-full -z-10"></div>
        <h1 className="text-6xl md:text-8xl font-black text-gradient mb-6 tracking-tighter leading-none">FIRE</h1>
        <p className="text-slate-400 text-lg md:text-xl font-medium tracking-wide max-w-2xl mx-auto">
          量化你的贪婪，对抗你的焦虑。距离财务自由，你还需要多少天？
        </p>
      </header>

      <main className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* 参数设置区 */}
        <div className="lg:col-span-5 space-y-8">
          <section className="glass-panel p-10 rounded-[2rem]">
            <h2 className="text-xl font-bold mb-10 flex items-center text-emerald-400">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3"></span>
              梦想参数
            </h2>
            <CalculatorInput data={data} onChange={setData} />
          </section>

          <section className="glass-panel p-8 rounded-2xl border-l-4 border-l-blue-500 bg-blue-500/5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold flex items-center text-blue-400 uppercase tracking-widest">
                <span className="mr-2">💡</span> 财富导师建议
              </h3>
            </div>
            <p className="text-slate-300 italic text-base leading-relaxed font-medium">
              "{advice}"
            </p>
          </section>
        </div>

        {/* 结果展示区 */}
        <div className="lg:col-span-7 space-y-12">
          {result && (
            <section className="glass-panel p-12 rounded-[3rem] relative overflow-hidden group">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 blur-[100px] group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
              
              <div className="relative z-10 text-center space-y-10">
                <h2 className="text-slate-500 uppercase tracking-[0.4em] text-xs font-black">
                  {result.canReachFire ? "预测退休倒计时" : "财务路径风险提示"}
                </h2>
                
                {result.canReachFire ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-baseline justify-center flex-wrap gap-x-6">
                      <div className="flex items-baseline">
                        <span className="text-8xl md:text-9xl font-black text-white tabular-nums tracking-tighter">
                          {result.yearsToFire}
                        </span>
                        <span className="text-2xl font-bold text-slate-500 ml-3">年</span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="text-8xl md:text-9xl font-black text-white tabular-nums tracking-tighter">
                          {result.daysToFire}
                        </span>
                        <span className="text-2xl font-bold text-slate-500 ml-3">天</span>
                      </div>
                    </div>
                    
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                      <div className="p-8 rounded-3xl bg-white/5 border border-white/5 text-left">
                        <p className="text-slate-500 text-[10px] font-bold uppercase mb-2 tracking-[0.2em]">目标金额</p>
                        <p className="text-3xl font-black text-emerald-400">¥{result.fireTarget.toLocaleString()}</p>
                      </div>
                      <div className="p-8 rounded-3xl bg-white/5 border border-white/5 text-left">
                        <p className="text-slate-500 text-[10px] font-bold uppercase mb-2 tracking-[0.2em]">年储蓄能力</p>
                        <p className="text-3xl font-black text-blue-400">¥{(data.annualIncome - data.annualExpenses).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 px-10 rounded-[2rem] bg-rose-500/5 border border-rose-500/20">
                    <p className="text-4xl font-black text-rose-500 tracking-tight">无法计算自由日期</p>
                    <p className="text-slate-400 mt-6 text-lg max-w-md mx-auto">
                      目前的开支超过了收入，或者通胀侵蚀了所有增长。请削减不必要的欲望。
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {result && result.canReachFire && (
            <AssetChart data={result.yearlyData} />
          )}
        </div>
      </main>

      <footer className="mt-32 py-16 border-t border-white/5 w-full text-center">
        <p className="text-slate-700 text-[10px] font-bold tracking-[0.3em] uppercase">
          Financial Independence, Retire Early · Powered by Compound Interest
        </p>
      </footer>
    </div>
  );
};

export default App;

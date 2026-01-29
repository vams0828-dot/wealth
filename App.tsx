
import React, { useState, useEffect, useCallback } from 'react';
import { FinancialData, CalculationResult, ChartDataPoint } from './types';
import { DEFAULT_FINANCIAL_DATA } from './constants';
import CalculatorInput from './components/CalculatorInput';
import AssetChart from './components/AssetChart';
import { getLocalAdvice } from './services/adviceService';

const App: React.FC = () => {
  const [data, setData] = useState<FinancialData>(DEFAULT_FINANCIAL_DATA);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [advice, setAdvice] = useState<string>('计算中...');

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

    if (yearlySavings <= 0 && currentSavings < fireTarget && realReturnRate <= 0) {
      setResult({
        fireTarget,
        yearsToFire: Infinity,
        daysToFire: Infinity,
        yearlyData: [],
        canReachFire: false
      });
      return;
    }

    let assets = currentSavings;
    let years = 0;
    const yearlyData: ChartDataPoint[] = [{ year: 0, assets: Math.round(assets), target: Math.round(fireTarget) }];

    while (assets < fireTarget && years < 100) {
      const growth = assets * realReturnRate;
      assets = assets + growth + yearlySavings;
      years++;
      yearlyData.push({ 
        year: years, 
        assets: Math.round(assets), 
        target: Math.round(fireTarget) 
      });
      if (assets < currentSavings && yearlySavings <= 0 && realReturnRate < 0) break;
    }

    let preciseYears = years;
    if (years > 0 && years < 100 && assets >= fireTarget) {
        const prevAssets = yearlyData[years - 1].assets;
        const currentYearGrowth = assets - prevAssets;
        const neededThisYear = fireTarget - prevAssets;
        if (currentYearGrowth > 0) {
           preciseYears = (years - 1) + (neededThisYear / currentYearGrowth);
        }
    }

    const newResult = {
      fireTarget,
      yearsToFire: Math.floor(preciseYears),
      daysToFire: Math.floor((preciseYears - Math.floor(preciseYears)) * 365),
      yearlyData,
      canReachFire: assets >= fireTarget
    };

    setResult(newResult);
    setAdvice(getLocalAdvice(data, newResult));
  }, [data]);

  useEffect(() => {
    calculateFire();
  }, [calculateFire]);

  return (
    <div className="min-h-screen p-4 md:p-12 flex flex-col items-center max-w-6xl mx-auto selection:bg-emerald-500/30">
      {/* Header */}
      <header className="w-full text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black text-gradient mb-4 tracking-tighter">FIRE</h1>
        <p className="text-slate-400 text-lg font-medium tracking-wide">财富自由倒计时：量化欲望，对抗焦虑</p>
      </header>

      <main className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Inputs */}
        <div className="lg:col-span-5 space-y-8">
          <section className="glass-panel p-8 rounded-3xl">
            <h2 className="text-xl font-bold mb-8 flex items-center text-emerald-400">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3"></span>
              梦想参数
            </h2>
            <CalculatorInput data={data} onChange={setData} />
          </section>

          <section className="glass-panel p-8 rounded-3xl border-l-4 border-l-blue-500 bg-blue-500/5">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center text-blue-400">
                <span className="mr-2">💡</span> 财富导师点评
                </h2>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">本地引擎</span>
            </div>
            <p className="text-slate-300 italic text-base leading-relaxed font-medium">
              "{advice}"
            </p>
          </section>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-7 space-y-10">
          {result && (
            <section className="glass-panel p-10 rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[100px] group-hover:bg-emerald-500/20 transition-all duration-700"></div>
              
              <div className="relative z-10 text-center space-y-8">
                <h2 className="text-slate-500 uppercase tracking-[0.3em] text-xs font-black">
                  {result.canReachFire && result.yearsToFire === 0 && result.daysToFire === 0 
                    ? "🎉 你已自由" 
                    : "距离自由还需等待"}
                </h2>
                
                {result.canReachFire ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-baseline justify-center flex-wrap gap-x-4">
                      <div className="flex items-baseline">
                        <span className="text-7xl md:text-9xl font-black text-white tabular-nums tracking-tighter">
                          {result.yearsToFire}
                        </span>
                        <span className="text-2xl font-bold text-slate-500 ml-2">年</span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="text-7xl md:text-9xl font-black text-white tabular-nums tracking-tighter">
                          {result.daysToFire}
                        </span>
                        <span className="text-2xl font-bold text-slate-500 ml-2">天</span>
                      </div>
                    </div>
                    
                    <div className="mt-12 grid grid-cols-2 gap-6 w-full">
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-slate-500 text-xs font-bold uppercase mb-2 tracking-widest">目标金额</p>
                        <p className="text-2xl font-black text-emerald-400">¥{result.fireTarget.toLocaleString()}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-slate-500 text-xs font-bold uppercase mb-2 tracking-widest">当前年储蓄</p>
                        <p className="text-2xl font-black text-blue-400">¥{(data.annualIncome - data.annualExpenses).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 px-8 rounded-3xl bg-rose-500/5 border border-rose-500/20">
                    <p className="text-3xl font-black text-rose-500">财务赤字警告</p>
                    <p className="text-slate-400 mt-4 text-base font-medium">当前的收支结构无法实现财务自由，请调整你的焦虑或支出。</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {result && result.yearlyData.length > 0 && (
            <AssetChart data={result.yearlyData} />
          )}
        </div>
      </main>

      <footer className="mt-24 py-12 border-t border-white/5 w-full text-center">
        <p className="text-slate-600 text-xs font-bold tracking-[0.2em] uppercase">
          © 2024 FIRE CALCULATOR · 自由源于自律
        </p>
      </footer>
    </div>
  );
};

export default App;

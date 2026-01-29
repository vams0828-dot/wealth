
import React from 'react';
import { FinancialData } from '../types';

interface Props {
  data: FinancialData;
  onChange: (newData: FinancialData) => void;
}

const CalculatorInput: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (field: keyof FinancialData, value: number) => {
    onChange({ ...data, [field]: value });
  };

  const withdrawalRate = (100 / data.fireMultiplier).toFixed(1);
  const calculatedTarget = data.annualExpenses * data.fireMultiplier;

  return (
    <div className="space-y-6">
      {/* 基础财务状况 */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">基础财务</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-400">当前存款 (¥)</label>
            <input
              type="number"
              value={data.currentSavings}
              onChange={(e) => handleChange('currentSavings', Number(e.target.value))}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none transition"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400">年收入 (¥)</label>
            <input
              type="number"
              value={data.annualIncome}
              onChange={(e) => handleChange('annualIncome', Number(e.target.value))}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none transition"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400">年支出 (¥)</label>
            <input
              type="number"
              value={data.annualExpenses}
              onChange={(e) => handleChange('annualExpenses', Number(e.target.value))}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none transition"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400 flex justify-between">
              <span>自由门槛 (¥)</span>
              {data.manualFireTarget > 0 && (
                <button 
                  onClick={() => handleChange('manualFireTarget', 0)}
                  className="text-[10px] text-red-400 hover:text-red-300 underline"
                >
                  恢复自动
                </button>
              )}
            </label>
            <input
              type="number"
              placeholder={`自动: ${calculatedTarget.toLocaleString()}`}
              value={data.manualFireTarget || ''}
              onChange={(e) => handleChange('manualFireTarget', Number(e.target.value))}
              className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2 focus:ring-2 outline-none transition ${
                data.manualFireTarget > 0 ? 'border-green-500 ring-green-500/20' : 'border-slate-700 focus:ring-green-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 收益与通胀调节 */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">参数设定</h3>
        
        {/* FIRE Multiplier */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex justify-between">
            <span>自由乘数 (支出倍数)</span>
            <span className="text-cyan-400 font-bold">{data.fireMultiplier}x</span>
          </label>
          <input
            type="range"
            min="15"
            max="60"
            step="1"
            disabled={data.manualFireTarget > 0}
            value={data.fireMultiplier}
            onChange={(e) => handleChange('fireMultiplier', Number(e.target.value))}
            className={`w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 ${
              data.manualFireTarget > 0 ? 'opacity-30' : ''
            }`}
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>保守 (60x)</span>
            <span>提取率 {withdrawalRate}%</span>
            <span>激进 (15x)</span>
          </div>
        </div>

        {/* Investment Return */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="text-sm font-medium text-slate-300">预期年化收益率 (%)</label>
            <div className="flex items-center space-x-2">
              <input 
                type="number"
                step="0.1"
                value={data.investmentReturn}
                onChange={(e) => handleChange('investmentReturn', Number(e.target.value))}
                className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-right text-green-400 font-bold text-sm outline-none"
              />
              <span className="text-green-400 font-bold">%</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="0.1"
            value={data.investmentReturn}
            onChange={(e) => handleChange('investmentReturn', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>

        {/* Inflation Rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="text-sm font-medium text-slate-300">预计长期通胀率 (%)</label>
            <div className="flex items-center space-x-2">
              <input 
                type="number"
                step="0.1"
                value={data.inflationRate}
                onChange={(e) => handleChange('inflationRate', Number(e.target.value))}
                className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-right text-red-400 font-bold text-sm outline-none"
              />
              <span className="text-red-400 font-bold">%</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={data.inflationRate}
            onChange={(e) => handleChange('inflationRate', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
        </div>
      </div>
    </div>
  );
};

export default CalculatorInput;

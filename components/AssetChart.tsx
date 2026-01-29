
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../types';

interface Props {
  data: ChartDataPoint[];
}

const AssetChart: React.FC<Props> = ({ data }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (!isUnlocked) {
    return (
      <div className="relative h-96 w-full glass-panel rounded-[2rem] flex flex-col items-center justify-center space-y-6 overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl z-10 flex flex-col items-center justify-center p-10 text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-slate-300 font-bold text-lg mb-8">想窥见未来的资产增长曲线？</p>
          <button 
            onClick={() => setIsUnlocked(true)}
            className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full font-black text-white hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20 uppercase tracking-widest text-sm"
          >
            解锁资产走势图
          </button>
        </div>
        <div className="opacity-5 grayscale blur-xl w-full h-full p-4 pointer-events-none">
           <div className="w-full h-full bg-slate-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[450px] w-full glass-panel rounded-[2rem] p-10">
      <h3 className="text-sm font-bold text-slate-500 mb-8 uppercase tracking-[0.2em]">资产增长 vs 自由门槛</h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="year" 
            stroke="#475569"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#64748b' }}
            dy={10}
          />
          <YAxis 
            stroke="#475569" 
            fontSize={10} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `¥${(value / 10000).toFixed(0)}w`}
            tick={{ fill: '#64748b' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '16px',
              padding: '12px'
            }}
            itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
            formatter={(value: number) => [`¥${value.toLocaleString()}`, '']}
            labelFormatter={(label) => `第 ${label} 年`}
          />
          <Area 
            type="monotone" 
            dataKey="assets" 
            stroke="#10b981" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorAssets)" 
            name="我的资产"
          />
          <Area 
            type="monotone" 
            dataKey="target" 
            stroke="#ef4444" 
            strokeWidth={2}
            strokeDasharray="8 8" 
            fill="none" 
            name="FIRE 目标线"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetChart;

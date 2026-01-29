
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
      <div className="relative h-64 w-full glass-panel rounded-xl flex flex-col items-center justify-center space-y-4 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-slate-300 mb-4 text-sm">想看资产增长曲线？</p>
          <button 
            onClick={() => setIsUnlocked(true)}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-bold text-white hover:scale-105 transition shadow-lg shadow-green-500/20"
          >
            点击“解锁”查看图表 (模拟广告)
          </button>
        </div>
        <div className="opacity-10 grayscale blur-sm w-full h-full p-4">
           {/* Placeholder for visual effect */}
           <div className="w-full h-full bg-slate-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80 w-full glass-panel rounded-xl p-4">
      <h3 className="text-sm font-medium text-slate-400 mb-4">资产增长与 FIRE 目标曲线</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="year" 
            label={{ value: '年份', position: 'insideBottomRight', offset: -5, fill: '#94a3b8' }} 
            stroke="#94a3b8"
            fontSize={12}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={10} 
            tickFormatter={(value) => `${(value / 10000).toFixed(0)}w`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
            formatter={(value: number) => [value.toLocaleString(), '金额']}
          />
          <Area 
            type="monotone" 
            dataKey="assets" 
            stroke="#22c55e" 
            fillOpacity={1} 
            fill="url(#colorAssets)" 
            name="我的资产"
          />
          <Area 
            type="monotone" 
            dataKey="target" 
            stroke="#ef4444" 
            strokeDasharray="5 5" 
            fill="none" 
            name="自由门槛"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetChart;

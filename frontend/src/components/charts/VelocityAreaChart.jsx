import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { api } from '../../api/client';

export default function VelocityAreaChart({ memberId = 'shuvo', memberName = 'Shuvo' }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .getWeeklyVelocity(memberId)
      .then((res) => {
        if (mounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching velocity data:', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [memberId]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const p = payload.find((item) => item.dataKey === 'points')?.value || 0;
      const h = payload.find((item) => item.dataKey === 'hours')?.value || 0;
      return (
        <div className="bg-surface-container-highest border border-surface-container-high p-3 rounded-xl shadow-xl">
          <div className="text-xs font-bold text-on-surface mb-1">{label} Performance</div>
          <div className="flex items-center gap-2 text-xs text-primary font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span>Velocity Score: {p} pts</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-secondary font-semibold mt-0.5">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>Work Time: {h} hrs</span>
          </div>
          <div className="text-[10px] text-outline mt-1 border-t border-surface-container pt-1">
            Target Benchmark: 45 pts
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-outline">
        <span className="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="w-full h-64 select-none">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c0c1ff" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#c0c1ff" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4cd7f6" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#4cd7f6" stopOpacity={0.2} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="4 4" stroke="#262a35" vertical={false} />
          
          <XAxis
            dataKey="week"
            tickLine={false}
            stroke="#908fa0"
            fontSize={11}
            fontFamily="Inter"
          />
          <YAxis
            domain={[0, 65]}
            tickLine={false}
            stroke="#908fa0"
            fontSize={10}
            fontFamily="Inter"
          />

          <Tooltip content={<CustomTooltip />} />

          <ReferenceLine
            y={45}
            stroke="#908fa0"
            strokeDasharray="6 4"
            opacity={0.5}
            label={{ value: 'Target 45', fill: '#908fa0', fontSize: 10, position: 'right' }}
          />

          {/* Bar for hours context */}
          <Bar
            dataKey="hours"
            fill="url(#barGradient)"
            radius={[3, 3, 0, 0]}
            barSize={14}
          />

          {/* Area for points score */}
          <Area
            type="monotone"
            dataKey="points"
            stroke="#c0c1ff"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#areaGradient)"
            dot={{ r: 4, fill: '#1c1f2a', stroke: '#c0c1ff', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#c0c1ff', stroke: '#1000a9', strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

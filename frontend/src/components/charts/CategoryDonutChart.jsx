import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { api } from '../../api/client';

export default function CategoryDonutChart({ memberId = 'shuvo' }) {
  const [data, setData] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    let mounted = true;
    api
      .getCategoryDistribution(memberId)
      .then((res) => {
        if (mounted) {
          setData(res || []);
          const total = (res || []).reduce((sum, item) => sum + item.points, 0);
          setTotalPoints(total);
        }
      })
      .catch((err) => console.error('Error fetching category distribution:', err));

    return () => {
      mounted = false;
    };
  }, [memberId]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-surface-container-highest border border-surface-container-high px-3 py-2 rounded-lg shadow-lg">
          <div className="text-xs font-bold text-on-surface">{item.category}</div>
          <div className="text-xs text-primary font-mono-metric font-semibold mt-0.5">
            {item.points} pts ({item.percentage}%)
          </div>
          <div className="text-[10px] text-outline">{item.count} contributions</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col justify-between h-full">
      {/* Donut Graphic Mini Hero */}
      <div className="relative w-40 h-40 mx-auto my-2 select-none">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              dataKey="points"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={46}
              outerRadius={65}
              stroke="#1c1f2a"
              strokeWidth={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#c0c1ff'} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold font-mono-metric">
            {totalPoints} Pts
          </span>
          <span className="font-label-sm text-label-sm text-outline">Logged</span>
        </div>
      </div>

      {/* Breakdown List with Percentage Bars */}
      <div className="space-y-space-sm mt-3">
        {data.slice(0, 4).map((item) => (
          <div key={item.category}>
            <div className="flex items-center justify-between text-body-sm font-body-sm mb-1">
              <span className="flex items-center gap-1.5 text-on-surface text-xs font-medium">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span>{item.category}</span>
              </span>
              <span className="font-mono-metric text-mono-metric text-on-surface text-xs font-bold">
                {item.percentage}%{' '}
                <span className="text-outline font-normal">({item.points} pts)</span>
              </span>
            </div>
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

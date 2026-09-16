import React from 'react';

// 1. Interactive SVG Trend Line Chart
export const TrendLineChart: React.FC<{ data: { date: string; count: number }[] }> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const width = 600;
  const height = 180;
  const padding = 30;

  const maxVal = Math.max(...data.map(d => d.count), 10);
  const minVal = 0;

  const getX = (idx: number) => padding + (idx / (data.length - 1)) * (width - 2 * padding);
  const getY = (val: number) => height - padding - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);

  const points = data.map((d, i) => `${getX(i)},${getY(d.count)}`).join(' ');
  const areaPath = `M ${getX(0)},${height - padding} L ${points} L ${getX(data.length - 1)},${height - padding} Z`;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.33, 0.66, 1].map((ratio, i) => {
          const y = height - padding - ratio * (height - 2 * padding);
          return (
            <line
              key={i}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="var(--border-color)"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#trendGradient)" />

        {/* Line stroke */}
        <polyline
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Dots & Labels */}
        {data.map((d, i) => {
          const cx = getX(i);
          const cy = getY(d.count);
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r="4" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
              <text
                x={cx}
                y={height - 10}
                textAnchor="middle"
                fontSize="11"
                fill="var(--text-muted)"
                fontWeight="500"
              >
                {d.date}
              </text>
              <text
                x={cx}
                y={cy - 10}
                textAnchor="middle"
                fontSize="11"
                fill="var(--text-primary)"
                fontWeight="700"
              >
                {d.count}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// 2. Horizontal Rank Bar Chart
export const HorizontalBarChart: React.FC<{
  data: { label: string; count: number; subLabel?: string }[];
  accentColor?: string;
}> = ({ data, accentColor = '#6366f1' }) => {
  const max = Math.max(...data.map(d => d.count), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {data.map((item, idx) => {
        const pct = Math.round((item.count / max) * 100);
        return (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
              <span style={{ color: 'var(--text-primary)' }}>{item.label}</span>
              <span style={{ color: 'var(--text-muted)' }}>{item.count.toLocaleString()} leads</span>
            </div>
            <div
              style={{
                width: '100%',
                height: '7px',
                background: 'var(--bg-tertiary)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: accentColor,
                  borderRadius: '4px',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 3. SVG Donut Chart
export const DonutChart: React.FC<{
  data: { label: string; count: number; percentage: number; color: string }[];
}> = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  let accumulatedAngle = 0;

  const radius = 60;
  const strokeWidth = 18;
  const center = 80;
  const circumference = 2 * Math.PI * radius;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--bg-tertiary)" strokeWidth={strokeWidth} />
        {data.map((item, i) => {
          const strokeDash = (item.percentage / 100) * circumference;
          const strokeDashoffset = -accumulatedAngle;
          accumulatedAngle += strokeDash;

          return (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${strokeDash} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'all 0.5s ease' }}
            />
          );
        })}
        <text x={center} y={center - 4} textAnchor="middle" fontSize="18" fontWeight="800" fill="var(--text-primary)">
          {total.toLocaleString()}
        </text>
        <text x={center} y={center + 14} textAnchor="middle" fontSize="10" fill="var(--text-muted)" fontWeight="600">
          TOTAL
        </text>
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {data.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.label}</span>
            </div>
            <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
              {item.count} ({item.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

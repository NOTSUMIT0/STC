import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useProblemStats } from '../../hooks/useProblems';

const ProblemProgress = () => {
  const { data: stats, isLoading } = useProblemStats();

  // If no stats are loaded yet, use 0 values
  const rawData = stats || [
    { name: 'Completed', value: 0, color: '#4ade80' },
    { name: 'In Progress', value: 0, color: '#fbbf24' },
    { name: 'Pending', value: 0, color: '#f87171' },
  ];

  const total = rawData.reduce((acc: number, curr: any) => acc + curr.value, 0);
  const completed = rawData.find((d: any) => d.name === 'Completed')?.value || 0;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Use gray placeholder if total is 0 to show *something*
  const chartData = total > 0 ? rawData : [{ name: 'Empty', value: 1, color: '#e5e7eb' }];

  if (isLoading) return <div className="skeleton h-full w-full rounded-2xl min-h-[300px]"></div>;

  return (
    <div className="card bg-base-100 shadow-xl h-full border border-base-content/5 overflow-hidden">
      <div className="card-body p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-lg text-base-content">My Progress</h3>
        </div>

        <div className="flex flex-row items-center justify-between flex-1 gap-2">
          {/* Pie Chart Section - Left Side */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={total > 0 ? 5 : 0}
                  dataKey="value"
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                  cornerRadius={total > 0 ? 4 : 0}
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={total > 0 ? entry.color : '#e5e7eb60'} />
                  ))}
                </Pie>
                {total > 0 && (
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--fallback-b1,oklch(var(--b1)))', borderColor: 'var(--fallback-bc,oklch(var(--bc)/0.1))', borderRadius: '0.5rem', color: 'var(--fallback-bc,oklch(var(--bc)))', fontSize: '12px', padding: '5px' }}
                    itemStyle={{ color: 'var(--fallback-bc,oklch(var(--bc)))' }}
                    cursor={false}
                  />
                )}
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text Overlays - Scaled Down */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`text-xl font-black ${total > 0 ? 'text-primary' : 'text-base-content/20'}`}>
                {percentage}%
              </span>
            </div>
          </div>

          {/* Stats - Right Side (compacted) */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex flex-col gap-1.5">
              {rawData.map((entry: any) => (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }}></div>
                    <span className="text-base-content/70 truncate">{entry.name}</span>
                  </div>
                  <span className="font-bold">{entry.value}</span>
                </div>
              ))}
            </div>

            <div className="divider my-0 opacity-50"></div>

            <div className="flex justify-between items-center bg-base-200/50 rounded p-2 border border-base-content/5">
              <span className="text-[10px] font-bold uppercase text-base-content/50">Total</span>
              <span className="text-lg font-black text-primary">{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemProgress;

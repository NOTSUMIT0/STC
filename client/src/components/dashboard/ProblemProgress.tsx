import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useProblemStats } from '../../hooks/useProblems';

const ProblemProgress = () => {
  const { data: stats, isLoading } = useProblemStats();

  // Default data if loading or empty
  const defaultData = [
    { name: 'Completed', value: 0, color: '#4ade80' },
    { name: 'In Progress', value: 0, color: '#fbbf24' },
    { name: 'Pending', value: 0, color: '#f87171' },
  ];

  const data = stats || defaultData;
  const total = data.reduce((acc: number, curr: any) => acc + curr.value, 0);
  const completed = data.find((d: any) => d.name === 'Completed')?.value || 0;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (isLoading) return <div className="skeleton h-64 w-full rounded-2xl"></div>;

  return (
    <div className="card bg-base-200 border-l-4 border-primary shadow-lg hover:shadow-primary/20 transition-all h-full">
      <div className="card-body p-4 flex flex-col items-center">
        <div className="w-full flex justify-between items-start mb-2">
          <h3 className="uppercase text-xs font-bold text-gray-500">My Progress</h3>
        </div>

        <div className="w-full h-48 relative flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <span className="text-2xl font-black text-white">{percentage}%</span>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Done</p>
          </div>
        </div>

        {/* Custom Legend/Stats Area */}
        <div className="w-full flex flex-col gap-3 mt-2">

          {/* Legend Grid */}
          <div className="grid grid-cols-3 gap-1 text-center">
            {data.map((entry: any, index: number) => (
              <div key={`legend-${index}`} className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: entry.color }}></div>
                <span className="text-[10px] text-gray-400">{entry.name}</span>
                <span className="text-xs font-bold text-base-content">{entry.value}</span>
              </div>
            ))}
          </div>

          <div className="divider my-0"></div>

          {/* Overall Stats */}
          <div className="flex justify-between items-center px-2">
            <p className="text-xs font-medium text-gray-400">Total Problems</p>
            <span className="text-sm font-bold text-white">{total}</span>
          </div>
          <div className="flex justify-between items-center px-2 mt-[-8px]">
            <p className="text-xs font-medium text-gray-400">Problems Solved</p>
            <span className="text-sm font-bold text-success">{completed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemProgress;

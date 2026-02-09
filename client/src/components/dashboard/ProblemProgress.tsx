import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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
      <div className="card-body p-5 flex flex-col items-center justify-center relative">
        <h3 className="uppercase text-xs font-bold text-gray-500 absolute top-5 left-5">My Progress</h3>

        <div className="w-full h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
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
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mb-4">
            <span className="text-3xl font-black text-white">{percentage}%</span>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Completed</p>
          </div>
        </div>

        <div className="text-center mt-[-20px]">
          <p className="text-sm font-medium text-gray-400">Total Problems: <span className="text-white font-bold">{total}</span></p>
        </div>
      </div>
    </div>
  );
};

export default ProblemProgress;

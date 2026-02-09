import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';
import api from '../../config/api';

const AnalyticsWidget = () => {
  const [data, setData] = useState<any>({ monthlyData: [], weeklyData: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/api/todos/analytics');
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl h-64 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Monthly Activity Bar Chart */}
      <div className="card bg-base-100 shadow-xl border border-base-content/5">
        <div className="card-body p-4">
          <h3 className="card-title text-sm font-bold opacity-70 mb-4">Monthly Task Completion</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyData}>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={2} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--fallback-b1,oklch(var(--b1)))', borderColor: 'var(--fallback-bc,oklch(var(--bc)/0.1))', borderRadius: '0.5rem' }}
                  itemStyle={{ color: 'var(--fallback-bc,oklch(var(--bc)))' }}
                />
                <Bar dataKey="completed" fill="var(--fallback-p,oklch(var(--p)))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weekly Activity Area Chart */}
      <div className="card bg-base-100 shadow-xl border border-base-content/5">
        <div className="card-body p-4">
          <h3 className="card-title text-sm font-bold opacity-70 mb-4">Weekly Analysis</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.weeklyData}>
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--fallback-s,oklch(var(--s)))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--fallback-s,oklch(var(--s)))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--fallback-p,oklch(var(--p)))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--fallback-p,oklch(var(--p)))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--fallback-b1,oklch(var(--b1)))', borderColor: 'var(--fallback-bc,oklch(var(--bc)/0.1))', borderRadius: '0.5rem' }}
                  itemStyle={{ color: 'var(--fallback-bc,oklch(var(--bc)))' }}
                />
                <Area type="monotone" dataKey="created" stroke="var(--fallback-s,oklch(var(--s)))" fillOpacity={1} fill="url(#colorCreated)" />
                <Area type="monotone" dataKey="completed" stroke="var(--fallback-p,oklch(var(--p)))" fillOpacity={1} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsWidget;

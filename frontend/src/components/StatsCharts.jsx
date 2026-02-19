import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function EloHistoryChart({ data }) {
  const chartData = data.map(entry => ({
    date: new Date(entry.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    elo: entry.new_elo,
  })).reverse().slice(-20); // Dernier 20 entrées

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="date" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a1a2e',
            border: '2px solid #FF6B00',
            borderRadius: '0.5rem',
            color: '#fff',
          }}
        />
        <Line
          type="monotone"
          dataKey="elo"
          stroke="#FF6B00"
          strokeWidth={3}
          dot={{ fill: '#FF6B00', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function WinRateChart({ wins, losses }) {
  const data = [
    { name: 'Victoires', value: wins, color: '#00ff88' },
    { name: 'Défaites', value: losses, color: '#ff006e' },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a1a2e',
            border: '2px solid #FF6B00',
            borderRadius: '0.5rem',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function PerformanceChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="mode" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a1a2e',
            border: '2px solid #FF6B00',
            borderRadius: '0.5rem',
            color: '#fff',
          }}
        />
        <Legend />
        <Bar dataKey="wins" fill="#00ff88" name="Victoires" />
        <Bar dataKey="losses" fill="#ff006e" name="Défaites" />
      </BarChart>
    </ResponsiveContainer>
  );
}

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const IncomeOverviewChart = ({ income = [] }) => {
  const data = useMemo(() => {
    // Aggregate income by month (current year)
    const byMonth = new Map();
    income.forEach(item => {
      const date = new Date(item.date);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { month: 'short' });
      const prev = byMonth.get(key) || { month: label, total: 0 };
      prev.total += Number(item.amount) || 0;
      byMonth.set(key, prev);
    });
    // Ensure chronological order and show last 6 months
    const sorted = Array.from(byMonth.entries()).sort((a, b) => a[0] > b[0] ? 1 : -1).map(([, v]) => v);
    return sorted.slice(-6);
  }, [income]);

  const formatCurrency = (value) => `₹${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

  if (!income || income.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Income Overview</h3>
        <p className="text-gray-500 text-center py-8">No income data to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Income Overview (Last 6 Months)</h3>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="total" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeOverviewChart;

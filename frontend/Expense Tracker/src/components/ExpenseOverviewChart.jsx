import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LuTrendingDown } from 'react-icons/lu';

const ExpenseOverviewChart = ({ expenses }) => {
  // Helper function to format numbers with commas
  const addThousandsSeparator = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Process data for monthly bar chart
  const monthlyData = useMemo(() => {
    const monthlyExpenses = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!monthlyExpenses[monthKey]) {
        monthlyExpenses[monthKey] = {
          month: monthName,
          total: 0,
          count: 0,
          descriptions: []
        };
      }
      
      monthlyExpenses[monthKey].total += expense.amount;
      monthlyExpenses[monthKey].count += 1;
      if (expense.description) {
        monthlyExpenses[monthKey].descriptions.push(expense.description);
      }
    });

    return Object.values(monthlyExpenses)
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .slice(-6); // Show last 6 months
  }, [expenses]);

  // Process data for category pie chart
  const categoryData = useMemo(() => {
    const categoryExpenses = {};
    
    expenses.forEach(expense => {
      const category = expense.category || 'Other';
      if (!categoryExpenses[category]) {
        categoryExpenses[category] = 0;
      }
      categoryExpenses[category] += expense.amount;
    });

    return Object.entries(categoryExpenses)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Show top 8 categories
  }, [expenses]);

  // Colors for charts
  const barColors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5A2B'];
  const pieColors = ['#EF4444', '#F59E0B', '#10B981', '#06B6D4', '#8B5CF6', '#EC4899', '#84CC16', '#F97316'];

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  // Custom tooltip for bar chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const sampleDescriptions = data.descriptions?.slice(0, 3) || [];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-red-600 font-semibold">
            Total: ₹{addThousandsSeparator(payload[0].value)}
          </p>
          <p className="text-gray-600 text-sm">
            {data.count} expense{data.count !== 1 ? 's' : ''}
          </p>
          {sampleDescriptions.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 font-medium">Sample expenses:</p>
              <div className="space-y-1">
                {sampleDescriptions.map((desc, index) => (
                  <p key={index} className="text-xs text-gray-600">• {desc}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalExpenses) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{data.name}</p>
          <p className="text-red-600 font-semibold">
            ₹{addThousandsSeparator(data.value)}
          </p>
          <p className="text-gray-600 text-sm">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense Overview</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LuTrendingDown className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium mb-2">No expenses yet</p>
          <p className="text-gray-400 text-sm">Add some expenses to see charts and analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense Overview</h3>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-600 font-medium">Total Expenses</p>
          <p className="text-xl font-bold text-red-700">₹{addThousandsSeparator(totalExpenses)}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-sm text-orange-600 font-medium">Average per Expense</p>
          <p className="text-xl font-bold text-orange-700">₹{addThousandsSeparator(Math.round(averageExpense))}</p>
        </div>
      </div>

      {/* Monthly Bar Chart */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Monthly Expenses</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="total" 
                fill="#EF4444" 
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Pie Chart */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-3">Expense by Category</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown List */}
      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Category Breakdown</h4>
        <div className="space-y-2">
          {categoryData.map((category, index) => {
            const percentage = ((category.value / totalExpenses) * 100).toFixed(1);
            return (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: pieColors[index % pieColors.length] }}
                  ></div>
                  <span className="text-sm text-gray-700">{category.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">₹{addThousandsSeparator(category.value)}</p>
                  <p className="text-xs text-gray-500">{percentage}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExpenseOverviewChart;

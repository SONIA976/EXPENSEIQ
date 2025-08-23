import React, { useState } from 'react';
import axiosInstance from '../Utils/axiosInstance';
import { API_PATHS } from '../Utils/apiPaths';
import { LuDollarSign, LuBriefcase, LuGift, LuTrendingUp, LuBuilding, LuCar, LuGraduationCap, LuHeart, LuZap, LuStar } from 'react-icons/lu';

const IncomeForm = ({ onAdded }) => {
  const [source, setSource] = useState('Salary');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [icon, setIcon] = useState('briefcase');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Predefined income sources with icons
  const incomeSources = [
    { name: 'Salary', icon: 'briefcase', color: 'text-blue-600' },
    { name: 'Freelance', icon: 'trending-up', color: 'text-green-600' },
    { name: 'Bonus', icon: 'gift', color: 'text-purple-600' },
    { name: 'Investment', icon: 'trending-up', color: 'text-emerald-600' },
    { name: 'Rent', icon: 'building', color: 'text-orange-600' },
    { name: 'Business', icon: 'zap', color: 'text-yellow-600' },
    { name: 'Education', icon: 'graduation-cap', color: 'text-indigo-600' },
    { name: 'Health', icon: 'heart', color: 'text-red-600' },
    { name: 'Transport', icon: 'car', color: 'text-gray-600' },
    { name: 'Other', icon: 'dollar-sign', color: 'text-gray-600' },
  ];

  const getIconComponent = (iconName) => {
    const iconMap = {
      'dollar-sign': <LuDollarSign className="w-5 h-5" />,
      'briefcase': <LuBriefcase className="w-5 h-5" />,
      'gift': <LuGift className="w-5 h-5" />,
      'trending-up': <LuTrendingUp className="w-5 h-5" />,
      'building': <LuBuilding className="w-5 h-5" />,
      'car': <LuCar className="w-5 h-5" />,
      'graduation-cap': <LuGraduationCap className="w-5 h-5" />,
      'heart': <LuHeart className="w-5 h-5" />,
      'zap': <LuZap className="w-5 h-5" />,
      'star': <LuStar className="w-5 h-5" />,
    };
    return iconMap[iconName] || <LuDollarSign className="w-5 h-5" />;
  };

  const handleSourceChange = (newSource) => {
    setSource(newSource);
    // Auto-select icon based on source
    const sourceConfig = incomeSources.find(s => s.name.toLowerCase() === newSource.toLowerCase());
    if (sourceConfig) {
      setIcon(sourceConfig.icon);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError('');

    if (!source || !amount || !date) {
      setError('Please fill all fields.');
      return;
    }

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount: parsedAmount,
        date,
        icon,
      });
      setSource('Salary');
      setAmount('');
      setDate(new Date().toISOString().slice(0, 10));
      setIcon('briefcase');
      onAdded && onAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add income.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Income</h3>
      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Source</label>
          <select
            value={source}
            onChange={(e) => handleSourceChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {incomeSources.map((sourceOption) => (
              <option key={sourceOption.name} value={sourceOption.name}>
                {sourceOption.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Icon</label>
          <div className="grid grid-cols-5 gap-2">
            {incomeSources.map((sourceOption) => (
              <button
                key={sourceOption.icon}
                type="button"
                onClick={() => {
                  setIcon(sourceOption.icon);
                  setSource(sourceOption.name);
                }}
                className={`p-2 rounded-lg border-2 transition-colors ${
                  icon === sourceOption.icon
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                title={sourceOption.name}
              >
                <div className={sourceOption.color}>
                  {getIconComponent(sourceOption.icon)}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 50000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-60"
        >
          {loading ? 'Adding...' : 'Add Income'}
        </button>
      </form>
    </div>
  );
};

export default IncomeForm;

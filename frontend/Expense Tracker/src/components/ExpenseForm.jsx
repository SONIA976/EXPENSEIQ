import React, { useState } from 'react';
import axiosInstance from '../Utils/axiosInstance';
import { API_PATHS } from '../Utils/apiPaths';
import { LuDollarSign, LuBriefcase, LuGift, LuTrendingDown, LuBuilding, LuCar, LuGraduationCap, LuHeart, LuZap, LuStar, LuPackage, LuShoppingCart } from 'react-icons/lu';

const ExpenseForm = ({ onAdded }) => {
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [icon, setIcon] = useState('package');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Predefined expense categories with icons
  const expenseCategories = [
    { name: 'Food', icon: 'package', color: 'text-orange-600' },
    { name: 'Transport', icon: 'car', color: 'text-blue-600' },
    { name: 'Shopping', icon: 'shopping-cart', color: 'text-pink-600' },
    { name: 'Entertainment', icon: 'gift', color: 'text-purple-600' },
    { name: 'Health', icon: 'heart', color: 'text-red-600' },
    { name: 'Education', icon: 'graduation-cap', color: 'text-indigo-600' },
    { name: 'Utilities', icon: 'zap', color: 'text-yellow-600' },
    { name: 'Rent', icon: 'building', color: 'text-gray-600' },
    { name: 'Business', icon: 'briefcase', color: 'text-emerald-600' },
    { name: 'Other', icon: 'dollar-sign', color: 'text-gray-600' },
  ];

  const getIconComponent = (iconName) => {
    const iconMap = {
      'dollar-sign': <LuDollarSign className="w-5 h-5" />,
      'briefcase': <LuBriefcase className="w-5 h-5" />,
      'gift': <LuGift className="w-5 h-5" />,
      'trending-down': <LuTrendingDown className="w-5 h-5" />,
      'building': <LuBuilding className="w-5 h-5" />,
      'car': <LuCar className="w-5 h-5" />,
      'graduation-cap': <LuGraduationCap className="w-5 h-5" />,
      'heart': <LuHeart className="w-5 h-5" />,
      'zap': <LuZap className="w-5 h-5" />,
      'star': <LuStar className="w-5 h-5" />,
      'package': <LuPackage className="w-5 h-5" />,
      'shopping-cart': <LuShoppingCart className="w-5 h-5" />,
    };
    return iconMap[iconName] || <LuDollarSign className="w-5 h-5" />;
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    // Auto-select icon based on category
    const categoryConfig = expenseCategories.find(c => c.name.toLowerCase() === newCategory.toLowerCase());
    if (categoryConfig) {
      setIcon(categoryConfig.icon);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError('');

    if (!description || !category || !amount || !date) {
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
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        description,
        category,
        amount: parsedAmount,
        date,
        icon,
      });
      setCategory('Food');
      setDescription('');
      setAmount('');
      setDate(new Date().toISOString().slice(0, 10));
      setIcon('package');
      onAdded && onAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Expense</h3>
      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Groceries, Gas, Movie tickets"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {expenseCategories.map((categoryOption) => (
              <option key={categoryOption.name} value={categoryOption.name}>
                {categoryOption.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Icon</label>
          <div className="grid grid-cols-5 gap-2">
            {expenseCategories.map((categoryOption) => (
              <button
                key={categoryOption.icon}
                type="button"
                onClick={() => {
                  setIcon(categoryOption.icon);
                  setCategory(categoryOption.name);
                }}
                className={`p-2 rounded-lg border-2 transition-colors ${
                  icon === categoryOption.icon
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                title={categoryOption.name}
              >
                <div className={categoryOption.color}>
                  {getIconComponent(categoryOption.icon)}
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
            placeholder="e.g., 500"
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
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;

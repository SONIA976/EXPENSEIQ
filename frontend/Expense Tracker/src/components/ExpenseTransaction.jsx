import React, { useState, useEffect } from 'react';
import { LuTrendingDown, LuCalendar, LuClock, LuFilter, LuSearch, LuTrash2, LuPencil } from 'react-icons/lu';
import axiosInstance from '../Utils/axiosInstance';
import { API_PATHS } from '../Utils/apiPaths';

const ExpenseTransaction = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, last30, last7
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Helper function to format numbers with commas
  const addThousandsSeparator = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  // Helper function to format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Helper function to get category color
  const getCategoryColor = (category) => {
    const colors = {
      'food': 'bg-orange-100 text-orange-700',
      'transport': 'bg-blue-100 text-blue-700',
      'entertainment': 'bg-purple-100 text-purple-700',
      'shopping': 'bg-pink-100 text-pink-700',
      'health': 'bg-red-100 text-red-700',
      'education': 'bg-indigo-100 text-indigo-700',
      'utilities': 'bg-yellow-100 text-yellow-700',
      'rent': 'bg-gray-100 text-gray-700',
      'other': 'bg-gray-100 text-gray-700'
    };
    return colors[category?.toLowerCase()] || colors.other;
  };

  // Fetch expenses
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      if (response.data && response.data.success) {
        setExpenses(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete expense
  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(expenseId));
        fetchExpenses(); // Refresh the list
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  // Filter expenses based on date range
  const getFilteredExpenses = () => {
    let filtered = [...expenses];
    const today = new Date();

    // Apply date filter
    if (filter === 'last7') {
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(expense => new Date(expense.date) >= sevenDaysAgo);
    } else if (filter === 'last30') {
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(expense => new Date(expense.date) >= thirtyDaysAgo);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(expense => 
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(expense => 
        expense.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Get unique categories
  const getUniqueCategories = () => {
    const categories = [...new Set(expenses.map(expense => expense.category).filter(Boolean))];
    return categories.sort();
  };

  // Calculate total for filtered expenses
  const getTotalAmount = () => {
    return getFilteredExpenses().reduce((total, expense) => total + expense.amount, 0);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filteredExpenses = getFilteredExpenses();
  const totalAmount = getTotalAmount();
  const uniqueCategories = getUniqueCategories();

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Expense Transactions</h3>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Expenses</p>
          <p className="text-xl font-bold text-red-600">₹{addThousandsSeparator(totalAmount)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Date Filter */}
        <div className="relative">
          <LuFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="last7">Last 7 Days</option>
            <option value="last30">Last 30 Days</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="relative">
          <LuFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative md:col-span-2">
          <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
        <span>
          {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''} found
        </span>
        <span>
          Total: ₹{addThousandsSeparator(totalAmount)}
        </span>
      </div>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LuTrendingDown className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium mb-2">No expenses found</p>
          <p className="text-gray-400 text-sm">
            {searchTerm || selectedCategory !== 'all' || filter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Start adding your expenses to see them here'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExpenses.map((expense) => (
            <div 
              key={expense._id} 
              className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* Expense Icon */}
              <div className="p-2 bg-red-100 rounded-full">
                <LuTrendingDown className="w-4 h-4 text-red-600" />
              </div>

              {/* Expense Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-800 truncate">
                    {expense.description || 'Untitled Expense'}
                  </p>
                  <span className="font-semibold text-red-600">
                    -₹{addThousandsSeparator(expense.amount)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Category Badge */}
                    {expense.category && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(expense.category)}`}>
                        {expense.category}
                      </span>
                    )}
                    
                    {/* Date */}
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <LuCalendar className="w-3 h-3" />
                      <span>{formatDate(expense.date)}</span>
                    </div>
                    
                    {/* Time */}
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <LuClock className="w-3 h-3" />
                      <span>{formatTime(expense.date)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Delete expense"
                    >
                      <LuTrash2 className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      title="Edit expense"
                    >
                      <LuPencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseTransaction;

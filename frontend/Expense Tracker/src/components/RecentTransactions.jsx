import React from 'react';
import { LuTrendingUp, LuTrendingDown, LuCalendar, LuClock } from 'react-icons/lu';

const RecentTransactions = ({ transactions = [], loading = false }) => {
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

  // Helper function to get transaction icon
  const getTransactionIcon = (type) => {
    return type === 'income' ? (
      <div className="p-2 bg-green-100 rounded-full">
        <LuTrendingUp className="w-4 h-4 text-green-600" />
      </div>
    ) : (
      <div className="p-2 bg-red-100 rounded-full">
        <LuTrendingDown className="w-4 h-4 text-red-600" />
      </div>
    );
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
      'salary': 'bg-green-100 text-green-700',
      'freelance': 'bg-teal-100 text-teal-700',
      'investment': 'bg-yellow-100 text-yellow-700',
      'other': 'bg-gray-100 text-gray-700'
    };
    return colors[category?.toLowerCase()] || colors.other;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LuClock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium mb-2">No transactions yet</p>
          <p className="text-gray-400 text-sm">Start adding your income and expenses to see them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
        <span className="text-sm text-gray-500">
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="space-y-3">
        {transactions.slice(0, 8).map((transaction, index) => (
          <div 
            key={transaction._id || index} 
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {/* Transaction Icon */}
            {getTransactionIcon(transaction.type)}

            {/* Transaction Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-gray-800 truncate">
                  {transaction.description || transaction.title || 'Untitled Transaction'}
                </p>
                <span className={`font-semibold text-sm ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}₹{addThousandsSeparator(transaction.amount)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Category Badge */}
                  {transaction.category && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(transaction.category)}`}>
                      {transaction.category}
                    </span>
                  )}
                  
                  {/* Date */}
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <LuCalendar className="w-3 h-3" />
                    <span>{formatDate(transaction.date)}</span>
                  </div>
                  
                  {/* Time */}
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <LuClock className="w-3 h-3" />
                    <span>{formatTime(transaction.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      {transactions.length > 8 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium py-2 rounded-lg hover:bg-purple-50 transition-colors">
            View All Transactions ({transactions.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;

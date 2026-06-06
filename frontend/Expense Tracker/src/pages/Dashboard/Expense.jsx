import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";
import ExpenseForm from "../../components/ExpenseForm";
import ExpenseOverviewChart from "../../components/ExpenseOverviewChart";
import { LuTrash2, LuPencil, LuDollarSign, LuBriefcase, LuGift, LuTrendingDown, LuBuilding, LuCar, LuGraduationCap, LuHeart, LuZap, LuStar, LuPackage, LuShoppingCart } from "react-icons/lu";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Icon mapping for different expense categories
  const getIconForCategory = (category, storedIcon) => {
    // If there's a stored icon, use it
    if (storedIcon) {
      const iconMap = {
        'dollar-sign': <LuDollarSign className="w-5 h-5 text-gray-600" />,
        'briefcase': <LuBriefcase className="w-5 h-5 text-emerald-600" />,
        'gift': <LuGift className="w-5 h-5 text-purple-600" />,
        'trending-down': <LuTrendingDown className="w-5 h-5 text-red-600" />,
        'building': <LuBuilding className="w-5 h-5 text-gray-600" />,
        'car': <LuCar className="w-5 h-5 text-blue-600" />,
        'graduation-cap': <LuGraduationCap className="w-5 h-5 text-indigo-600" />,
        'heart': <LuHeart className="w-5 h-5 text-red-600" />,
        'zap': <LuZap className="w-5 h-5 text-yellow-600" />,
        'star': <LuStar className="w-5 h-5 text-yellow-600" />,
        'package': <LuPackage className="w-5 h-5 text-gray-600" />,
        'shopping-cart': <LuShoppingCart className="w-5 h-5 text-pink-600" />,
      };
      return iconMap[storedIcon] || <LuDollarSign className="w-5 h-5 text-gray-600" />;
    }

    // Fallback to inferring from category name
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('food') || categoryLower.includes('meal')) return <LuPackage className="w-5 h-5 text-gray-600" />;
    if (categoryLower.includes('transport') || categoryLower.includes('car')) return <LuCar className="w-5 h-5 text-blue-600" />;
    if (categoryLower.includes('shopping') || categoryLower.includes('clothes')) return <LuShoppingCart className="w-5 h-5 text-pink-600" />;
    if (categoryLower.includes('entertainment') || categoryLower.includes('movie')) return <LuGift className="w-5 h-5 text-purple-600" />;
    if (categoryLower.includes('health') || categoryLower.includes('medical')) return <LuHeart className="w-5 h-5 text-red-600" />;
    if (categoryLower.includes('education') || categoryLower.includes('school')) return <LuGraduationCap className="w-5 h-5 text-indigo-600" />;
    if (categoryLower.includes('utilities') || categoryLower.includes('electricity')) return <LuZap className="w-5 h-5 text-yellow-600" />;
    if (categoryLower.includes('rent') || categoryLower.includes('housing')) return <LuBuilding className="w-5 h-5 text-gray-600" />;
    if (categoryLower.includes('business') || categoryLower.includes('work')) return <LuBriefcase className="w-5 h-5 text-emerald-600" />;
    return <LuDollarSign className="w-5 h-5 text-gray-600" />;
  };

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      // Backend returns array directly
      setExpenses(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setExpenses(expenses.filter(item => item._id !== id));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Failed to delete expense:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Helper function
  const addThousandsSeparator = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const totalExpenses = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Expense Management</h1>
          <p className="text-gray-600 mt-2">
            Track and manage your expenses with detailed analytics and insights.
          </p>
        </div>

        {/* Top summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">₹{addThousandsSeparator(totalExpenses)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <p className="text-sm text-gray-600">Categories</p>
            <p className="text-2xl font-bold text-gray-900">{new Set(expenses.map(e => e.category)).size}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <p className="text-sm text-gray-600">Entries</p>
            <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExpenseForm onAdded={fetchExpenses} />
          <ExpenseOverviewChart expenses={expenses} />
        </div>

        {/* Expense list */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Expenses</h3>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : expenses.length === 0 ? (
            <p className="text-gray-500">No expenses added yet.</p>
          ) : (
            <div className="space-y-3">
              {expenses.slice(0, 8).map((item) => (
                <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    {getIconForCategory(item.category, item.icon)}
                    <div>
                      <p className="font-medium text-gray-800">{item.description || 'Untitled Expense'}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gray-200 rounded-full">{item.category}</span>
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-red-600">-₹{addThousandsSeparator(item.amount)}</span>
                    <button
                      onClick={() => confirmDelete(item._id)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Delete expense"
                    >
                      <LuTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete Expense</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this expense entry? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteId(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Expense;

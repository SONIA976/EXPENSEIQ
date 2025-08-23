import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";
import IncomeForm from "../../components/IncomeForm";
import IncomeOverviewChart from "../../components/IncomeOverviewChart";
import { LuTrash2, LuPencil, LuDollarSign, LuBriefcase, LuGift, LuTrendingUp, LuBuilding, LuCar, LuGraduationCap, LuHeart, LuZap, LuStar } from "react-icons/lu";

const Income = () => {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Icon mapping for different income sources
  const getIconForSource = (source, storedIcon) => {
    // If there's a stored icon, use it
    if (storedIcon) {
      const iconMap = {
        'dollar-sign': <LuDollarSign className="w-5 h-5 text-gray-600" />,
        'briefcase': <LuBriefcase className="w-5 h-5 text-blue-600" />,
        'gift': <LuGift className="w-5 h-5 text-purple-600" />,
        'trending-up': <LuTrendingUp className="w-5 h-5 text-green-600" />,
        'building': <LuBuilding className="w-5 h-5 text-orange-600" />,
        'car': <LuCar className="w-5 h-5 text-gray-600" />,
        'graduation-cap': <LuGraduationCap className="w-5 h-5 text-indigo-600" />,
        'heart': <LuHeart className="w-5 h-5 text-red-600" />,
        'zap': <LuZap className="w-5 h-5 text-yellow-600" />,
        'star': <LuStar className="w-5 h-5 text-yellow-600" />,
      };
      return iconMap[storedIcon] || <LuDollarSign className="w-5 h-5 text-gray-600" />;
    }

    // Fallback to inferring from source name
    const sourceLower = source.toLowerCase();
    if (sourceLower.includes('salary') || sourceLower.includes('job')) return <LuBriefcase className="w-5 h-5 text-blue-600" />;
    if (sourceLower.includes('freelance') || sourceLower.includes('consulting')) return <LuTrendingUp className="w-5 h-5 text-green-600" />;
    if (sourceLower.includes('bonus') || sourceLower.includes('gift')) return <LuGift className="w-5 h-5 text-purple-600" />;
    if (sourceLower.includes('rent') || sourceLower.includes('property')) return <LuBuilding className="w-5 h-5 text-orange-600" />;
    if (sourceLower.includes('investment') || sourceLower.includes('dividend')) return <LuTrendingUp className="w-5 h-5 text-emerald-600" />;
    if (sourceLower.includes('education') || sourceLower.includes('scholarship')) return <LuGraduationCap className="w-5 h-5 text-indigo-600" />;
    if (sourceLower.includes('health') || sourceLower.includes('medical')) return <LuHeart className="w-5 h-5 text-red-600" />;
    if (sourceLower.includes('transport') || sourceLower.includes('uber')) return <LuCar className="w-5 h-5 text-gray-600" />;
    return <LuDollarSign className="w-5 h-5 text-gray-600" />;
  };

  const fetchIncome = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      // Backend returns array directly
      setIncome(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch income:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      setIncome(income.filter(item => item._id !== id));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Failed to delete income:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  // Helper function
  const addThousandsSeparator = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const totalIncome = income.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Income Management </h1>
          <p className="text-gray-600 mt-2">
            Add your salary and other income sources, and see an overview by month.
          </p>
        </div>

        {/* Top summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <p className="text-sm text-gray-600">Total Income</p>
            <p className="text-2xl font-bold text-green-600">₹{addThousandsSeparator(totalIncome)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <p className="text-sm text-gray-600">Sources</p>
            <p className="text-2xl font-bold text-gray-900">{new Set(income.map(i => i.source)).size}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <p className="text-sm text-gray-600">Entries</p>
            <p className="text-2xl font-bold text-gray-900">{income.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <IncomeForm onAdded={fetchIncome} />
          <IncomeOverviewChart income={income} />
        </div>

        {/* Income list */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Income</h3>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : income.length === 0 ? (
            <p className="text-gray-500">No income added yet.</p>
          ) : (
            <div className="space-y-3">
              {income.slice(0, 8).map((item) => (
                <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    {getIconForSource(item.source, item.icon)}
                    <div>
                      <p className="font-medium text-gray-800">{item.source}</p>
                      <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-green-600">+₹{addThousandsSeparator(item.amount)}</span>
                    <button
                      onClick={() => confirmDelete(item._id)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Delete income"
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
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete Income</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this income entry? This action cannot be undone.
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

export default Income;

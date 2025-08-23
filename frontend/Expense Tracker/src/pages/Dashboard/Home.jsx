import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { API_PATHS } from "../../Utils/apiPaths";
import axiosInstance from "../../Utils/axiosInstance";
import { LuHandCoins, LuWalletMinimal, LuTrendingUp } from "react-icons/lu";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import RecentTransactions from "../../components/RecentTransactions";
 

const Home = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Helper function to format numbers with commas
  const addThousandsSeparator = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="my-5 mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{addThousandsSeparator(dashboardData?.totalBalance || 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <LuWalletMinimal className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{addThousandsSeparator(dashboardData?.totalIncome || 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <LuTrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  ₹{addThousandsSeparator(dashboardData?.totalExpenses || 0)}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <LuHandCoins className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecentTransactions 
              transactions={dashboardData.recentTransactions || []} 
              loading={loading}
            />

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last 30 Days Expenses</span>
                  <span className="font-semibold text-red-600">
                    ₹{addThousandsSeparator(dashboardData?.last30DaysExpenses?.total || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last 60 Days Income</span>
                  <span className="font-semibold text-green-600">
                    ₹{addThousandsSeparator(dashboardData?.last60DaysIncome?.total || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Financial Overview Pie Chart */}
        {dashboardData && (
          <div className="mt-6 grid grid-cols-1">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Overview</h3>
              {((dashboardData.totalIncome || 0) === 0 && (dashboardData.totalExpenses || 0) === 0) ? (
                <p className="text-gray-500 text-center py-8">No income or expenses to display</p>
              ) : (
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Income', value: dashboardData.totalIncome || 0 },
                          { name: 'Expenses', value: dashboardData.totalExpenses || 0 },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        label
                      >
                        {[
                          { name: 'Income', color: '#22c55e' },
                          { name: 'Expenses', color: '#ef4444' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${addThousandsSeparator(value)}`} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
export default Home;

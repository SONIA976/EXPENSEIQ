import React, { useContext } from 'react'
import Navbar from './Navbar'
import SideMenu from './SideMenu'
import { UserContext } from "../context/UserContext";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  // If no user, show loading or redirect
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
          <p className="text-sm text-gray-500 mt-2">Waiting for user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar activeMenu={activeMenu} />

      <div className="flex">
        {/* Sidebar */}
        <aside className="max-[1080px]:hidden">
          <SideMenu activeMenu={activeMenu} />
        </aside>

        {/* Main Content */}
        <main className="grow p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

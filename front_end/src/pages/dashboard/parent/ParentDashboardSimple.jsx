import React from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const ParentDashboard = () => {
  return (
    <DashboardLayout title="Parent Dashboard" userRole="parent">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-n-1 mb-4">Parent Dashboard</h1>
        <p className="text-n-3">Welcome to the Parent Dashboard. This is working correctly!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-n-8 rounded-xl p-6 border border-n-6">
            <h3 className="text-n-1 font-semibold">My Children</h3>
            <p className="text-n-4 text-sm mt-2">Monitor your children's progress</p>
          </div>
          <div className="bg-n-8 rounded-xl p-6 border border-n-6">
            <h3 className="text-n-1 font-semibold">Progress Reports</h3>
            <p className="text-n-4 text-sm mt-2">View detailed progress</p>
          </div>
          <div className="bg-n-8 rounded-xl p-6 border border-n-6">
            <h3 className="text-n-1 font-semibold">Notifications</h3>
            <p className="text-n-4 text-sm mt-2">Important updates</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;

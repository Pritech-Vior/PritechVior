import React from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const TrainerDashboard = () => {
  return (
    <DashboardLayout title="Trainer Dashboard" userRole="trainer">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-n-1 mb-4">Trainer Dashboard</h1>
        <p className="text-n-3">Welcome to the Trainer Dashboard. This is working correctly!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-n-8 rounded-xl p-6 border border-n-6">
            <h3 className="text-n-1 font-semibold">Training Programs</h3>
            <p className="text-n-4 text-sm mt-2">Manage your training courses</p>
          </div>
          <div className="bg-n-8 rounded-xl p-6 border border-n-6">
            <h3 className="text-n-1 font-semibold">Trainees</h3>
            <p className="text-n-4 text-sm mt-2">Track student progress</p>
          </div>
          <div className="bg-n-8 rounded-xl p-6 border border-n-6">
            <h3 className="text-n-1 font-semibold">Content Creation</h3>
            <p className="text-n-4 text-sm mt-2">Create and manage content</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TrainerDashboard;

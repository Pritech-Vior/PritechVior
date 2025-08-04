import React from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const GuestDashboard = () => {
  return (
    <DashboardLayout title="Guest Dashboard" userRole="guest">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-n-1 mb-4">Guest Dashboard</h1>
        <p className="text-n-3">Welcome to PritechVior! Explore our courses and services.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="bg-n-8 rounded-xl p-6 border border-n-6">
            <h3 className="text-n-1 font-semibold">Explore Courses</h3>
            <p className="text-n-4 text-sm mt-2">Browse available courses</p>
          </div>
          <div className="bg-n-8 rounded-xl p-6 border border-n-6">
            <h3 className="text-n-1 font-semibold">Free Events</h3>
            <p className="text-n-4 text-sm mt-2">Join workshops and webinars</p>
          </div>
          <div className="bg-n-8 rounded-xl p-6 border border-n-6">
            <h3 className="text-n-1 font-semibold">Learning Paths</h3>
            <p className="text-n-4 text-sm mt-2">Structured learning journeys</p>
          </div>
          <div className="bg-n-8 rounded-xl p-6 border border-n-6">
            <h3 className="text-n-1 font-semibold">Get Started</h3>
            <p className="text-n-4 text-sm mt-2">Register and begin learning</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GuestDashboard;

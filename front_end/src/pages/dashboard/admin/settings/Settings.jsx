import DashboardLayout from "../../../../components/dashboard/DashboardLayout";

const Settings = () => (
  <DashboardLayout title="Settings" userRole="admin">
    <div className="bg-n-8 rounded-xl p-6 border border-n-6">
      <h2 className="text-lg font-semibold text-n-1 mb-4">Settings</h2>
      <p className="text-n-3">Configure platform settings and preferences.</p>
      {/* Add settings UI here */}
    </div>
  </DashboardLayout>
);

export default Settings;

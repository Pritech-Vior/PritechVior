import DashboardLayout from "../../../../components/dashboard/DashboardLayout";

const ArchiveManagement = () => (
  <DashboardLayout title="Archive Management" userRole="admin">
    <div className="bg-n-8 rounded-xl p-6 border border-n-6">
      <h2 className="text-lg font-semibold text-n-1 mb-4">Manage Archives</h2>
      <p className="text-n-3">Administer all archive content and records.</p>
      {/* Add archive management UI here */}
    </div>
  </DashboardLayout>
);

export default ArchiveManagement;

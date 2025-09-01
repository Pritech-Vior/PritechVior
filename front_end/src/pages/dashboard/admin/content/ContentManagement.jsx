import DashboardLayout from "../../../../components/dashboard/DashboardLayout";

const ContentManagement = () => (
  <DashboardLayout title="Content Management" userRole="admin">
    <div className="bg-n-8 rounded-xl p-6 border border-n-6">
      <h2 className="text-lg font-semibold text-n-1 mb-4">Manage Content</h2>
      <p className="text-n-3">
        Administer all platform content including blogs and archives.
      </p>
      {/* Add content management UI here */}
    </div>
  </DashboardLayout>
);

export default ContentManagement;

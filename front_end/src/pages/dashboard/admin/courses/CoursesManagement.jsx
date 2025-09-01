import DashboardLayout from "../../../../components/dashboard/DashboardLayout";

const CoursesManagement = () => (
  <DashboardLayout title="Courses Management" userRole="admin">
    <div className="bg-n-8 rounded-xl p-6 border border-n-6">
      <h2 className="text-lg font-semibold text-n-1 mb-4">Manage Courses</h2>
      <p className="text-n-3">
        Administer all courses, trainers, and course content.
      </p>
      {/* Add courses management UI here */}
    </div>
  </DashboardLayout>
);

export default CoursesManagement;

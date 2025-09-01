import DashboardLayout from "../../../../components/dashboard/DashboardLayout";

const Payments = () => (
  <DashboardLayout title="Payments" userRole="admin">
    <div className="bg-n-8 rounded-xl p-6 border border-n-6">
      <h2 className="text-lg font-semibold text-n-1 mb-4">Payments</h2>
      <p className="text-n-3">Manage all payment transactions and history.</p>
      {/* Add payments UI here */}
    </div>
  </DashboardLayout>
);

export default Payments;

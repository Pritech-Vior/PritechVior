import DashboardLayout from "../../../../components/dashboard/DashboardLayout";
import { useAuth } from "../../../../contexts/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  return (
    <DashboardLayout title="Admin Profile" userRole={user?.role || "admin"}>
      <div className="max-w-2xl mx-auto bg-n-8 rounded-xl shadow border border-n-6 p-8 mt-8">
        <h2 className="text-3xl font-bold mb-6 text-n-1 text-center">
          Profile
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <div className="w-20 h-20 rounded-full bg-n-7 flex items-center justify-center text-2xl font-bold text-n-1">
              {user?.first_name?.[0] ||
                user?.username?.[0] ||
                user?.name?.[0] ||
                "A"}
            </div>
            <div>
              <div className="font-bold text-xl text-n-1">
                {user?.first_name || user?.username || user?.name || "Admin"}
              </div>
              <div className="text-n-3">{user?.email || "admin@email.com"}</div>
              <div className="text-n-4 mt-1">
                Role:{" "}
                <span className="font-semibold">
                  {user?.role ||
                    (user?.roles ? user.roles.join(", ") : "admin")}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button className="bg-color-1 text-white px-6 py-2 rounded-xl font-bold">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  UserCheck, 
  UserX, 
  Shield, 
  Mail,
  Phone,
  Calendar,
  Activity,
  RefreshCw,
  Download,
  Upload,
  MoreHorizontal,
  Grid,
  List,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import DashboardLayout from "../../../../components/dashboard/DashboardLayout";
import Card from "../../../../components/Card";
import Table from "../../../../components/Table";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import usersManagement from "../../../../services/admin/users/usersManagement";

const UsersManagement = () => {
  const [viewMode, setViewMode] = useState("table");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userStats, setUserStats] = useState(null);
  
  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    loadData();
    loadUserStats();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const usersData = await usersManagement.getUsers({
        search,
        role: roleFilter !== "all" ? roleFilter : undefined,
        is_active: statusFilter !== "all" ? statusFilter : undefined
      });
      
      setUsers(Array.isArray(usersData) ? usersData : usersData.results || []);
    } catch (err) {
      setError("Failed to load users data");
      console.error('Load users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const stats = await usersManagement.getUserStats();
      setUserStats(stats);
    } catch (err) {
      console.error('Load user stats error:', err);
    }
  };

  const handleRefresh = async () => {
    await loadData();
    await loadUserStats();
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await usersManagement.deleteUser(userId);
        setUsers(prev => prev.filter(user => user.id !== userId));
      } catch (err) {
        alert("Failed to delete user.");
      }
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await usersManagement.activateUser(userId);
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_active: true } : user
      ));
    } catch (err) {
      alert("Failed to activate user.");
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      await usersManagement.deactivateUser(userId);
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_active: false } : user
      ));
    } catch (err) {
      alert("Failed to deactivate user.");
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await usersManagement.changeUserRole(userId, newRole);
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      alert("Failed to change user role.");
    }
  };

  const handleResetPassword = async (userId) => {
    if (window.confirm("Are you sure you want to reset this user's password?")) {
      try {
        await usersManagement.resetUserPassword(userId);
        alert("Password reset email sent to user.");
      } catch (err) {
        alert("Failed to reset password.");
      }
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) {
      alert("Please select users first.");
      return;
    }

    if (window.confirm(`Are you sure you want to ${action} ${selectedItems.length} users?`)) {
      try {
        switch (action) {
          case 'delete':
            await usersManagement.bulkDeleteUsers(selectedItems);
            break;
          case 'activate':
            await usersManagement.bulkActivateUsers(selectedItems);
            break;
          case 'deactivate':
            await usersManagement.bulkDeactivateUsers(selectedItems);
            break;
        }
        setSelectedItems([]);
        await loadData();
      } catch (err) {
        alert(`Failed to ${action} selected users.`);
      }
    }
  };

  // Filter data
  const getFilteredUsers = () => {
    return users.filter(user => {
      const matchesSearch = search === "" || 
        user.username?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(search.toLowerCase());
      
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "active" && user.is_active) ||
        (statusFilter === "inactive" && !user.is_active);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      admin: "bg-red-100 text-red-800",
      client: "bg-blue-100 text-blue-800",
      student: "bg-green-100 text-green-800",
      trainer: "bg-purple-100 text-purple-800",
      technician: "bg-yellow-100 text-yellow-800",
      designer: "bg-pink-100 text-pink-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[role] || 'bg-gray-100 text-gray-800'}`}>
        {role?.toUpperCase()}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
        {isActive ? 'ACTIVE' : 'INACTIVE'}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getFullName = (user) => {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;
  };

  return (
    <DashboardLayout title="Users Management" userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Users Management</h1>
            <p className="text-n-3 mt-1">Manage all platform users</p>
          </div>
          <div className="flex gap-3">
            <Button
              icon={<RefreshCw size={16} className={loading ? "animate-spin" : ""} />}
              onClick={handleRefresh}
              disabled={loading}
              variant="secondary"
            >
              Refresh
            </Button>
            <Button
              icon={<Plus size={16} />}
              onClick={() => {/* Navigate to create user */}}
            >
              New User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {userStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-n-4 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-n-1">{userStats.total_users?.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Activity size={20} className="text-white" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-n-4 text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-n-1">{userStats.active_users?.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <UserCheck size={20} className="text-white" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-n-4 text-sm">New This Month</p>
                  <p className="text-2xl font-bold text-n-1">{userStats.new_this_month?.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Plus size={20} className="text-white" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-n-4 text-sm">Admins</p>
                  <p className="text-2xl font-bold text-n-1">{userStats.by_role?.admin || 0}</p>
                </div>
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <Shield size={20} className="text-white" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="bg-n-8 rounded-xl p-4 border border-n-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div className="md:col-span-2">
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
                icon={<Search size={16} />}
              />
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1 text-sm"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="client">Client</option>
              <option value="student">Student</option>
              <option value="trainer">Trainer</option>
              <option value="technician">Technician</option>
              <option value="designer">Designer</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1 text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
                className="p-2 bg-n-7 rounded-lg hover:bg-n-6 border border-n-6"
              >
                {viewMode === "table" ? <Grid size={16} className="text-n-3" /> : <List size={16} className="text-n-3" />}
              </button>
              <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 border border-n-6">
                <Download size={16} className="text-n-3" />
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="mt-4 p-3 bg-n-7 rounded-lg border border-n-6">
              <div className="flex items-center justify-between">
                <span className="text-n-1 text-sm">
                  {selectedItems.length} users selected
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleBulkAction('activate')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Activate Selected
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleBulkAction('deactivate')}
                    variant="secondary"
                  >
                    Deactivate Selected
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleBulkAction('delete')}
                  >
                    Delete Selected
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedItems([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
            <p className="text-n-3">Loading users...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto mb-4 text-red-400" size={32} />
            <p className="text-red-400">{error}</p>
            <Button onClick={handleRefresh} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredUsers().map((user) => (
                  <Card key={user.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-color-1 to-color-2 rounded-full flex items-center justify-center text-white font-semibold">
                            {getFullName(user).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-n-1">
                              {getFullName(user)}
                            </h3>
                            <p className="text-n-4 text-sm">@{user.username}</p>
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, user.id]);
                          } else {
                            setSelectedItems(selectedItems.filter(id => id !== user.id));
                          }
                        }}
                        className="ml-2"
                      />
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.is_active)}
                      </div>
                      
                      <div className="space-y-2 text-sm text-n-4">
                        <div className="flex items-center gap-2">
                          <Mail size={14} />
                          {user.email}
                        </div>
                        {user.profile?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} />
                            {user.profile.phone}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          Joined {formatDate(user.date_joined)}
                        </div>
                        {user.projects_count !== undefined && (
                          <div className="flex items-center gap-2">
                            <Activity size={14} />
                            {user.projects_count} projects
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" icon={<Eye size={14} />}>
                        View
                      </Button>
                      <Button size="sm" icon={<Edit size={14} />} variant="secondary">
                        Edit
                      </Button>
                      {user.is_active ? (
                        <Button 
                          size="sm" 
                          icon={<UserX size={14} />} 
                          variant="secondary"
                          onClick={() => handleDeactivateUser(user.id)}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          icon={<UserCheck size={14} />} 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleActivateUser(user.id)}
                        >
                          Activate
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-n-8 rounded-xl border border-n-6 overflow-hidden">
                <Table
                  columns={[
                    { 
                      key: "select", 
                      label: (
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(getFilteredUsers().map(u => u.id));
                            } else {
                              setSelectedItems([]);
                            }
                          }}
                          checked={selectedItems.length === getFilteredUsers().length && getFilteredUsers().length > 0}
                        />
                      )
                    },
                    { key: "user", label: "User" },
                    { key: "email", label: "Email" },
                    { key: "role", label: "Role" },
                    { key: "status", label: "Status" },
                    { key: "projects", label: "Projects" },
                    { key: "joined", label: "Joined" },
                    { key: "last_login", label: "Last Login" },
                    { key: "actions", label: "Actions" }
                  ]}
                  data={getFilteredUsers().map((user) => ({
                    select: (
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, user.id]);
                          } else {
                            setSelectedItems(selectedItems.filter(id => id !== user.id));
                          }
                        }}
                      />
                    ),
                    user: (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-color-1 to-color-2 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {getFullName(user).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-n-1">{getFullName(user)}</div>
                          <div className="text-sm text-n-4">@{user.username}</div>
                        </div>
                      </div>
                    ),
                    email: user.email,
                    role: getRoleBadge(user.role),
                    status: getStatusBadge(user.is_active),
                    projects: user.projects_count || 0,
                    joined: formatDate(user.date_joined),
                    last_login: formatDate(user.last_login),
                    actions: (
                      <div className="flex gap-1">
                        <Button size="sm" icon={<Eye size={14} />} />
                        <Button size="sm" icon={<Edit size={14} />} variant="secondary" />
                        {user.is_active ? (
                          <Button 
                            size="sm" 
                            icon={<UserX size={14} />} 
                            variant="secondary"
                            onClick={() => handleDeactivateUser(user.id)}
                          />
                        ) : (
                          <Button 
                            size="sm" 
                            icon={<UserCheck size={14} />} 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleActivateUser(user.id)}
                          />
                        )}
                        <Button 
                          size="sm" 
                          icon={<Trash2 size={14} />} 
                          variant="danger"
                          onClick={() => handleDelete(user.id)}
                        />
                      </div>
                    )
                  }))}
                />
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && getFilteredUsers().length === 0 && (
          <div className="text-center py-12">
            <div className="text-n-4 mb-4">No users found</div>
            <Button icon={<Plus size={16} />}>
              Create User
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UsersManagement;
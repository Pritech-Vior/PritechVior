import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Calendar, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Upload,
  MoreHorizontal,
  Grid,
  List
} from "lucide-react";
import DashboardLayout from "../../../../components/dashboard/DashboardLayout";
import Card from "../../../../components/Card";
import Table from "../../../../components/Table";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import projectsManagement from "../../../../services/admin/projects/projectsManagement";

const ProjectsManagement = () => {
  const [viewMode, setViewMode] = useState("table");
  const [projects, setProjects] = useState([]);
  const [projectRequests, setProjectRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("projects");
  
  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);

  // Reference data
  const [categories, setCategories] = useState([]);
  const [technologies, setTechnologies] = useState([]);

  useEffect(() => {
    loadData();
    loadReferenceData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsData, requestsData] = await Promise.all([
        projectsManagement.getProjects(),
        projectsManagement.getProjectRequests()
      ]);
      
      setProjects(Array.isArray(projectsData) ? projectsData : projectsData.results || []);
      setProjectRequests(Array.isArray(requestsData) ? requestsData : requestsData.results || []);
    } catch (err) {
      setError("Failed to load projects data");
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadReferenceData = async () => {
    try {
      const [categoriesData, technologiesData] = await Promise.all([
        projectsManagement.getCategories(),
        projectsManagement.getTechnologies()
      ]);
      
      setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.results || []);
      setTechnologies(Array.isArray(technologiesData) ? technologiesData : technologiesData.results || []);
    } catch (err) {
      console.error('Load reference data error:', err);
    }
  };

  const handleRefresh = async () => {
    await loadData();
  };

  const handleDelete = async (slug) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await projectsManagement.deleteProject(slug);
        setProjects(prev => prev.filter(project => project.slug !== slug));
      } catch (err) {
        alert("Failed to delete project.");
      }
    }
  };

  const handleStatusUpdate = async (slug, newStatus) => {
    try {
      await projectsManagement.updateProjectStatus(slug, newStatus);
      setProjects(prev => prev.map(project => 
        project.slug === slug ? { ...project, status: newStatus } : project
      ));
    } catch (err) {
      alert("Failed to update project status.");
    }
  };

  const handleConvertRequest = async (requestId) => {
    try {
      await projectsManagement.convertRequestToProject(requestId);
      await loadData(); // Refresh data
      alert("Request converted to project successfully!");
    } catch (err) {
      alert("Failed to convert request to project.");
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) {
      alert("Please select items first.");
      return;
    }

    if (window.confirm(`Are you sure you want to ${action} ${selectedItems.length} items?`)) {
      try {
        switch (action) {
          case 'delete':
            await projectsManagement.bulkDeleteProjects(selectedItems);
            break;
          case 'activate':
            await projectsManagement.bulkUpdateProjects(selectedItems, { is_active: true });
            break;
          case 'deactivate':
            await projectsManagement.bulkUpdateProjects(selectedItems, { is_active: false });
            break;
        }
        setSelectedItems([]);
        await loadData();
      } catch (err) {
        alert(`Failed to ${action} selected items.`);
      }
    }
  };

  // Filter data
  const getFilteredProjects = () => {
    return projects.filter(project => {
      const matchesSearch = search === "" || 
        project.title?.toLowerCase().includes(search.toLowerCase()) ||
        project.client?.username?.toLowerCase().includes(search.toLowerCase()) ||
        project.description?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter;
      const matchesUserType = userTypeFilter === "all" || project.user_type === userTypeFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesUserType;
    });
  };

  const getFilteredRequests = () => {
    return projectRequests.filter(request => {
      const matchesSearch = search === "" || 
        request.title?.toLowerCase().includes(search.toLowerCase()) ||
        request.client?.username?.toLowerCase().includes(search.toLowerCase()) ||
        request.description?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      const matchesUserType = userTypeFilter === "all" || request.user_type === userTypeFilter;
      
      return matchesSearch && matchesStatus && matchesUserType;
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      planning: "bg-blue-100 text-blue-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      review: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      on_hold: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
      pending: "bg-orange-100 text-orange-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityColors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[priority] || 'bg-gray-100 text-gray-800'}`}>
        {priority?.toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return `TSH ${amount.toLocaleString()}`;
  };

  return (
    <DashboardLayout title="Projects Management" userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Projects Management</h1>
            <p className="text-n-3 mt-1">Manage all projects and requests</p>
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
              onClick={() => {/* Navigate to create project */}}
            >
              New Project
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-n-7 p-1 rounded-lg w-fit">
          {[
            { key: "projects", label: "Projects", count: projects.length },
            { key: "requests", label: "Requests", count: projectRequests.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.key 
                  ? "bg-gradient-to-r from-color-1 to-color-2 text-white" 
                  : "text-n-3 hover:text-n-1"
              }`}
            >
              {tab.label}
              <span className="bg-n-6 text-n-2 px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-n-8 rounded-xl p-4 border border-n-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
            <div className="md:col-span-2">
              <Input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
                icon={<Search size={16} />}
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1 text-sm"
            >
              <option value="all">All Status</option>
              {activeTab === "projects" ? (
                <>
                  <option value="planning">Planning</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                  <option value="cancelled">Cancelled</option>
                </>
              ) : (
                <>
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="quoted">Quoted</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="converted">Converted</option>
                </>
              )}
            </select>

            {activeTab === "projects" && (
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1 text-sm"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            )}

            <select
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
              className="bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1 text-sm"
            >
              <option value="all">All Types</option>
              <option value="client">Client</option>
              <option value="student">Student</option>
              <option value="business">Business</option>
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
                  {selectedItems.length} items selected
                </span>
                <div className="flex gap-2">
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
            <p className="text-n-3">Loading...</p>
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
            {activeTab === "projects" && (
              <>
                {viewMode === "cards" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFilteredProjects().map((project) => (
                      <Card key={project.slug} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-n-1 mb-2">
                              {project.title}
                            </h3>
                            <p className="text-n-4 text-sm mb-3 line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(project.slug)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems([...selectedItems, project.slug]);
                              } else {
                                setSelectedItems(selectedItems.filter(id => id !== project.slug));
                              }
                            }}
                            className="ml-2"
                          />
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between">
                            {getStatusBadge(project.status)}
                            {getPriorityBadge(project.priority)}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-n-4">
                            <div className="flex items-center gap-1">
                              <Users size={14} />
                              {project.client?.username || "N/A"}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {formatDate(project.created_at)}
                            </div>
                          </div>

                          {project.budget && (
                            <div className="flex items-center gap-1 text-sm text-n-4">
                              <DollarSign size={14} />
                              {formatCurrency(project.budget)}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" icon={<Eye size={14} />}>
                            View
                          </Button>
                          <Button size="sm" icon={<Edit size={14} />} variant="secondary">
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            icon={<Trash2 size={14} />} 
                            variant="danger"
                            onClick={() => handleDelete(project.slug)}
                          >
                            Delete
                          </Button>
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
                                  setSelectedItems(getFilteredProjects().map(p => p.slug));
                                } else {
                                  setSelectedItems([]);
                                }
                              }}
                              checked={selectedItems.length === getFilteredProjects().length && getFilteredProjects().length > 0}
                            />
                          )
                        },
                        { key: "title", label: "Title" },
                        { key: "client", label: "Client" },
                        { key: "status", label: "Status" },
                        { key: "priority", label: "Priority" },
                        { key: "budget", label: "Budget" },
                        { key: "created_at", label: "Created" },
                        { key: "actions", label: "Actions" }
                      ]}
                      data={getFilteredProjects().map((project) => ({
                        select: (
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(project.slug)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems([...selectedItems, project.slug]);
                              } else {
                                setSelectedItems(selectedItems.filter(id => id !== project.slug));
                              }
                            }}
                          />
                        ),
                        title: (
                          <div>
                            <div className="font-medium text-n-1">{project.title}</div>
                            <div className="text-sm text-n-4 truncate max-w-xs">
                              {project.description}
                            </div>
                          </div>
                        ),
                        client: project.client?.username || "N/A",
                        status: getStatusBadge(project.status),
                        priority: getPriorityBadge(project.priority),
                        budget: formatCurrency(project.budget),
                        created_at: formatDate(project.created_at),
                        actions: (
                          <div className="flex gap-1">
                            <Button size="sm" icon={<Eye size={14} />} />
                            <Button size="sm" icon={<Edit size={14} />} variant="secondary" />
                            <Button 
                              size="sm" 
                              icon={<Trash2 size={14} />} 
                              variant="danger"
                              onClick={() => handleDelete(project.slug)}
                            />
                          </div>
                        )
                      }))}
                    />
                  </div>
                )}
              </>
            )}

            {activeTab === "requests" && (
              <div className="bg-n-8 rounded-xl border border-n-6 overflow-hidden">
                <Table
                  columns={[
                    { key: "title", label: "Title" },
                    { key: "client", label: "Client" },
                    { key: "user_type", label: "Type" },
                    { key: "status", label: "Status" },
                    { key: "budget_range", label: "Budget" },
                    { key: "created_at", label: "Created" },
                    { key: "actions", label: "Actions" }
                  ]}
                  data={getFilteredRequests().map((request) => ({
                    title: (
                      <div>
                        <div className="font-medium text-n-1">{request.title}</div>
                        <div className="text-sm text-n-4 truncate max-w-xs">
                          {request.description}
                        </div>
                      </div>
                    ),
                    client: request.client?.username || "N/A",
                    user_type: (
                      <span className="px-2 py-1 bg-n-7 rounded text-xs">
                        {request.user_type?.toUpperCase()}
                      </span>
                    ),
                    status: getStatusBadge(request.status),
                    budget_range: request.budget_range || "N/A",
                    created_at: formatDate(request.created_at),
                    actions: (
                      <div className="flex gap-1">
                        <Button size="sm" icon={<Eye size={14} />} />
                        <Button size="sm" icon={<Edit size={14} />} variant="secondary" />
                        {request.status === 'approved' && !request.converted_project && (
                          <Button 
                            size="sm" 
                            onClick={() => handleConvertRequest(request.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Convert
                          </Button>
                        )}
                      </div>
                    )
                  }))}
                />
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && (
          (activeTab === "projects" && getFilteredProjects().length === 0) ||
          (activeTab === "requests" && getFilteredRequests().length === 0)
        ) && (
          <div className="text-center py-12">
            <div className="text-n-4 mb-4">
              {activeTab === "projects" ? "No projects found" : "No requests found"}
            </div>
            <Button icon={<Plus size={16} />}>
              {activeTab === "projects" ? "Create Project" : "View All Requests"}
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectsManagement;
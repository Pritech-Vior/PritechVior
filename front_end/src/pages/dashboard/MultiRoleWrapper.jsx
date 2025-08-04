import React from "react";
import { useLocation } from "react-router-dom";
import ClientDashboard from "./client/ClientDashboardSimple";
import DesignerDashboard from "./designer/DesignerDashboardSimple";
import TechnicianDashboard from "./technician/TechnicianDashboardSimple";
import WriterDashboard from "./writer/WriterDashboardSimple";
import MultiRoleDashboard from "./multirole/MultiRoleDashboard";

// This component demonstrates multi-role functionality
// In a real application, you would get user roles from authentication/API
const MultiRoleWrapper = () => {
  const location = useLocation();
  
  // Example user with multiple roles - this would come from your auth system
  const exampleUserRoles = ["client", "designer", "technician", "writer"];
  
  // Determine which dashboard to show based on the current path
  const currentPath = location.pathname;
  
  if (currentPath.startsWith("/multirole")) {
    return <MultiRoleDashboard userRoles={exampleUserRoles} />;
  } else if (currentPath.startsWith("/client")) {
    return <ClientDashboard userRoles={exampleUserRoles} />;
  } else if (currentPath.startsWith("/designer")) {
    return <DesignerDashboard userRoles={exampleUserRoles} />;
  } else if (currentPath.startsWith("/technician")) {
    return <TechnicianDashboard userRoles={exampleUserRoles} />;
  } else if (currentPath.startsWith("/writer")) {
    return <WriterDashboard userRoles={exampleUserRoles} />;
  }
  
  // Default to multi-role dashboard
  return <MultiRoleDashboard userRoles={exampleUserRoles} />;
};

export default MultiRoleWrapper;

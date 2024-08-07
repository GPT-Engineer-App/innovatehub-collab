import { Home, Kanban, FileText, FolderKanban } from "lucide-react";
import Index from "./pages/Index.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Projects",
    to: "/projects",
    icon: <Kanban className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Documents",
    to: "/documents",
    icon: <FileText className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Files",
    to: "/files",
    icon: <FolderKanban className="h-4 w-4" />,
    page: <Index />,
  },
];

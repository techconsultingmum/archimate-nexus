import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  Grid3X3,
  FileText,
  GitBranch,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  Database,
  AppWindow,
  Server,
  Target,
  Users,
  Shield,
  Landmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const frameworkItems = [
  { title: "TOGAF ADM", url: "/togaf", icon: Layers },
  { title: "Zachman Matrix", url: "/zachman", icon: Grid3X3 },
  { title: "DoDAF", url: "/dodaf", icon: Shield },
  { title: "FEAF", url: "/feaf", icon: Landmark },
];

const repositoryItems = [
  { title: "Business", url: "/repository/business", icon: Building2 },
  { title: "Data", url: "/repository/data", icon: Database },
  { title: "Application", url: "/repository/application", icon: AppWindow },
  { title: "Technology", url: "/repository/technology", icon: Server },
];

const toolItems = [
  { title: "Diagrams", url: "/diagrams", icon: GitBranch },
  { title: "Requirements", url: "/requirements", icon: Target },
  { title: "Governance", url: "/governance", icon: Shield },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ item }: { item: typeof frameworkItems[0] }) => {
    const content = (
      <NavLink
        to={item.url}
        className={cn(
          "nav-link",
          isActive(item.url) && "active"
        )}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        {!collapsed && <span>{item.title}</span>}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.title}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Layers className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">EA Tool</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center mx-auto">
            <Layers className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {/* Dashboard */}
        <div className="space-y-1">
          <NavItem item={{ title: "Dashboard", url: "/", icon: LayoutDashboard }} />
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Frameworks */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
              Frameworks
            </p>
          )}
          {frameworkItems.map((item) => (
            <NavItem key={item.url} item={item} />
          ))}
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Repository */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
              Repository
            </p>
          )}
          {repositoryItems.map((item) => (
            <NavItem key={item.url} item={item} />
          ))}
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Tools */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
              Tools
            </p>
          )}
          {toolItems.map((item) => (
            <NavItem key={item.url} item={item} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <NavItem item={{ title: "Settings", url: "/settings", icon: Settings }} />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}

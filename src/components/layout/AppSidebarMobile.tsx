import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  Grid3X3,
  FileText,
  GitBranch,
  Settings,
  Building2,
  Database,
  AppWindow,
  Server,
  Target,
  Users,
  Shield,
  Landmark,
  Brain,
  Cloud,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  { title: "AI", url: "/repository/ai", icon: Brain },
  { title: "Cloud", url: "/repository/cloud", icon: Cloud },
];

const toolItems = [
  { title: "Diagrams", url: "/diagrams", icon: GitBranch },
  { title: "Requirements", url: "/requirements", icon: Target },
  { title: "Governance", url: "/governance", icon: Shield },
];

const roleItems = [
  { title: "Role Dashboard", url: "/roles", icon: UserCircle },
  { title: "User Management", url: "/users", icon: Users },
];

interface AppSidebarMobileProps {
  onNavigate?: () => void;
}

export function AppSidebarMobile({ onNavigate }: AppSidebarMobileProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ item }: { item: typeof frameworkItems[0] }) => (
    <NavLink
      to={item.url}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        isActive(item.url) 
          ? "bg-primary text-primary-foreground" 
          : "text-foreground/70 hover:text-foreground hover:bg-muted"
      )}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      <span>{item.title}</span>
    </NavLink>
  );

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Layers className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-foreground text-sm">EA Tool</span>
            <span className="text-[10px] text-muted-foreground">Enterprise Architecture</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4 px-3">
        <div className="space-y-4">
          {/* Dashboard */}
          <div className="space-y-1">
            <NavItem item={{ title: "Dashboard", url: "/", icon: LayoutDashboard }} />
          </div>

          <Separator />

          {/* Frameworks */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Frameworks
            </p>
            {frameworkItems.map((item) => (
              <NavItem key={item.url} item={item} />
            ))}
          </div>

          <Separator />

          {/* Repository */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Repository
            </p>
            {repositoryItems.map((item) => (
              <NavItem key={item.url} item={item} />
            ))}
          </div>

          <Separator />

          {/* Roles */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Roles
            </p>
            {roleItems.map((item) => (
              <NavItem key={item.url} item={item} />
            ))}
          </div>

          <Separator />

          {/* Tools */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Tools
            </p>
            {toolItems.map((item) => (
              <NavItem key={item.url} item={item} />
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <NavItem item={{ title: "Settings", url: "/settings", icon: Settings }} />
      </div>
    </div>
  );
}

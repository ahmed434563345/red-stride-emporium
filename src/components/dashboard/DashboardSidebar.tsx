import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Plus, Store, Bell, MessageCircle, Settings, ChevronLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadNotifications: number;
  unreadMessages: number;
  collapsed: boolean;
  onToggle: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const DashboardSidebar = ({
  activeTab,
  onTabChange,
  unreadNotifications,
  unreadMessages,
  collapsed,
  onToggle,
  onClose,
  isMobile = false
}: DashboardSidebarProps) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'add-product', label: 'Add Product', icon: Plus },
    { id: 'store', label: 'Store Settings', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
    { id: 'messages', label: 'Messages', icon: MessageCircle, badge: unreadMessages },
  ];

  return (
    <div
      className={cn(
        "h-full bg-card border-r flex flex-col transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64",
        isMobile && "shadow-xl"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && <h2 className="font-semibold text-lg">Dashboard</h2>}
        <div className="flex items-center gap-2">
          {isMobile ? (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
              <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onTabChange(item.id);
              if (isMobile && onClose) onClose();
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent group",
              activeTab === item.id && "bg-primary text-primary-foreground hover:bg-primary/90",
              collapsed && "justify-center px-2"
            )}
          >
            <item.icon className={cn("h-5 w-5 flex-shrink-0", activeTab === item.id ? "animate-fade-in" : "")} />
            {!collapsed && (
              <>
                <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                {item.badge > 0 && (
                  <Badge className="h-5 min-w-5 px-1 text-xs animate-zoom-in">{item.badge}</Badge>
                )}
              </>
            )}
            {collapsed && item.badge > 0 && (
              <div className="absolute right-0 top-0 h-2 w-2 bg-red-500 rounded-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground">
            Vendor Dashboard v2.0
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardSidebar;
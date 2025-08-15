
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, Search, User, List, LogIn, ChevronDown, Building, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { notificationService, NotificationCounts } from '@/services/notificationService';
import { NavNotificationBadge, DropdownNotificationBadge } from '@/components/ui/NotificationBadge';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [notificationCounts, setNotificationCounts] = useState<NotificationCounts>({
    homeOwnerApplications: 0,
    artisanApplications: 0,
    propertyVerifications: 0,
    maintenanceRequests: 0,
    payments: 0,
    reports: 0
  });

  useEffect(() => {
    // Fetch initial notification counts
    notificationService.fetchNotificationCounts();
    
    // Subscribe to notification updates
    const unsubscribe = notificationService.subscribe((counts) => {
      setNotificationCounts(counts);
    });

    return unsubscribe;
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-ghana-primary flex items-center justify-center">
            <Home className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-ghana-primary">GhanaHomes</span>
        </Link>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks notificationCounts={notificationCounts} />
          <Button asChild variant="default" className="bg-ghana-primary hover:bg-ghana-primary/90">
            <Link to="/submit-listing">Submit Listing</Link>
          </Button>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          "fixed inset-x-0 top-[57px] bg-white border-b z-30 transition-all duration-300 ease-in-out md:hidden",
          isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          <nav className="flex flex-col gap-4">
            <NavLinks mobile notificationCounts={notificationCounts} />
          </nav>
          <Button asChild className="w-full bg-ghana-primary hover:bg-ghana-primary/90">
            <Link to="/submit-listing">Submit Listing</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

const NavLinks = ({ mobile = false, notificationCounts }: { mobile?: boolean; notificationCounts: NotificationCounts }) => {
  const links = [
    { href: "/", text: "Home", icon: <Home size={mobile ? 20 : 16} /> },
    { href: "/search", text: "Find Properties", icon: <Search size={mobile ? 20 : 16} /> },
    { isDropdown: true, text: "Home Owners", icon: <User size={mobile ? 20 : 16} />, notificationCount: notificationCounts.homeOwnerApplications },
    { href: "/artisans", text: "Artisans", icon: <List size={mobile ? 20 : 16} /> },
    { isDropdown: true, text: "Management", icon: <Building size={mobile ? 20 : 16} />, notificationCount: notificationCounts.artisanApplications },
  ];

  return (
    <>
      {links.map((link) => {
        if (link.isDropdown && link.text === "Home Owners") {
          return (
            <div key={link.text} className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger className={cn(
                  "flex items-center gap-2 text-gray-600 hover:text-ghana-primary transition-colors",
                  mobile ? "text-base py-2" : "text-sm font-medium"
                )}>
                  {link.icon}
                  <span>{link.text}</span>
                  <NavNotificationBadge count={link.notificationCount || 0} />
                  <ChevronDown size={mobile ? 18 : 14} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align={mobile ? "start" : "end"} className="bg-white border shadow-md">
                  <DropdownMenuItem asChild>
                    <Link to="/home-owner-login" className="flex items-center gap-2 w-full cursor-pointer">
                      <LogIn size={16} />
                      <span>Home Owner Login</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/apply-home-owner" className="flex items-center gap-2 w-full cursor-pointer">
                      <User size={16} />
                      <span>Register as Home Owner</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin-dashboard?tab=applications" className="flex items-center gap-2 w-full cursor-pointer">
                      <List size={16} />
                      <span>Applications</span>
                      <DropdownNotificationBadge count={notificationCounts.homeOwnerApplications} />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin-dashboard?tab=agents" className="flex items-center gap-2 w-full cursor-pointer">
                      <User size={16} />
                      <span>Manage</span>
                      <DropdownNotificationBadge count={notificationCounts.propertyVerifications} />
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        }
        if (link.isDropdown && link.text === "Management") {
          return (
            <div key={link.text} className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger className={cn(
                  "flex items-center gap-2 text-gray-600 hover:text-ghana-primary transition-colors",
                  mobile ? "text-base py-2" : "text-sm font-medium"
                )}>
                  {link.icon}
                  <span>{link.text}</span>
                  <NavNotificationBadge count={link.notificationCount || 0} />
                  <ChevronDown size={mobile ? 18 : 14} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align={mobile ? "start" : "end"} className="bg-white border shadow-md">
                  <DropdownMenuItem asChild>
                    <Link to="/estate-login" className="flex items-center gap-2 w-full cursor-pointer">
                      <Building size={16} />
                      <span>Estate Management</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/staff-login" className="flex items-center gap-2 w-full cursor-pointer">
                      <UserCog size={16} />
                      <span>Staff Login</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/super-admin-login" className="flex items-center gap-2 w-full cursor-pointer">
                      <User size={16} />
                      <span>Admin Login</span>
                      <DropdownNotificationBadge count={notificationCounts.artisanApplications} />
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        }
        return (
          <Link
            key={link.href}
            to={link.href}
            className={cn(
              "flex items-center gap-2 text-gray-600 hover:text-ghana-primary transition-colors",
              mobile ? "text-base py-2" : "text-sm font-medium"
            )}
          >
            {link.icon}
            {link.text}
          </Link>
        );
      })}
    </>
  );
};

export default Navbar;

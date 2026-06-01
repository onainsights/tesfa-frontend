"use client";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { RiSidebarFoldLine } from "react-icons/ri";
import { HiSquares2X2 } from "react-icons/hi2";
import { LuClock3, LuClipboardList, LuUser, LuLogOut, LuChartBar } from "react-icons/lu";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, label, isOpen, active, onClick }: SidebarItemProps) => {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-full flex items-center gap-4 px-4 py-3 transition-all duration-200
        text-sm font-medium border-none cursor-pointer rounded-lg
        ${active
          ? "bg-primary text-white"
          : "text-gray-500 hover:bg-primary-light hover:text-primary-dark"
        }`}
    >
      <div className="flex justify-center w-6 shrink-0">{icon}</div>
      <span
        className="whitespace-nowrap overflow-hidden transition-all duration-200 text-sm font-medium"
        style={{
          opacity: isOpen ? 1 : 0,
          maxWidth: isOpen ? "10rem" : "0",
        }}
      >
        {label}
      </span>
    </button>
  );
};

const LogoutConfirmModal = ({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000]">
    <div className="p-8 max-w-sm w-full bg-surface rounded-2xl shadow-2xl">
      <h2 className="text-lg font-bold text-primary-dark mb-2">
        Confirm Logout
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Are you sure you want to logout?
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 cursor-pointer transition-colors bg-surface-tertiary text-gray-500 rounded-lg text-sm font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-5 py-2.5 cursor-pointer text-white transition-colors rounded-lg text-sm font-medium bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
);

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  const handleLogoutClick = () => setShowLogoutConfirm(true);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("authToken");
    router.push("/onboarding/login");
    setShowLogoutConfirm(false);
  };

  const handleLogoutCancel = () => setShowLogoutConfirm(false);

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          data-testid="mobile-open-button"
          className="p-2.5 text-white transition-colors cursor-pointer rounded-lg bg-primary"
          onClick={() => setIsMobileOpen(true)}
        >
          <RiSidebarFoldLine size={24} />
        </button>
      </div>

      {/* Desktop expand button — sits on the right border of the collapsed sidebar */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="hidden lg:flex fixed top-6 w-7 h-7 items-center justify-center shadow-sm border cursor-pointer transition-all z-[1170]
                     bg-surface border-border text-primary rounded-full"
          style={{ left: "calc(4.5rem - 0.875rem)" }}
          title="Expand sidebar"
          aria-label="Expand sidebar"
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 h-screen flex flex-col transition-all duration-300
        ${isMobileOpen ? "w-64 py-6 px-3" : "w-0 p-0 overflow-hidden"}
        lg:relative lg:flex
        ${isOpen ? "lg:w-64 lg:py-6 lg:px-4" : "lg:w-[4.5rem] lg:py-6 lg:px-2"}`}
        style={{
          background: "var(--color-primary-light)",
          borderRight: "1px solid var(--color-border)",
        }}
      >
        {/* Header row: logo + brand + toggle */}
        <div className="flex items-center justify-between mb-10 px-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 shrink-0 flex items-center justify-center">
              <Image
                src="/Images/Group 184.png"
                alt="Tesfa"
                width={36}
                height={36}
                className="rounded-full"
              />
            </div>
            <span
              className="font-bold whitespace-nowrap overflow-hidden transition-all duration-200 text-primary text-lg"
              style={{
                opacity: isOpen || isMobileOpen ? 1 : 0,
                maxWidth: isOpen || isMobileOpen ? "10rem" : "0",
              }}
            >
              Tesfa
            </span>
          </div>
          <button
            data-testid="mobile-close-button"
            className="lg:hidden flex items-center justify-center w-9 h-9 text-gray-400 hover:text-primary-dark hover:bg-primary/10 transition-colors cursor-pointer rounded-md"
            onClick={() => setIsMobileOpen(false)}
          >
            <RiSidebarFoldLine size={22} />
          </button>
          <button
            data-testid="desktop-toggle-button"
            className="hidden lg:flex items-center justify-center w-9 h-9 text-gray-400 hover:text-primary-dark hover:bg-primary/10 transition-colors cursor-pointer rounded-md"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          <SidebarItem
            icon={<HiSquares2X2 size={20} />}
            label="Dashboard"
            isOpen={isOpen || isMobileOpen}
            active={pathname === "/dashboard" || pathname === "/"}
            onClick={() => handleNavigation("/dashboard")}
          />
          <SidebarItem
            icon={<LuChartBar size={20} />}
            label="Report"
            isOpen={isOpen || isMobileOpen}
            active={pathname === "/report"}
            onClick={() => handleNavigation("/report")}
          />
          <SidebarItem
            icon={<LuClipboardList size={20} />}
            label="Interventions"
            isOpen={isOpen || isMobileOpen}
            active={pathname === "/tasks"}
            onClick={() => handleNavigation("/tasks")}
          />
          <SidebarItem
            icon={<LuClock3 size={20} />}
            label="Tracker"
            isOpen={isOpen || isMobileOpen}
            active={pathname === "/kanban"}
            onClick={() => handleNavigation("/kanban")}
          />
          <SidebarItem
            icon={<LuUser size={20} />}
            label="Profile"
            isOpen={isOpen || isMobileOpen}
            active={pathname === "/profile"}
            onClick={() => handleNavigation("/profile")}
          />
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom section */}
        <div className="flex flex-col shrink-0">
          <div className="mb-2">
            <SidebarItem
              icon={<LuLogOut size={20} />}
              label="Logout"
              isOpen={isOpen || isMobileOpen}
              active={false}
              onClick={handleLogoutClick}
            />
          </div>
        </div>
      </aside>

      {showLogoutConfirm &&
        typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <LogoutConfirmModal
            onCancel={handleLogoutCancel}
            onConfirm={handleLogoutConfirm}
          />,
          document.body
        )}
    </>
  );
};

export default Sidebar;

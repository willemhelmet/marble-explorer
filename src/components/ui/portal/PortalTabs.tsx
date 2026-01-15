export type Tab = "connect" | "generate" | "manage";

interface PortalTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  showManage: boolean;
}

export const PortalTabs = ({ activeTab, onTabChange, showManage }: PortalTabsProps) => {
  const getTabClass = (tabName: Tab) => {
    const baseClass = "flex-1 py-3 font-mono text-sm font-bold uppercase transition-colors";
    const activeClass = "bg-white text-black";
    const inactiveClass = "bg-black text-neutral-500 hover:bg-neutral-900 hover:text-white";
    
    return `${baseClass} ${activeTab === tabName ? activeClass : inactiveClass}`;
  };

  return (
    <div className="flex border-b border-neutral-800">
      <button
        onClick={() => onTabChange("connect")}
        className={getTabClass("connect")}
      >
        Connect
      </button>
      <button
        onClick={() => onTabChange("generate")}
        className={getTabClass("generate")}
      >
        Generate
      </button>
      {showManage && (
        <button
          onClick={() => onTabChange("manage")}
          className={getTabClass("manage")}
        >
          Manage
        </button>
      )}
    </div>
  );
};

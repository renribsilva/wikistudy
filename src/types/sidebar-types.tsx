export type SidebarContextType = {
  // Estados
  isMobile: boolean;
  isSemiMobile: boolean;
  windowWidth: number | null;
  isExpanded: boolean;
  isMobileOpen: boolean;
  // Funções
  toggleExpandSidebar: () => void;
  toggleHeaderSidebar: () => void;
};

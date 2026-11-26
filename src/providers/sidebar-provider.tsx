"use client";

import { SidebarContextType } from "@/types/sidebar-types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isSemiMobile, setIsSemiMobile] = useState<boolean>(false);

  // Inicia expandido por padrão
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = (): void => {
      const width = window.innerWidth;
      const mobile = width <= 720;
      const semiMobile = width > 720 && width <= 900;

      setWindowWidth(width);
      setIsMobile(mobile);
      setIsSemiMobile(semiMobile);

      // Se entrar em semi-mobile, ajusta para recolhido (68px); em desktop (>900px), expande (250px)
      if (semiMobile) {
        setIsExpanded(false);
      } else if (!mobile) {
        setIsExpanded(true);
      }

      if (!mobile) {
        setIsMobileOpen(false);
        document.body.style.overflow = "unset";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "unset";
    };
  }, []);

  const toggleExpandSidebar = (): void => {
    if (isMobile) return;
    setIsExpanded((prev) => !prev);
  };

  const toggleHeaderSidebar = (): void => {
    setIsMobileOpen((prev) => {
      const newState = !prev;
      document.body.style.overflow = newState ? "hidden" : "unset";
      return newState;
    });
  };

  const effectiveExpanded = isMobile ? false : isExpanded;

  console.log("IsMobile", isMobile);
  console.log("IsSemiMobile", isSemiMobile);
  console.log("isExpanded", isExpanded);
  console.log("isMobileOpen", isMobileOpen);

  return (
    <SidebarContext.Provider
      value={{
        windowWidth,
        isMobile,
        isSemiMobile,
        isExpanded: effectiveExpanded,
        isMobileOpen,
        toggleExpandSidebar,
        toggleHeaderSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

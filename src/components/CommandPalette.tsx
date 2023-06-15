import { useEffect, useRef, useState } from "react";
import _Notification, { useNotification } from "./Notification";
import type { NinjaKeys as _NinjaKeys } from "ninja-keys";
import { create } from "zustand";
import "./ninjakeys.css";
import { AngleIcon } from "@radix-ui/react-icons";

// Fixing the NinjaKeys type
// https://github.com/ssleptsov/ninja-keys#data

// Repo not maintained anymore, so maybe fork in the future

// Nesting is bugged, avoid it for now (use the grouping feature for now)

type NinjaKeys = Omit<_NinjaKeys, "data"> & { data: NinjaAction[] };

type NinjaAction = {
  id: string;
  title: string;
  hotkey?: string;
  mdIcon?: string;
  handler?: () => void;
  icon?: string;
  keywords?: string;
  section?: string;
  // parent?: string;
  // children?: NinjaAction[];
};

const useNotificationStore = create<{
  hotkeys: NinjaKeys["data"];
}>((set) => ({
  hotkeys: [
    // Search
    {
      id: "Advance Filter",
      title: "Advance Filter With Query Syntax",
      hotkey: "cmd+p",
      section: 'Search',
      handler: () => {},
      // https://github.com/ssleptsov/ninja-keys#icons
      // mdIcon: "",
    },
    {
      id: "Manage Columns",
      title: "Reorder/Show/Hide Table Columns",
      section: 'Table',
      handler: () => {},
    },
    // Layout
    {
      id: "Table Only",
      title: "Switch to Table Only Layout",
      section: 'Layout',
      hotkey: "cmd+1",
      handler: () => {},
    },
    {
      id: "Image Feed",
      title: "Switch to Image Feed Layout",
      section: 'Layout',
      hotkey: "cmd+2",
      handler: () => {},
    },
    {
      id: "Two Column",
      title: "Switch to Two Column Layout",
      section: 'Layout',
      hotkey: "cmd+3",
      handler: () => {},
    },
    // Theme
    // {
    //   id: "Light Theme",
    //   title: "Switch to Light Theme",
    //   keywords: "theme",
    //   section: 'Theme',
    //   parent: "Theme",
    //   handler: () => {},
    // },
    // {
    //   id: "Dark Theme",
    //   title: "Switch to Dark Theme",
    //   keywords: "theme",
    //   section: 'Theme',
    //   parent: "Theme",
    //   handler: () => {},
    // },
    // Settings
    {
      id: "Settings",
      title: "Open Settings",
      section: 'Settings',
      handler: () => {},
    },
  ],
}));

const CommandPalette = () => {
  const showNotification = useNotification();

  // Reference to the "ninja-keys" element
  const ninjaKeys = useRef<NinjaKeys>(null);
  const { hotkeys } = useNotificationStore((state) => state);

  useEffect(() => {
    if (!ninjaKeys.current) {
      showNotification("Error", "Command palette fail to load");
      return;
    }
    ninjaKeys.current.data = hotkeys;
  }, []);

  // @ts-ignore
  return <ninja-keys ref={ninjaKeys} />;
};

export default CommandPalette;
import { useMemo } from "react";
import { open } from "@tauri-apps/api/shell";
import SettingsDialog from "./singleton/settings";
import "ninja-keys";
import _Notification from "./singleton/Notification";
import { useNotification } from "./singleton/Notification/Store";
import * as RadixToast from "@radix-ui/react-toast";
import CommandPalette from "./singleton/commandPalette";
import { useCommandPalette } from "./singleton/commandPalette/Store";
import { Component1Icon, GitHubLogoIcon } from "@radix-ui/react-icons";
import RootContextMenu from "./singleton/rootContextMenu";
import WorkspaceManager from "./workspace";
import HelpTooltip, { HelpTooltipProvider } from "./components/HelpTooltip";
import WorkspaceNav from "./workspace/Nav";

// TODO: add transitions
// TODO: configure logger

const Nav = () => {
  const showCommandPalette = useCommandPalette();

  return (
    <HelpTooltipProvider>
      <div className="fixed top-3 right-5 flex flex-row gap-3">
        <WorkspaceNav />

        <HelpTooltip description="GitHub">
          <button
            className="naviconbutton-with-border"
            onClick={(e) =>
              open("https://github.com/artizon-io/stable-diffusion-metadata-ui")
            }
          >
            <GitHubLogoIcon />
          </button>
        </HelpTooltip>
        <HelpTooltip description="Command Palette">
          <button
            className="naviconbutton-with-border"
            onClick={showCommandPalette}
          >
            <Component1Icon />
          </button>
        </HelpTooltip>
        {/* TODO: fix tooltip not showing */}
        <HelpTooltip description="Settings">
          <SettingsDialog />
        </HelpTooltip>
      </div>
    </HelpTooltipProvider>
  );
};

function App() {
  const Notification = useMemo(() => _Notification, []);

  const showNotification = useNotification();

  return (
    <RadixToast.Provider swipeDirection="right">
      {/* TODO: make a notification stack */}
      <RadixToast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-[390px] max-w-[100vw] list-none z-10 outline-none" />
      <Notification />
      <CommandPalette />
      <RootContextMenu>
        <WorkspaceManager />
      </RootContextMenu>
      <Nav />
    </RadixToast.Provider>
  );
}

export default App;

import { FC, PropsWithChildren, useEffect, useMemo } from "react";
import * as Menubar from "@radix-ui/react-menubar";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Panel } from "reactflow";
import { twMerge } from "tailwind-merge";
import { create } from "zustand";
import { useGraphStore } from "./Store";
import { useRootContextMenuStore } from "../../singleton/rootContextMenu/Store";
import { useCommandPaletteStore } from "../../singleton/commandPalette/Store";
import { tailwind } from "../../utils/tailwind";

const menuStyles = tailwind`min-w-[200px] bg-neutral-900 rounded-md overflow-hidden px-1 py-2 border-neutral-800 border-[1px] flex flex-col`;
const menuItemStyles = tailwind`flex flex-row justify-between items-center rounded-sm hover:bg-neutral-800 text-neutral-300 hover:text-neutral-50 border-none hover:border-none px-3 py-1.5 shadow-none hover:outline-none`;
const menuItemLabelStyles = tailwind`text-inherit text-s pointer-events-none border-none`;

// TODO: refactor this with RootContextMenu

const SubMenu: FC<
  PropsWithChildren<{
    itemConfig: MenuItemConfig;
  }>
> = ({ itemConfig }) => {
  if (itemConfig.subItemConfigs)
    return (
      <Menubar.Sub>
        <Menubar.SubTrigger className={menuItemStyles}>
          <p className={menuItemLabelStyles}>{itemConfig.label}</p>
          <ChevronRightIcon className="text-neutral-300" />
        </Menubar.SubTrigger>
        <Menubar.Portal>
          <Menubar.SubContent
            className={menuStyles}
            sideOffset={5}
            alignOffset={-3}
          >
            {itemConfig.subItemConfigs.map((subItem) => (
              <SubMenu key={subItem.label} itemConfig={subItem} />
            ))}
          </Menubar.SubContent>
        </Menubar.Portal>
      </Menubar.Sub>
    );
  else return <MenuItem itemConfig={itemConfig} />;
};

const MenuItem: FC<{ itemConfig: MenuItemConfig }> = ({ itemConfig }) => (
  <Menubar.Item className={menuItemStyles} onClick={itemConfig.handler}>
    <p className={menuItemLabelStyles}>{itemConfig.label}</p>
    <div />
  </Menubar.Item>
);

const Separator = () => <Menubar.Separator className={menuItemStyles} />;

type MenuItemConfig = {
  label: string;
  handler?: () => void;
  subItemConfigs?: MenuItemConfig[];
};

const useGraphToolboxMenuStore = create<{
  menuItemConfigs: MenuItemConfig[];
  addMenuItemConfig: (menuItemConfig: MenuItemConfig) => void;
  addMenuItemConfigs: (menuItemConfigs: MenuItemConfig[]) => void;
}>((set) => ({
  // TODO: genericaly derive the menu items and handlers
  menuItemConfigs: [
    {
      label: "Renderer",
      subItemConfigs: [
        {
          label: "Automatic 1111",
          handler: () => useGraphStore.getState().createNode("automatic-1111"),
        },
      ],
    },
    {
      label: "Model",
      subItemConfigs: [
        {
          label: "Model",
          handler: () => useGraphStore.getState().createNode("model"),
        },
      ],
    },
    {
      label: "Sampler",
      subItemConfigs: [
        {
          label: "Sampler",
          handler: () => useGraphStore.getState().createNode("sampler"),
        },
      ],
    },
    {
      label: "Primitive",
      subItemConfigs: [
        {
          label: "Number",
          handler: () => useGraphStore.getState().createNode("number"),
        },
        {
          label: "Number Pair",
          handler: () => useGraphStore.getState().createNode("number-pair"),
        },
        {
          label: "String",
          handler: () => useGraphStore.getState().createNode("string"),
        },
        {
          label: "String Number Map",
          handler: () =>
            useGraphStore.getState().createNode("string-number-map"),
        },
      ],
    },
    {
      label: "Image",
      subItemConfigs: [
        {
          label: "Image",
          handler: () => useGraphStore.getState().createNode("image"),
        },
        {
          label: "Image Metadata",
          handler: () => useGraphStore.getState().createNode("image-metadata"),
        },
      ],
    },
    {
      label: "Lora",
      subItemConfigs: [
        {
          label: "Lora Number Map",
          handler: () => useGraphStore.getState().createNode("lora-number-map"),
        },
      ],
    },
    {
      label: "Output",
      subItemConfigs: [
        {
          label: "Image",
          handler: () => useGraphStore.getState().createNode("image-output"),
        },
        {
          label: "Text",
          handler: () => useGraphStore.getState().createNode("string-output"),
        },
      ],
    },
    {
      label: "Add Operator",
      subItemConfigs: [
        {
          label: "String",
          handler: () => useGraphStore.getState().createNode("add-string"),
        },
        {
          label: "Number",
          handler: () => useGraphStore.getState().createNode("add-number"),
        },
        {
          label: "Number Pair",
          handler: () => useGraphStore.getState().createNode("add-number-pair"),
        },
        {
          label: "String Number Map",
          handler: () =>
            useGraphStore.getState().createNode("add-string-number-map"),
        },
        {
          label: "Lora Number Map",
          handler: () =>
            useGraphStore.getState().createNode("add-lora-number-map"),
        },
      ],
    },
    {
      label: "Subtract Operator",
      subItemConfigs: [
        {
          label: "String",
          handler: () => useGraphStore.getState().createNode("subtract-string"),
        },
        {
          label: "Number",
          handler: () => useGraphStore.getState().createNode("subtract-number"),
        },
        {
          label: "Number Pair",
          handler: () =>
            useGraphStore.getState().createNode("subtract-number-pair"),
        },
        {
          label: "String Number Map",
          handler: () =>
            useGraphStore.getState().createNode("subtract-string-number-map"),
        },
        {
          label: "Lora Number Map",
          handler: () =>
            useGraphStore.getState().createNode("subtract-lora-number-map"),
        },
      ],
    },
  ],
  addMenuItemConfig: (menuItemConfig) =>
    set((state) => ({
      ...state,
      menuItemConfigs: [...state.menuItemConfigs, menuItemConfig],
    })),
  addMenuItemConfigs: (menuItemConfigs) =>
    set((state) => ({
      ...state,
      menuItemConfigs: [...state.menuItemConfigs, ...menuItemConfigs],
    })),
}));

const GraphToolbox: FC<{}> = ({}) => {
  const menuItemConfigs = useGraphToolboxMenuStore(
    (state) => state.menuItemConfigs
  );

  const getHandlers = useMemo(
    () =>
      (menuItemConfigs: MenuItemConfig[]): MenuItemConfig[] =>
        menuItemConfigs.reduce((acc: MenuItemConfig[], item) => {
          if (item.handler) acc.push(item);
          else
            acc = acc.concat(
              getHandlersRecursive(item.label, item.subItemConfigs!)
            );

          return acc;
        }, []),
    [menuItemConfigs]
  );

  const getHandlersRecursive = (
    currentScope: string,
    subMenuItemConfigs: MenuItemConfig[]
  ): MenuItemConfig[] =>
    subMenuItemConfigs.reduce((acc: MenuItemConfig[], item) => {
      if (item.handler)
        acc.push({
          ...item,
          label: `${currentScope} > ${item.label}`,
        });
      else
        acc = acc.concat(
          getHandlersRecursive(
            `${currentScope} > ${item.label}`,
            item.subItemConfigs!
          )
        );

      return acc;
    }, []);

  // Append the menu items also to the root context menu
  useEffect(() => {
    // Very convenient that both MenuItemConfig type matches
    useRootContextMenuStore.getState().addMenuItemConfigs(menuItemConfigs);

    useCommandPaletteStore.getState().addActions(
      getHandlers(menuItemConfigs).map((item) => ({
        id: item.label,
        title: item.label,
        handler: item.handler,
        section: "Graph",
      }))
    );

    // When unmount, remove the menu items
    return () => {
      useRootContextMenuStore
        .getState()
        .removeMenuItemConfigs(menuItemConfigs.map((item) => item.label));

      useCommandPaletteStore
        .getState()
        .removeActions(getHandlers(menuItemConfigs).map((item) => item.label));
    };
  }, []);

  return (
    <Panel position={"top-left"}>
      <Menubar.Root className="flex flex-row bg-neutral-800 rounded-md overflow-hidden">
        {menuItemConfigs.map((item) => (
          <Menubar.Menu key={item.label}>
            <Menubar.Trigger
              className={twMerge(
                menuItemStyles,
                "text-neutral-400 hover:text-neutral-300"
              )}
              onClick={item.handler}
            >
              <p className={menuItemLabelStyles}>{item.label}</p>
              <div />
            </Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content
                className={menuStyles}
                align="start"
                sideOffset={5}
                alignOffset={-3}
              >
                {item.subItemConfigs!.map((subItem) => (
                  <SubMenu key={subItem.label} itemConfig={subItem} />
                ))}
              </Menubar.Content>
            </Menubar.Portal>
          </Menubar.Menu>
        ))}
      </Menubar.Root>
    </Panel>
  );
};

export default GraphToolbox;

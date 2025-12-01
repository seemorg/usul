"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
  ChevronRightIcon,
  ChevronsDownIcon,
  ChevronsUpIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Accordion as AccordionPrimitive,
  Direction as DirectionPrimitive,
} from "radix-ui";

const treeVariants = cva(
  "group before:bg-accent/70 before:absolute before:-z-10 before:h-[2.8rem] before:w-full before:rounded-lg before:opacity-0 hover:before:opacity-100",
  {
    variants: {
      dir: {
        rtl: "before:right-0",
        ltr: "before:left-0",
      },
    },
  },
);

const selectedTreeVariants = cva(
  "before:bg-primary-foreground/30 text-primary before:opacity-100",
);

interface TreeDataItem {
  id: string;
  name: string;
  page?: number;
  icon?: any;
  selectedIcon?: any;
  openIcon?: any;
  children?: TreeDataItem[];
  actions?: React.ReactNode;
  onClick?: () => void;
}

type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
  data: TreeDataItem[] | TreeDataItem;
  initialSelectedItemId?: string;
  onSelectChange?: (item: TreeDataItem | undefined) => void;
  expandAll?: boolean;
  defaultNodeIcon?: any;
  defaultLeafIcon?: any;
  dir?: "ltr" | "rtl";
};

const TreeView = ({
  data,
  initialSelectedItemId,
  onSelectChange,
  expandAll,
  defaultLeafIcon,
  defaultNodeIcon,
  className,
  dir = "ltr",
  ...props
}: TreeProps) => {
  const t = useTranslations();
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(
    initialSelectedItemId,
  );

  const handleSelectChange = useCallback(
    (item: TreeDataItem | undefined) => {
      setSelectedItemId(item?.id);
      if (onSelectChange) {
        onSelectChange(item);
      }
    },
    [onSelectChange],
  );

  // Collect all node IDs from the tree
  const allNodeIds = useMemo(() => {
    const ids: string[] = [];

    function collectNodeIds(items: TreeDataItem[] | TreeDataItem) {
      if (Array.isArray(items)) {
        items.forEach((item) => {
          if (item.children) {
            ids.push(item.id);
            collectNodeIds(item.children);
          }
        });
      } else if (items.children) {
        ids.push(items.id);
        collectNodeIds(items.children);
      }
    }

    collectNodeIds(data);
    return ids;
  }, [data]);

  // Initial expanded items based on selected item
  const initialExpandedItemIds = useMemo(() => {
    if (!initialSelectedItemId) {
      return [] as string[];
    }

    const ids: string[] = [];

    function walkTreeItems(
      items: TreeDataItem[] | TreeDataItem,
      targetId: string,
    ) {
      if (Array.isArray(items)) {
        for (let i = 0; i < items.length; i++) {
          ids.push(items[i]!.id);
          if (walkTreeItems(items[i]!, targetId) && !expandAll) {
            return true;
          }
          if (!expandAll) ids.pop();
        }
      } else if (!expandAll && items.id === targetId) {
        return true;
      } else if (items.children) {
        return walkTreeItems(items.children, targetId);
      }
    }

    walkTreeItems(data, initialSelectedItemId);
    return ids;
  }, [data, expandAll, initialSelectedItemId]);

  // Manage expanded state
  const [expandedItemIds, setExpandedItemIds] = useState<string[]>(
    initialExpandedItemIds,
  );

  // Update expanded items when initialSelectedItemId changes
  useEffect(() => {
    setExpandedItemIds(initialExpandedItemIds);
  }, [initialExpandedItemIds]);

  const handleExpandAll = useCallback(() => {
    setExpandedItemIds(allNodeIds);
  }, [allNodeIds]);

  const handleCollapseAll = useCallback(() => {
    setExpandedItemIds([]);
  }, []);

  const handleNodeExpandChange = useCallback(
    (nodeId: string, isExpanded: boolean) => {
      setExpandedItemIds((prev) => {
        if (isExpanded) {
          return prev.includes(nodeId) ? prev : [...prev, nodeId];
        } else {
          return prev.filter((id) => id !== nodeId);
        }
      });
    },
    [],
  );

  return (
    <DirectionPrimitive.DirectionProvider dir={dir}>
      <div className={cn("relative overflow-hidden", className)}>
        <div className="flex items-center justify-start gap-2 p-2 pb-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExpandAll}
            className="h-8 w-8 p-0"
            title={t("common.expand-all")}
          >
            <ChevronsDownIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCollapseAll}
            className="h-8 w-8 p-0"
            title={t("common.collapse-all")}
          >
            <ChevronsUpIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-2 pt-1">
          <TreeItem
            data={data}
            selectedItemId={selectedItemId}
            handleSelectChange={handleSelectChange}
            expandedItemIds={expandedItemIds}
            onNodeExpandChange={handleNodeExpandChange}
            defaultLeafIcon={defaultLeafIcon}
            defaultNodeIcon={defaultNodeIcon}
            {...props}
          />
        </div>
      </div>
    </DirectionPrimitive.DirectionProvider>
  );
};

type TreeItemProps = TreeProps & {
  selectedItemId?: string;
  handleSelectChange: (item: TreeDataItem | undefined) => void;
  expandedItemIds: string[];
  onNodeExpandChange?: (nodeId: string, isExpanded: boolean) => void;
  defaultNodeIcon?: any;
  defaultLeafIcon?: any;
};

const TreeItem = ({
  className,
  data,
  selectedItemId,
  handleSelectChange,
  expandedItemIds,
  onNodeExpandChange,
  defaultNodeIcon,
  defaultLeafIcon,
  ...props
}: TreeItemProps) => {
  const treeData = useMemo(() => {
    return Array.isArray(data) ? data : [data];
  }, [data]);

  return (
    <div role="tree" className={className} {...props}>
      <ul>
        {treeData.map((item) => (
          <li key={item.id}>
            {item.children ? (
              <TreeNode
                item={item}
                selectedItemId={selectedItemId}
                expandedItemIds={expandedItemIds}
                onNodeExpandChange={onNodeExpandChange}
                handleSelectChange={handleSelectChange}
                defaultNodeIcon={defaultNodeIcon}
                defaultLeafIcon={defaultLeafIcon}
              />
            ) : (
              <TreeLeaf
                item={item}
                selectedItemId={selectedItemId}
                handleSelectChange={handleSelectChange}
                defaultLeafIcon={defaultLeafIcon}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const TreeNode = ({
  item,
  handleSelectChange,
  expandedItemIds,
  onNodeExpandChange,
  selectedItemId,
  defaultNodeIcon,
  defaultLeafIcon,
}: {
  item: TreeDataItem;
  handleSelectChange: (item: TreeDataItem | undefined) => void;
  expandedItemIds: string[];
  onNodeExpandChange?: (nodeId: string, isExpanded: boolean) => void;
  selectedItemId?: string;
  defaultNodeIcon?: any;
  defaultLeafIcon?: any;
}) => {
  const dir = DirectionPrimitive.useDirection();

  const isExpanded = expandedItemIds.includes(item.id);
  const value = isExpanded ? [item.id] : [];

  const handleValueChange = useCallback(
    (newValue: string[]) => {
      const newIsExpanded = newValue.includes(item.id);
      if (onNodeExpandChange) {
        onNodeExpandChange(item.id, newIsExpanded);
      }
    },
    [item.id, onNodeExpandChange],
  );

  return (
    <AccordionPrimitive.Root
      type="multiple"
      value={value}
      onValueChange={handleValueChange}
    >
      <AccordionPrimitive.Item value={item.id}>
        <AccordionTrigger
          className={cn(
            treeVariants({ dir }),
            selectedItemId === item.id && selectedTreeVariants(),
          )}
          onClick={() => {
            handleSelectChange(item);
            item.onClick?.();
          }}
        >
          <TreeIcon
            item={item}
            isSelected={selectedItemId === item.id}
            isOpen={isExpanded}
            default={defaultNodeIcon}
          />
          <p className="truncate" title={item.name}>
            {item.name}
          </p>
          <TreeActions isSelected={selectedItemId === item.id}>
            {item.actions}
          </TreeActions>
        </AccordionTrigger>

        <AccordionContent
          className={cn("relative", dir === "ltr" ? "pl-3" : "pr-3")}
        >
          <AccordionPrimitive.Trigger
            className={cn(
              "group absolute z-10 h-full w-3",
              dir === "ltr" ? "left-0" : "right-0",
            )}
            onClick={() => {
              handleSelectChange(item);
            }}
          >
            <div className="bg-border group-hover:bg-foreground/30 h-full w-[2px]" />
          </AccordionPrimitive.Trigger>

          <TreeItem
            data={item.children ? item.children : item}
            selectedItemId={selectedItemId}
            handleSelectChange={handleSelectChange}
            expandedItemIds={expandedItemIds}
            onNodeExpandChange={onNodeExpandChange}
            defaultLeafIcon={defaultLeafIcon}
            defaultNodeIcon={defaultNodeIcon}
          />
        </AccordionContent>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  );
};

const TreeLeaf = ({
  className,
  item,
  selectedItemId,
  handleSelectChange,
  defaultLeafIcon,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  item: TreeDataItem;
  selectedItemId?: string;
  handleSelectChange: (item: TreeDataItem | undefined) => void;
  defaultLeafIcon?: any;
}) => {
  const dir = DirectionPrimitive.useDirection();

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center py-2",
        dir === "ltr"
          ? "ml-2 text-left before:right-1"
          : "mr-2 text-right before:left-1",
        treeVariants({ dir }),
        className,
        selectedItemId === item.id && selectedTreeVariants(),
      )}
      onClick={() => {
        handleSelectChange(item);
        item.onClick?.();
      }}
      {...props}
    >
      <TreeIcon
        item={item}
        isSelected={selectedItemId === item.id}
        default={defaultLeafIcon}
      />
      <span className="grow truncate text-base" title={item.name}>
        {item.name}
      </span>
      <TreeActions isSelected={selectedItemId === item.id}>
        {item.actions}
      </TreeActions>
    </div>
  );
};

const AccordionTrigger = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) => {
  const dir = DirectionPrimitive.useDirection();
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger
        className={cn(
          "flex w-full flex-1 items-center py-3 text-base transition-all [&[data-state=open]>svg]:first:rotate-90",
          className,
        )}
        {...props}
      >
        <ChevronRightIcon
          className={cn(
            "text-accent-foreground/50 h-4 w-4 shrink-0 transition-transform duration-200",
            dir === "ltr" ? "mr-1" : "ml-1 rotate-180",
          )}
        />
        {children}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
};

const AccordionContent = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) => (
  <AccordionPrimitive.Content
    className={cn(
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-base transition-all",
      className,
    )}
    {...props}
  >
    <div className="pt-0 pb-1">{children}</div>
  </AccordionPrimitive.Content>
);

const TreeIcon = ({
  item,
  isOpen,
  isSelected,
  default: defaultIcon,
}: {
  item: TreeDataItem;
  isOpen?: boolean;
  isSelected?: boolean;
  default?: any;
}) => {
  const dir = DirectionPrimitive.useDirection();

  let Icon = defaultIcon;
  if (isSelected && item.selectedIcon) {
    Icon = item.selectedIcon;
  } else if (isOpen && item.openIcon) {
    Icon = item.openIcon;
  } else if (item.icon) {
    Icon = item.icon;
  }
  return Icon ? (
    <Icon className={cn("h-4 w-4 shrink-0", dir === "ltr" ? "mr-2" : "ml-2")} />
  ) : (
    <></>
  );
};

const TreeActions = ({
  children,
  isSelected,
}: {
  children: React.ReactNode;
  isSelected: boolean;
}) => {
  const dir = DirectionPrimitive.useDirection();

  return (
    <div
      className={cn(
        isSelected ? "block" : "hidden",
        "absolute group-hover:block",
        dir === "ltr" ? "right-3" : "left-3",
      )}
    >
      {children}
    </div>
  );
};

export { TreeView, type TreeDataItem };

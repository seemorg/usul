"use client";

import React, { useMemo } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  type Direction,
  DirectionProvider,
  useDirection,
} from "@radix-ui/react-direction";

const treeVariants = cva(
  "group hover:before:opacity-100 before:absolute before:rounded-lg px-2 before:w-full before:opacity-0 before:bg-accent/70 before:h-[2rem] before:-z-10",
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
  "before:opacity-100 before:bg-accent/70 text-accent-foreground",
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
  dir?: Direction;
};

const TreeView = React.forwardRef<HTMLDivElement, TreeProps>(
  (
    {
      data,
      initialSelectedItemId,
      onSelectChange,
      expandAll,
      defaultLeafIcon,
      defaultNodeIcon,
      className,
      dir = "ltr",
      ...props
    },
    ref,
  ) => {
    const [selectedItemId, setSelectedItemId] = React.useState<
      string | undefined
    >(initialSelectedItemId);

    const handleSelectChange = React.useCallback(
      (item: TreeDataItem | undefined) => {
        setSelectedItemId(item?.id);
        if (onSelectChange) {
          onSelectChange(item);
        }
      },
      [onSelectChange],
    );

    const expandedItemIds = React.useMemo(() => {
      if (!initialSelectedItemId) {
        return [] as string[];
      }

      const ids: string[] = [];

      function walkTreeItems(
        items: TreeDataItem[] | TreeDataItem,
        targetId: string,
      ) {
        if (items instanceof Array) {
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

    return (
      <DirectionProvider dir={dir}>
        <div className={cn("relative overflow-hidden p-2", className)}>
          <TreeItem
            data={data}
            ref={ref}
            selectedItemId={selectedItemId}
            handleSelectChange={handleSelectChange}
            expandedItemIds={expandedItemIds}
            defaultLeafIcon={defaultLeafIcon}
            defaultNodeIcon={defaultNodeIcon}
            {...props}
          />
        </div>
      </DirectionProvider>
    );
  },
);
TreeView.displayName = "TreeView";

type TreeItemProps = TreeProps & {
  selectedItemId?: string;
  handleSelectChange: (item: TreeDataItem | undefined) => void;
  expandedItemIds: string[];
  defaultNodeIcon?: any;
  defaultLeafIcon?: any;
};

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      className,
      data,
      selectedItemId,
      handleSelectChange,
      expandedItemIds,
      defaultNodeIcon,
      defaultLeafIcon,
      ...props
    },
    ref,
  ) => {
    const treeData = useMemo(() => {
      return Array.isArray(data) ? data : [data];
    }, [data]);

    return (
      <div ref={ref} role="tree" className={className} {...props}>
        <ul>
          {treeData.map((item) => (
            <li key={item.id}>
              {item.children ? (
                <TreeNode
                  item={item}
                  selectedItemId={selectedItemId}
                  expandedItemIds={expandedItemIds}
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
  },
);
TreeItem.displayName = "TreeItem";
const TreeNode = ({
  item,
  handleSelectChange,
  expandedItemIds,
  selectedItemId,
  defaultNodeIcon,
  defaultLeafIcon,
}: {
  item: TreeDataItem;
  handleSelectChange: (item: TreeDataItem | undefined) => void;
  expandedItemIds: string[];
  selectedItemId?: string;
  defaultNodeIcon?: any;
  defaultLeafIcon?: any;
}) => {
  const dir = useDirection();

  const [value, setValue] = React.useState(
    expandedItemIds.includes(item.id) ? [item.id] : [],
  );
  return (
    <AccordionPrimitive.Root
      type="multiple"
      value={value}
      onValueChange={(s) => setValue(s)}
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
            isOpen={value.includes(item.id)}
            default={defaultNodeIcon}
          />
          <span className="truncate text-sm">{item.name}</span>
          <TreeActions isSelected={selectedItemId === item.id}>
            {item.actions}
          </TreeActions>
        </AccordionTrigger>
        <AccordionContent
          className={cn(
            dir === "ltr" ? "ml-4 border-l pl-1" : "mr-4 border-r pr-1",
          )}
        >
          <TreeItem
            //
            data={item.children ? item.children : item}
            selectedItemId={selectedItemId}
            handleSelectChange={handleSelectChange}
            expandedItemIds={expandedItemIds}
            defaultLeafIcon={defaultLeafIcon}
            defaultNodeIcon={defaultNodeIcon}
          />
        </AccordionContent>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  );
};

const TreeLeaf = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    item: TreeDataItem;
    selectedItemId?: string;
    handleSelectChange: (item: TreeDataItem | undefined) => void;
    defaultLeafIcon?: any;
  }
>(
  (
    {
      className,
      item,
      selectedItemId,
      handleSelectChange,
      defaultLeafIcon,
      ...props
    },
    ref,
  ) => {
    const dir = useDirection();

    return (
      <div
        ref={ref}
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
        <span className="flex-grow truncate text-sm">{item.name}</span>
        <TreeActions isSelected={selectedItemId === item.id}>
          {item.actions}
        </TreeActions>
      </div>
    );
  },
);
TreeLeaf.displayName = "TreeLeaf";
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const dir = useDirection();
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex w-full flex-1 items-center py-2 transition-all first:[&[data-state=open]>svg]:rotate-90",
          className,
        )}
        {...props}
      >
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 text-accent-foreground/50 transition-transform duration-200",
            dir === "ltr" ? "mr-1" : "ml-1 rotate-180",
          )}
        />
        {children}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className,
    )}
    {...props}
  >
    <div className="pb-1 pt-0">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

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
  const dir = useDirection();

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
  const dir = useDirection();

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

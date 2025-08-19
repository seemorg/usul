import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { FolderPlusIcon, PlusIcon, XIcon } from "lucide-react";

type Operator = "like" | "exact" | "starts-with" | "ends-with";

type Condition = {
  operator: Operator;
  value: string;
  not: boolean;
};

type GroupCondition = {
  type: "group";
  conditions: (Condition | GroupCondition)[];
  combineWith: "AND" | "OR";
};

function assertNever(value: never): never {
  throw new Error(`Unhandled value: ${JSON.stringify(value)}`);
}

const ConditionComponent: React.FC<{
  condition: Condition;
  onUpdate: (updatedCondition: Condition) => void;
  onRemove: () => void;
}> = ({ condition, onUpdate, onRemove }) => (
  <div className="flex items-center gap-2">
    <div className="bg-background flex flex-1 rounded-3xl">
      <Select
        value={condition.operator}
        onValueChange={(value) =>
          onUpdate({ ...condition, operator: value as Operator })
        }
      >
        <SelectTrigger className="w-fit gap-2 rounded-3xl bg-transparent shadow-none ltr:rounded-r-none ltr:border-r-0 rtl:rounded-l-none rtl:border-l-0">
          <SelectValue placeholder="Select operator" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="like">like</SelectItem>
          <SelectItem value="exact">exact</SelectItem>
          <SelectItem value="starts-with">starts-with</SelectItem>
          <SelectItem value="ends-with">ends-with</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="text"
        value={condition.value}
        onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
        placeholder="Enter value"
        className="grow-1 rounded-none bg-transparent shadow-none"
      />

      <Button
        variant="ghost"
        size="icon"
        className="border-border h-9 shrink-0 rounded-3xl border ltr:rounded-l-none ltr:border-l-0 rtl:rounded-r-none rtl:border-r-0"
        onClick={onRemove}
      >
        <XIcon className="size-4" />
      </Button>
    </div>

    <div className="flex items-center gap-1">
      <Switch
        id={`not-${condition.value}`}
        checked={condition.not}
        onCheckedChange={(checked) => onUpdate({ ...condition, not: checked })}
      />
      <Label htmlFor={`not-${condition.value}`}>NOT</Label>
    </div>
  </div>
);

const GroupComponent: React.FC<{
  group: GroupCondition;
  onUpdate: (updatedGroup: GroupCondition) => void;
  onRemove: () => void;
  depth: number;
  index: number;
}> = ({ group, onUpdate, onRemove, depth, index }) => {
  const addCondition = () => {
    onUpdate({
      ...group,
      conditions: [
        ...group.conditions,
        { operator: "like", value: "", not: false },
      ],
    });
  };

  const addGroup = () => {
    onUpdate({
      ...group,
      conditions: [
        ...group.conditions,
        { type: "group", conditions: [], combineWith: "AND" },
      ],
    });
  };

  const updateCondition = (
    index: number,
    updatedCondition: Condition | GroupCondition,
  ) => {
    const newConditions = [...group.conditions];
    newConditions[index] = updatedCondition;
    onUpdate({ ...group, conditions: newConditions });
  };

  const removeCondition = (index: number) => {
    onUpdate({
      ...group,
      conditions: group.conditions.filter((_, i) => i !== index),
    });
  };

  return (
    <div
      className={cn(
        "w-full",
        depth > 0 &&
          "bg-muted dark:bg-card border-border rounded-xl border px-4 py-2",
      )}
    >
      {depth > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <p>
            Group {index + 1}
            {depth > 1 && ` (${depth})`}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={onRemove}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      )}

      {group.conditions.map((condition, index) => (
        <React.Fragment key={index}>
          {"type" in condition ? (
            <GroupComponent
              group={condition}
              onUpdate={(updatedGroup) => updateCondition(index, updatedGroup)}
              onRemove={() => removeCondition(index)}
              depth={depth + 1}
              index={index}
            />
          ) : (
            <ConditionComponent
              condition={condition}
              onUpdate={(updatedCondition) =>
                updateCondition(index, updatedCondition)
              }
              onRemove={() => removeCondition(index)}
            />
          )}

          {group.conditions.length > 1 &&
            index !== group.conditions.length - 1 && (
              <Select
                value={group.combineWith}
                onValueChange={(value: "AND" | "OR") =>
                  onUpdate({ ...group, combineWith: value })
                }
              >
                <Separator orientation="vertical" className="mx-auto h-2" />
                <SelectTrigger className="bg-background mx-auto w-fit gap-2 rounded-full lowercase">
                  <SelectValue placeholder="Combine with" />
                </SelectTrigger>
                <Separator orientation="vertical" className="mx-auto h-2" />

                <SelectContent align="center">
                  <SelectItem value="AND">and</SelectItem>
                  <SelectItem value="OR">or</SelectItem>
                </SelectContent>
              </Select>
            )}
        </React.Fragment>
      ))}

      <div className="mt-4 flex items-center space-x-2">
        <Button
          variant="ghost"
          className="text-primary hover:bg-primary/10"
          onClick={addCondition}
        >
          <PlusIcon className="size-4" /> Add Condition
        </Button>
        <Button
          variant="ghost"
          className="text-primary hover:bg-primary/10"
          onClick={addGroup}
        >
          <FolderPlusIcon className="size-4" /> Add Group
        </Button>
      </div>
    </div>
  );
};

const charsToEscape = [
  "+",
  "-",
  "&",
  "|",
  "!",
  "(",
  ")",
  "{",
  "}",
  "[",
  "]",
  "^",
  '"',
  "~",
  "*",
  "?",
  ":",
  "\\",
  "/",
];
const escapeValue = (value: string) => {
  // escape all chars in charsToEscape by adding a backslash before them
  return charsToEscape.reduce((acc, char) => {
    return acc.replace(char, `\\${char}`);
  }, value);
};

type FilterProps = {
  value: GroupCondition;
  setValue: (value: GroupCondition) => void;
};

export const buildQuery = (group: GroupCondition, isRoot = false): string => {
  const queryParts = group.conditions
    .map((condition) => {
      if ("type" in condition) {
        return buildQuery(condition);
      } else {
        const { operator, value, not } = condition;
        const escapedValue = escapeValue(value);

        let query = "";
        switch (operator) {
          case "like":
            query = escapedValue;
            break;

          case "exact":
            query = `"${escapedValue}"`;
            break;

          case "starts-with":
            query = `${escapedValue}*`;
            break;

          case "ends-with":
            query = `${escapedValue}*`;
            break;

          // assert never
          default:
            assertNever(operator);
        }

        return not ? `NOT ${query}` : query;
      }
    })
    .filter(Boolean);

  if (queryParts.length === 0) return "";
  if (queryParts.length === 1) return queryParts[0]!;

  const result = queryParts.join(` ${group.combineWith} `);
  if (isRoot) return result;
  return `(${result})`;
};

export function AzureSearchFilter({ value, setValue }: FilterProps) {
  const applyFilter = (newGroup?: GroupCondition) => {
    setValue(newGroup ?? value);
  };

  return (
    <GroupComponent
      group={value}
      onUpdate={applyFilter}
      onRemove={applyFilter}
      depth={0}
      index={0}
    />
  );
}

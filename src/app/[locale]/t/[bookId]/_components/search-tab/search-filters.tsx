import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X, Plus, FolderPlus } from "lucide-react";

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
  <div className="mb-2 flex items-center space-x-2">
    <Select
      value={condition.operator}
      onValueChange={(value) =>
        onUpdate({ ...condition, operator: value as Operator })
      }
    >
      <SelectTrigger className="w-[180px]">
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
      className="grow"
    />

    <div className="flex items-center space-x-2">
      <Switch
        id={`not-${condition.value}`}
        checked={condition.not}
        onCheckedChange={(checked) => onUpdate({ ...condition, not: checked })}
      />
      <Label htmlFor={`not-${condition.value}`}>NOT</Label>
    </div>

    <Button variant="ghost" size="icon" onClick={onRemove}>
      <X className="h-4 w-4" />
    </Button>
  </div>
);

const GroupComponent: React.FC<{
  group: GroupCondition;
  onUpdate: (updatedGroup: GroupCondition) => void;
  onRemove: () => void;
  depth: number;
}> = ({ group, onUpdate, onRemove, depth }) => {
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
      className={`mb-2 w-full rounded-lg border p-4 ${depth > 0 ? "ml-4" : ""}`}
    >
      <div className="mb-2 flex items-center space-x-2">
        {group.conditions.length > 1 && (
          <Select
            value={group.combineWith}
            onValueChange={(value: "AND" | "OR") =>
              onUpdate({ ...group, combineWith: value })
            }
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Combine with" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">AND</SelectItem>
              <SelectItem value="OR">OR</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button variant="outline" onClick={addCondition}>
          <Plus className="mr-2 h-4 w-4" /> Add Condition
        </Button>
        <Button variant="outline" onClick={addGroup}>
          <FolderPlus className="mr-2 h-4 w-4" /> Add Group
        </Button>
        {depth > 0 && (
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {group.conditions.map((condition, index) =>
        "type" in condition ? (
          <GroupComponent
            key={index}
            group={condition}
            onUpdate={(updatedGroup) => updateCondition(index, updatedGroup)}
            onRemove={() => removeCondition(index)}
            depth={depth + 1}
          />
        ) : (
          <ConditionComponent
            key={index}
            condition={condition}
            onUpdate={(updatedCondition) =>
              updateCondition(index, updatedCondition)
            }
            onRemove={() => removeCondition(index)}
          />
        ),
      )}
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
    />
  );
}

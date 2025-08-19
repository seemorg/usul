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
import { useTranslations } from "next-intl";

type Operator = "like" | "exact" | "starts-with" | "ends-with";

type Condition = {
  operator: Operator;
  value: string;
  not: boolean;
};

export type GroupCondition = {
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
}> = ({ condition, onUpdate, onRemove }) => {
  const t = useTranslations();

  return (
    <div className="flex items-center gap-2">
      <div className="bg-background flex flex-1 rounded-3xl">
        <Select
          value={condition.operator}
          onValueChange={(value) =>
            onUpdate({ ...condition, operator: value as Operator })
          }
        >
          <SelectTrigger className="w-fit gap-2 rounded-3xl bg-transparent shadow-none ltr:rounded-r-none ltr:border-r-0 rtl:rounded-l-none rtl:border-l-0">
            <SelectValue
              placeholder={t("common.search-filters.select-operator")}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="like">
              {t("common.search-filters.operators.like")}
            </SelectItem>
            <SelectItem value="exact">
              {t("common.search-filters.operators.exact")}
            </SelectItem>
            <SelectItem value="starts-with">
              {t("common.search-filters.operators.starts-with")}
            </SelectItem>
            <SelectItem value="ends-with">
              {t("common.search-filters.operators.ends-with")}
            </SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="text"
          value={condition.value}
          onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
          placeholder={t("common.search-filters.enter-value")}
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
          onCheckedChange={(checked) =>
            onUpdate({ ...condition, not: checked })
          }
        />
        <Label htmlFor={`not-${condition.value}`}>
          {t("common.search-filters.not")}
        </Label>
      </div>
    </div>
  );
};

const GroupComponent: React.FC<{
  group: GroupCondition;
  onUpdate: (updatedGroup: GroupCondition) => void;
  onRemove: () => void;
  depth: number;
  index: number;
}> = ({ group, onUpdate, onRemove, depth, index }) => {
  const t = useTranslations();
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
            {t("common.search-filters.group")} {index + 1}
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
                  <SelectValue
                    placeholder={t("common.search-filters.combine-with")}
                  />
                </SelectTrigger>
                <Separator orientation="vertical" className="mx-auto h-2" />

                <SelectContent align="center">
                  <SelectItem value="AND">
                    {t("common.search-filters.combiners.and")}
                  </SelectItem>
                  <SelectItem value="OR">
                    {t("common.search-filters.combiners.or")}
                  </SelectItem>
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
          <PlusIcon className="size-4" />{" "}
          {t("common.search-filters.add-condition")}
        </Button>
        <Button
          variant="ghost"
          className="text-primary hover:bg-primary/10"
          onClick={addGroup}
        >
          <FolderPlusIcon className="size-4" />{" "}
          {t("common.search-filters.add-group")}
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

const unescapeValue = (value: string) => {
  return charsToEscape.reduce((acc, char) => {
    return acc.replace(`\\${char}`, char);
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

// Helper function to split query by operators while respecting parentheses
const splitQueryByOperators = (
  query: string,
): { parts: string[]; operators: ("AND" | "OR")[]; hasMixed: boolean } => {
  const parts: string[] = [];
  const operators: ("AND" | "OR")[] = [];
  let currentPart = "";
  let parenthesesDepth = 0;
  let i = 0;

  while (i < query.length) {
    const char = query[i];

    if (char === "(") {
      parenthesesDepth++;
      currentPart += char;
    } else if (char === ")") {
      parenthesesDepth--;
      currentPart += char;
    } else if (parenthesesDepth === 0) {
      // Only look for operators at the top level (outside parentheses)
      if (query.slice(i, i + 5) === " AND ") {
        parts.push(currentPart.trim());
        operators.push("AND");
        currentPart = "";
        i += 4; // Skip " AND"
      } else if (query.slice(i, i + 4) === " OR ") {
        parts.push(currentPart.trim());
        operators.push("OR");
        currentPart = "";
        i += 3; // Skip " OR"
      } else {
        currentPart += char;
      }
    } else {
      currentPart += char;
    }
    i++;
  }

  if (currentPart.trim()) {
    parts.push(currentPart.trim());
  }

  // Check if we have mixed operators
  const uniqueOperators = [...new Set(operators)];
  const hasMixed = uniqueOperators.length > 1;

  return {
    parts: parts.filter((part) => part.length > 0),
    operators,
    hasMixed,
  };
};

// Helper function to handle mixed operators by creating proper groupings
const handleMixedOperators = (
  parts: string[],
  operators: ("AND" | "OR")[],
): GroupCondition => {
  if (operators.length === 0 || parts.length === 0) {
    // Single part, parse it directly
    const firstPart = parts[0] || "";
    return parseQuery(firstPart);
  }

  // For mixed operators, we need to respect operator precedence
  // AND has higher precedence than OR, so we group AND operations first

  // Find OR operators and split the query into OR groups
  const orGroups: { parts: string[]; operators: ("AND" | "OR")[] }[] = [];
  let currentOrGroup: { parts: string[]; operators: ("AND" | "OR")[] } = {
    parts: [],
    operators: [],
  };

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part) {
      currentOrGroup.parts.push(part);
    }

    if (i < operators.length) {
      const operator = operators[i];
      if (operator === "OR") {
        // End current OR group and start a new one
        orGroups.push(currentOrGroup);
        currentOrGroup = { parts: [], operators: [] };
      } else if (operator) {
        // AND operator, add to current group
        currentOrGroup.operators.push(operator);
      }
    }
  }

  // Add the last group
  if (currentOrGroup.parts.length > 0) {
    orGroups.push(currentOrGroup);
  }

  // If we only have one OR group, handle it as an AND group
  if (orGroups.length === 1) {
    const group = orGroups[0];
    if (!group) {
      return {
        type: "group",
        combineWith: "AND",
        conditions: [],
      };
    }

    const conditions = group.parts.map((part) => {
      if (part.startsWith("(") && part.endsWith(")")) {
        return parseQuery(part);
      }
      return parseSingleCondition(part);
    });

    return {
      type: "group",
      combineWith: "AND",
      conditions,
    };
  }

  // Multiple OR groups - create nested structure
  const orConditions = orGroups.map((group) => {
    if (group.parts.length === 1) {
      const part = group.parts[0];
      if (!part) {
        return {
          type: "group" as const,
          combineWith: "AND" as const,
          conditions: [],
        };
      }

      if (part.startsWith("(") && part.endsWith(")")) {
        return parseQuery(part);
      }
      return {
        type: "group" as const,
        combineWith: "AND" as const,
        conditions: [parseSingleCondition(part)],
      };
    } else {
      // Multiple parts in this OR group, combine with AND
      const conditions = group.parts.map((part) => {
        if (part.startsWith("(") && part.endsWith(")")) {
          return parseQuery(part);
        }
        return parseSingleCondition(part);
      });

      return {
        type: "group" as const,
        combineWith: "AND" as const,
        conditions,
      };
    }
  });

  return {
    type: "group",
    combineWith: "OR",
    conditions: orConditions,
  };
};

// Helper function to parse a single condition
const parseSingleCondition = (part: string): Condition => {
  part = part.trim();

  let not = false;
  if (part.startsWith("NOT ")) {
    not = true;
    part = part.slice(4).trim();
  }

  let operator: "like" | "exact" | "starts-with" | "ends-with" = "like";
  let value = part;

  if (part.startsWith('"') && part.endsWith('"')) {
    operator = "exact";
    value = part.slice(1, -1);
  } else if (part.startsWith("*") && part.endsWith("*")) {
    // Handle *value* case (contains)
    operator = "like";
    value = part.slice(1, -1);
  } else if (part.startsWith("*")) {
    operator = "ends-with";
    value = part.slice(1);
  } else if (part.endsWith("*")) {
    operator = "starts-with";
    value = part.slice(0, -1);
  }

  // Unescape special characters
  value = unescapeValue(value);

  return {
    operator,
    value,
    not,
  };
};

export const parseQuery = (query: string): GroupCondition => {
  // Remove outer parentheses if present and balanced
  query = query.trim();
  if (query.startsWith("(") && query.endsWith(")")) {
    // Check if these are the outermost parentheses
    let depth = 0;
    let canRemove = true;
    for (let i = 0; i < query.length; i++) {
      if (query[i] === "(") depth++;
      else if (query[i] === ")") depth--;

      // If depth becomes 0 before the last character, these aren't outermost parentheses
      if (depth === 0 && i < query.length - 1) {
        canRemove = false;
        break;
      }
    }
    if (canRemove) {
      query = query.slice(1, -1).trim();
    }
  }

  // Handle empty query
  if (!query) {
    return {
      type: "group",
      conditions: [],
      combineWith: "AND",
    };
  }

  // Split by AND/OR at top level (respecting parentheses)
  const { parts, operators, hasMixed } = splitQueryByOperators(query);

  // If no operators found, treat as single condition
  if (parts.length <= 1) {
    const singleQuery = parts[0] || query;

    // Check if this is a nested group
    if (singleQuery.startsWith("(") && singleQuery.endsWith(")")) {
      return parseQuery(singleQuery);
    }

    // Parse single condition
    const condition = parseSingleCondition(singleQuery);

    return {
      type: "group",
      combineWith: "AND",
      conditions: [condition],
    };
  }

  // Handle mixed operators with proper precedence
  if (hasMixed) {
    return handleMixedOperators(parts, operators);
  }

  // All operators are the same, simple case
  const combineWith = operators[0] || "AND";
  const conditions = parts.map((part) => {
    part = part.trim();

    // Check if this is a nested group
    if (part.startsWith("(") && part.endsWith(")")) {
      return parseQuery(part);
    }

    // Parse single condition
    return parseSingleCondition(part);
  });

  return {
    type: "group",
    combineWith,
    conditions,
  };
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

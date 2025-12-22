// src/components/Workbook/migrateGroups.ts
// Utility to migrate existing groups to the new column-tracking system
// Run this once to add the column property to all existing components

import { RibbonGroup } from "./types";

export function migrateGroupsToColumnTracking(groups: RibbonGroup[]): RibbonGroup[] {
  return groups.map(group => {
    const columns = group.columns || 1;
    
    return {
      ...group,
      components: group.components.map((component, index) => {
        // If component doesn't have a column property, assign it based on current position
        if (component.column === undefined) {
          return {
            ...component,
            column: index % columns
          };
        }
        return component;
      })
    };
  });
}
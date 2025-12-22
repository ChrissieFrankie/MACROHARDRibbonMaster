// src/components/Workbook/Workbook.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import SpreadsheetGrid from "./SpreadsheetGrid";
import RibbonTabs from "./RibbonTabs";
import RibbonGroup from "./RibbonGroup";
import ContextMenu from "./ContextMenu";
import { RibbonGroup as GroupType, ContextMenuPosition } from "./types";
import { migrateGroupsToColumnTracking } from "./migrateGroups";

export default function Workbook() {
  const [selectedTab, setSelectedTab] = useState("Home");
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);

  const [editingComponentId, setEditingComponentId] = useState<string | null>(null);
  const [editingSubcomponentId, setEditingSubcomponentId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const contextMenuRef = useRef<HTMLDivElement>(null);
  const migrated = useRef(false);

  // One-time migration: assign column property to components that don't have it
  useEffect(() => {
    if (migrated.current) return;
    
    setGroups(prev => {
      const needsMigration = prev.some(g => 
        g.components.some(c => c.column === undefined)
      );
      
      if (needsMigration) {
        migrated.current = true;
        return prev.map(group => ({
          ...group,
          components: group.components.map((c, idx) => {
            if (c.column === undefined) {
              const columns = group.columns || 1;
              return { ...c, column: idx % columns };
            }
            return c;
          })
        }));
      }
      
      return prev;
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [contextMenu]);

  const handleContextMenu = (
    e: React.MouseEvent,
    groupIndex?: number,
    componentIndex?: number
  ) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, groupIndex, componentIndex });
  };

  const closeContextMenu = () => setContextMenu(null);

  // ──────────────────────────────────────────────────────────────
  // Ribbon modification handlers
  // ──────────────────────────────────────────────────────────────

  const createNewGroup = () => {
    const newGroup: GroupType = {
      id: `group-${Date.now()}`,
      label: `Group ${groups.length + 1}`,
      components: [],
      columns: 1,
    };
    setGroups((prev) => [...prev, newGroup]);
  };

  const createNewComponent = (groupIndex: number) => {
    setGroups((prev) =>
      prev.map((g, i) => {
        if (i !== groupIndex) return g;
        
        // Assign to column 0 by default
        const newComponent = {
          id: `component-${Date.now()}`,
          label: `${g.components.length + 1}`,
          column: 0,
        };
        
        return { ...g, components: [...g.components, newComponent] };
      })
    );
  };

  const createDropdown = (groupIndex: number, componentIndex: number) => {
    setGroups((prev) =>
      prev.map((g, gi) =>
        gi === groupIndex
          ? {
              ...g,
              components: g.components.map((c, ci) =>
                ci === componentIndex ? { ...c, subcomponents: [] } : c
              ),
            }
          : g
      )
    );
  };

  const destroyDropdown = (groupIndex: number, componentIndex: number) => {
    setGroups((prev) =>
      prev.map((g, gi) =>
        gi === groupIndex
          ? {
              ...g,
              components: g.components.map((c, ci) =>
                ci === componentIndex ? { ...c, subcomponents: undefined } : c
              ),
            }
          : g
      )
    );

    const componentId = groups[groupIndex]?.components[componentIndex]?.id;
    if (openDropdownId === componentId) {
      setOpenDropdownId(null);
    }
  };

  const addColumn = (groupIndex: number) => {
    setGroups((prev) =>
      prev.map((g, i) =>
        i === groupIndex ? { ...g, columns: (g.columns || 1) + 1 } : g
      )
    );
  };

  const removeColumn = (groupIndex: number) => {
    setGroups((prev) =>
      prev.map((g, i) => {
        if (i !== groupIndex || (g.columns || 1) <= 1) return g;
        
        const newColumns = (g.columns || 1) - 1;
        // Move any components in the removed column to the last remaining column
        const updatedComponents = g.components.map(c => ({
          ...c,
          column: (c.column || 0) >= newColumns ? newColumns - 1 : (c.column || 0)
        }));
        
        return { ...g, columns: newColumns, components: updatedComponents };
      })
    );
  };

  // Move to Previous Column - changes the component's column property
  const moveToPrevColumn = (groupIndex: number, componentIndex: number) => {
    setGroups((prev) =>
      prev.map((g, i) => {
        if (i !== groupIndex) return g;
        
        const columns = g.columns || 1;
        const component = g.components[componentIndex];
        // If column is undefined, calculate it from the index position
        const currentCol = component.column ?? (componentIndex % columns);
        
        // Can't move if already in first column
        if (currentCol === 0) return g;
        
        return {
          ...g,
          components: g.components.map((c, ci) =>
            ci === componentIndex ? { ...c, column: currentCol - 1 } : c
          ),
        };
      })
    );
  };

  // Move to Next Column - changes the component's column property
  const moveToNextColumn = (groupIndex: number, componentIndex: number) => {
    setGroups((prev) =>
      prev.map((g, i) => {
        if (i !== groupIndex) return g;
        
        const columns = g.columns || 1;
        const component = g.components[componentIndex];
        // If column is undefined, calculate it from the index position
        const currentCol = component.column ?? (componentIndex % columns);
        
        // Can't move if already in last column
        if (currentCol >= columns - 1) return g;
        
        return {
          ...g,
          components: g.components.map((c, ci) =>
            ci === componentIndex ? { ...c, column: currentCol + 1 } : c
          ),
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col overflow-hidden">
      <RibbonTabs selectedTab={selectedTab} onTabChange={setSelectedTab} />

      {selectedTab === "Home" && (
        <div
          className="bg-[#292929] h-32 border-b-2 border-[#292929] px-4 py-3 overflow-hidden"
          onContextMenu={(e) => handleContextMenu(e)}
        >
          <div className="flex gap-6 h-full items-stretch">
            {groups.map((group, index) => (
              <RibbonGroup
                key={group.id}
                group={group}
                groupIndex={index}
                onContextMenu={handleContextMenu}
                openDropdownId={openDropdownId}
                setOpenDropdownId={setOpenDropdownId}
                onUpdateGroups={setGroups}
                editingComponentId={editingComponentId}
                setEditingComponentId={setEditingComponentId}
                editingSubcomponentId={editingSubcomponentId}
                setEditingSubcomponentId={setEditingSubcomponentId}
                editValue={editValue}
                setEditValue={setEditValue}
              />
            ))}
          </div>
        </div>
      )}

      <ContextMenu
        ref={contextMenuRef}
        position={contextMenu}
        groups={groups}
        onCreateGroup={createNewGroup}
        onCreateComponent={createNewComponent}
        onCreateDropdown={createDropdown}
        onDestroyDropdown={destroyDropdown}
        onAddColumn={addColumn}
        onRemoveColumn={removeColumn}
        onMoveToPrevColumn={moveToPrevColumn}
        onMoveToNextColumn={moveToNextColumn}
        onClose={closeContextMenu}
      />

      <div className="flex-1 overflow-auto bg-white">
        <SpreadsheetGrid />
      </div>
    </div>
  );
}


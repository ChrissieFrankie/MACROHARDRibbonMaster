// src/components/Workbook/Workbook.tsx
"use client";

import { useState } from "react";
import SpreadsheetGrid from "./SpreadsheetGrid";
import RibbonTabs from "./RibbonTabs";
import RibbonGroup from "./RibbonGroup";
import ContextMenu from "./ContextMenu";
import { RibbonGroup as GroupType, ContextMenuPosition } from "./types";

export default function Workbook() {
  const [selectedTab, setSelectedTab] = useState("Home");
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(
    null
  );

  const [editingComponentId, setEditingComponentId] = useState<string | null>(
    null
  );
  const [editingSubcomponentId, setEditingSubcomponentId] = useState<
    string | null
  >(null);
  const [editValue, setEditValue] = useState<string>("");

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
    const newComponent = {
      id: `component-${Date.now()}`,
      label: `Component ${groups[groupIndex].components.length + 1}`,
    };

    setGroups((prev) =>
      prev.map((g, i) =>
        i === groupIndex
          ? { ...g, components: [...g.components, newComponent] }
          : g
      )
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

    // Close dropdown if it was open
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
      prev.map((g, i) =>
        i === groupIndex && (g.columns || 1) > 1
          ? { ...g, columns: (g.columns || 1) - 1 }
          : g
      )
    );
  };

  const moveComponentLeft = (groupIndex: number, componentIndex: number) => {
    const group = groups[groupIndex];
    const columns = group.columns || 1;
    const column = componentIndex % columns;

    if (column === 0) return; // already leftmost

    const newComponents = [...group.components];
    [newComponents[componentIndex], newComponents[componentIndex - 1]] = [
      newComponents[componentIndex - 1],
      newComponents[componentIndex],
    ];

    setGroups((prev) =>
      prev.map((g, i) =>
        i === groupIndex ? { ...g, components: newComponents } : g
      )
    );
  };

  const moveComponentRight = (groupIndex: number, componentIndex: number) => {
    const group = groups[groupIndex];
    const columns = group.columns || 1;
    const column = componentIndex % columns;
    const total = group.components.length;

    if (column === columns - 1 || componentIndex + 1 >= total) return;

    const nextRow = Math.floor((componentIndex + 1) / columns);
    const currentRow = Math.floor(componentIndex / columns);
    if (nextRow !== currentRow) return; // can't cross rows

    const newComponents = [...group.components];
    [newComponents[componentIndex], newComponents[componentIndex + 1]] = [
      newComponents[componentIndex + 1],
      newComponents[componentIndex],
    ];

    setGroups((prev) =>
      prev.map((g, i) =>
        i === groupIndex ? { ...g, components: newComponents } : g
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col overflow-hidden">
      <RibbonTabs selectedTab={selectedTab} onTabChange={setSelectedTab} />

      {selectedTab === "Home" && (
        <div
          className="bg-[#292929] h-32 border-b-2 border-[#292929] px-4 py-3 overflow-hidden"
          onContextMenu={(e) => handleContextMenu(e)} // empty area
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
        position={contextMenu}
        groups={groups}
        onCreateGroup={createNewGroup}
        onCreateComponent={createNewComponent}
        onCreateDropdown={createDropdown}
        onDestroyDropdown={destroyDropdown}
        onAddColumn={addColumn}
        onRemoveColumn={removeColumn}
        onMoveLeft={moveComponentLeft}
        onMoveRight={moveComponentRight}
        onClose={closeContextMenu}
      />

      <div className="flex-1 overflow-auto bg-white">
        <SpreadsheetGrid />
      </div>
    </div>
  );
}

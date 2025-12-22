// src/components/Workbook/RibbonGroup.tsx
import { RibbonGroup as GroupType } from "./types";
import RibbonComponent from "./RibbonComponent";

interface RibbonGroupProps {
  group: GroupType;
  groupIndex: number;
  onContextMenu: (
    e: React.MouseEvent,
    groupIndex: number,
    componentIndex?: number
  ) => void;
  openDropdownId: string | null;
  setOpenDropdownId: (id: string | null) => void;
  onUpdateGroups: (updater: (prev: GroupType[]) => GroupType[]) => void;

  editingComponentId: string | null;
  setEditingComponentId: (id: string | null) => void;
  editingSubcomponentId: string | null;
  setEditingSubcomponentId: (id: string | null) => void;
  editValue: string;
  setEditValue: (value: string) => void;
}

export default function RibbonGroup({
  group,
  groupIndex,
  onContextMenu,
  openDropdownId,
  setOpenDropdownId,
  onUpdateGroups,
  editingComponentId,
  setEditingComponentId,
  editingSubcomponentId,
  setEditingSubcomponentId,
  editValue,
  setEditValue,
}: RibbonGroupProps) {
  const columns = group.columns || 1;

  // Calculate max rows
  const componentsPerColumn = Array.from({ length: columns }, (_, col) =>
    group.components.filter((_, idx) => idx % columns === col).length
  );
  const rowsCount = Math.max(...componentsPerColumn, 1);

  return (
    <div
      className="bg-[#353535] border-l border-gray-600 pl-4 pr-4 py-2 rounded relative group h-full flex flex-col"
      onContextMenu={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onContextMenu(e, groupIndex);
      }}
    >
      <div
        className="grid gap-2 flex-1 auto-rows-fr items-stretch"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {group.components.map((component, compIndex) => {
          // Calculate how many components are in this component's column
          const currentColumn = compIndex % columns;
          const componentsInThisColumn = group.components.filter(
            (_, i) => i % columns === currentColumn
          ).length;

          const isOnlyInColumn = componentsInThisColumn === 1;

          return (
            <RibbonComponent
              key={component.id}
              component={component}
              groupIndex={groupIndex}
              compIndex={compIndex}
              columns={columns}
              rowsCount={rowsCount}
              isOnlyInColumn={isOnlyInColumn}
              onContextMenu={onContextMenu}
              openDropdownId={openDropdownId}
              setOpenDropdownId={setOpenDropdownId}
              onUpdateGroups={onUpdateGroups}
              editingComponentId={editingComponentId}
              setEditingComponentId={setEditingComponentId}
              editingSubcomponentId={editingSubcomponentId}
              setEditingSubcomponentId={setEditingSubcomponentId}
              editValue={editValue}
              setEditValue={setEditValue}
            />
          );
        })}
      </div>
    </div>
  );
}
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
        className="grid gap-2 flex-1 auto-rows-fr"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {group.components.map((component, compIndex) => (
          <RibbonComponent
            key={component.id}
            component={component}
            groupIndex={groupIndex}
            compIndex={compIndex}
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
        ))}
      </div>
    </div>
  );
}
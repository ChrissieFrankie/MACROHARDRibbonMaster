// src/components/Workbook/RibbonComponent.tsx
import { RibbonComponent as CompType } from './types';

interface RibbonComponentProps {
  component: CompType;
  groupIndex: number;
  compIndex: number;
  onContextMenu: (e: React.MouseEvent, groupIndex: number, componentIndex?: number) => void;
  openDropdownId: string | null;
  setOpenDropdownId: (id: string | null) => void;
  onUpdateGroups: (updater: (prev: any[]) => any[]) => void;

  editingComponentId: string | null;
  setEditingComponentId: (id: string | null) => void;
  editingSubcomponentId: string | null;
  setEditingSubcomponentId: (id: string | null) => void;
  editValue: string;
  setEditValue: (value: string) => void;
}

export default function RibbonComponent({
  component,
  groupIndex,
  compIndex,
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
}: RibbonComponentProps) {
  const isEditing = editingComponentId === component.id;
  const isDropdownOpen = openDropdownId === component.id;

  const startEditingComponent = () => {
    setEditingComponentId(component.id);
    setEditValue(component.label);
  };

  const finishEditingComponent = () => {
    if (editValue.trim()) {
      onUpdateGroups((prev) =>
        prev.map((g: any, gi: number) =>
          gi === groupIndex
            ? {
                ...g,
                components: g.components.map((c: any, ci: number) =>
                  ci === compIndex ? { ...c, label: editValue.trim() } : c
                ),
              }
            : g
        )
      );
    }
    setEditingComponentId(null);
    setEditValue('');
  };

  const addSubcomponent = () => {
    onUpdateGroups((prev) =>
      prev.map((g: any, gi: number) =>
        gi === groupIndex
          ? {
              ...g,
              components: g.components.map((c: any, ci: number) =>
                ci === compIndex
                  ? {
                      ...c,
                      subcomponents: [
                        ...(c.subcomponents || []),
                        { id: `sub-${Date.now()}`, label: 'New Item' },
                      ],
                    }
                  : c
              ),
            }
          : g
      )
    );
  };

  return (
    <div className="relative dropdown-container flex">
      <div
        className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded cursor-pointer transition-colors flex items-center justify-between flex-1 min-h-0"
        onContextMenu={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onContextMenu(e, groupIndex, compIndex);
        }}
        onClick={() => setOpenDropdownId(isDropdownOpen ? null : component.id)}
      >
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={finishEditingComponent}
            onKeyDown={(e) => {
              if (e.key === 'Enter') finishEditingComponent();
              if (e.key === 'Escape') {
                setEditingComponentId(null);
                setEditValue('');
              }
            }}
            autoFocus
            className="bg-gray-700 text-white text-xs px-2 py-1 rounded w-full outline-none border border-gray-500"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <>
            <span
              onDoubleClick={(e) => {
                e.stopPropagation();
                startEditingComponent();
              }}
              className="flex-1 truncate"
            >
              {component.label}
            </span>
            {component.subcomponents && <span className="ml-2 text-xs">▼</span>}
          </>
        )}
      </div>

      {isDropdownOpen && component.subcomponents && (
        <div className="absolute top-full left-0 mt-2 bg-gray-700 border border-gray-600 rounded shadow-lg z-50 min-w-[160px] py-2">
          {component.subcomponents.map((sub) => (
            <div
              key={sub.id}
              className="px-4 py-1.5 text-white text-xs hover:bg-gray-600 cursor-pointer"
            >
              {sub.label}
            </div>
          ))}
          <div className="border-t border-gray-600 mt-1 pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addSubcomponent();
              }}
              className="w-full text-left px-4 py-1.5 text-white text-xs hover:bg-gray-600"
            >
              + Add item
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
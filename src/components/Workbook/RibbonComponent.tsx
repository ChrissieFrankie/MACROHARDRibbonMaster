// src/components/Workbook/RibbonComponent.tsx
import { RibbonComponent as CompType, RibbonSubcomponent } from './types';

interface RibbonComponentProps {
  component: CompType;
  groupIndex: number;
  compIndex: number;
  columns: number;
  rowsCount: number;
  isOnlyInColumn: boolean;
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
  columns,
  rowsCount,
  isOnlyInColumn,
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

  const rowSpan = isOnlyInColumn ? rowsCount : 1;

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

  const startEditingSubcomponent = (subId: string, currentLabel: string) => {
    setEditingSubcomponentId(subId);
    setEditValue(currentLabel);
  };

  const finishEditingSubcomponent = (subId: string) => {
    if (editValue.trim()) {
      onUpdateGroups((prev) =>
        prev.map((g: any, gi: number) =>
          gi === groupIndex
            ? {
                ...g,
                components: g.components.map((c: any, ci: number) =>
                  ci === compIndex
                    ? {
                        ...c,
                        subcomponents: (c.subcomponents || []).map((s: RibbonSubcomponent) =>
                          s.id === subId ? { ...s, label: editValue.trim() } : s
                        ),
                      }
                    : c
                ),
              }
            : g
        )
      );
    }
    setEditingSubcomponentId(null);
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
                        {
                          id: `sub-${Date.now()}`,
                          label: `Item ${(c.subcomponents?.length || 0) + 1}`,
                        },
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
    <div style={{ gridRow: `span ${rowSpan}` }} className="h-full flex flex-col">
      <div
        className="w-full h-full px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded cursor-pointer transition-colors flex flex-col items-center justify-center gap-3"
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
            className="bg-gray-700 text-white text-sm px-3 py-1 rounded w-full outline-none border border-gray-500 text-center"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <>
            <span
              onDoubleClick={(e) => {
                e.stopPropagation();
                startEditingComponent();
              }}
              className="text-sm font-medium text-center truncate max-w-full px-2 leading-tight"
            >
              {component.label}
            </span>
            {component.subcomponents && <span className="text-xs mt-2">▼</span>}
          </>
        )}
      </div>

      {isDropdownOpen && component.subcomponents && (
        <div
          className="absolute top-full left-0 mt-2 bg-gray-700 border border-gray-600 rounded shadow-lg z-50 min-w-[180px] py-2"
          onClick={(e) => e.stopPropagation()}
        >
          {component.subcomponents.map((sub) => {
            const isSubEditing = editingSubcomponentId === sub.id;

            return (
              <div
                key={sub.id}
                className="px-4 py-1.5 text-white text-xs hover:bg-gray-600 cursor-pointer"
              >
                {isSubEditing ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => finishEditingSubcomponent(sub.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') finishEditingSubcomponent(sub.id);
                      if (e.key === 'Escape') {
                        setEditingSubcomponentId(null);
                        setEditValue('');
                      }
                    }}
                    autoFocus
                    className="bg-gray-600 text-white text-xs px-2 py-1 rounded w-full outline-none border border-gray-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      startEditingSubcomponent(sub.id, sub.label);
                    }}
                    className="block w-full"
                  >
                    {sub.label}
                  </span>
                )}
              </div>
            );
          })}

          <div className="border-t border-gray-600 mx-4 mt-2 pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addSubcomponent();
              }}
              className="w-full text-left px-4 py-1.5 text-white text-xs hover:bg-gray-600 flex items-center gap-2"
            >
              <span className="text-lg font-bold">+</span>
              Add item
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
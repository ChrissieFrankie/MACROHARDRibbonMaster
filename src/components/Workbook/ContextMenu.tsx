// src/components/Workbook/ContextMenu.tsx
import { forwardRef } from "react";
import { ContextMenuPosition, RibbonGroup } from './types';

interface ContextMenuProps {
  position: ContextMenuPosition | null;
  groups: RibbonGroup[];
  onCreateGroup: (insertAfterIndex?: number) => void;
  onCreateComponent: (groupIndex: number, insertAfterIndex?: number) => void;
  onCreateDropdown: (groupIndex: number, componentIndex: number) => void;
  onDestroyDropdown: (groupIndex: number, componentIndex: number) => void;
  onAddColumn: (groupIndex: number) => void;
  onRemoveColumn: (groupIndex: number) => void;
  onMoveToPrevColumn: (groupIndex: number, componentIndex: number) => void;
  onMoveToNextColumn: (groupIndex: number, componentIndex: number) => void;
  onClose: () => void;
}

const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>((
  {
    position,
    groups,
    onCreateGroup,
    onCreateComponent,
    onCreateDropdown,
    onDestroyDropdown,
    onAddColumn,
    onRemoveColumn,
    onMoveToPrevColumn,
    onMoveToNextColumn,
    onClose,
  },
  ref
) => {
  if (!position) return null;

  const { x, y, groupIndex, componentIndex } = position;

  const handleClick = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div
      ref={ref}
      className="fixed bg-gray-700 border border-gray-600 rounded shadow-lg z-50 min-w-[180px] py-1"
      style={{ left: `${x}px`, top: `${y}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      {groupIndex === undefined && componentIndex === undefined && (
        <button
          onClick={() => handleClick(() => onCreateGroup())}
          className="w-full text-left px-4 py-2 text-white text-sm hover:bg-gray-600 transition-colors"
        >
          Create New Group
        </button>
      )}

      {groupIndex !== undefined && componentIndex === undefined && (
        <>
          <button
            onClick={() => handleClick(() => onCreateComponent(groupIndex!))}
            className="w-full text-left px-4 py-2 text-white text-sm hover:bg-gray-600 transition-colors"
          >
            Create New Component
          </button>

          <div className="border-t border-gray-600 my-1" />

          <button
            onClick={() => handleClick(() => onAddColumn(groupIndex!))}
            className="w-full text-left px-4 py-2 text-white text-sm hover:bg-gray-600 transition-colors"
          >
            Add Column
          </button>

          {(groups[groupIndex!]?.columns || 1) > 1 && (
            <button
              onClick={() => handleClick(() => onRemoveColumn(groupIndex!))}
              className="w-full text-left px-4 py-2 text-white text-sm hover:bg-gray-600 transition-colors"
            >
              Remove Column
            </button>
          )}
        </>
      )}

      {groupIndex !== undefined && componentIndex !== undefined && (
        <>
          {groups[groupIndex]?.components[componentIndex]?.subcomponents ? (
            <button
              onClick={() => handleClick(() => onDestroyDropdown(groupIndex!, componentIndex!))}
              className="w-full text-left px-4 py-2 text-white text-sm hover:bg-gray-600 transition-colors"
            >
              Destroy Dropdown
            </button>
          ) : (
            <button
              onClick={() => handleClick(() => onCreateDropdown(groupIndex!, componentIndex!))}
              className="w-full text-left px-4 py-2 text-white text-sm hover:bg-gray-600 transition-colors"
            >
              Create Dropdown Menu
            </button>
          )}

          {/* Move to Previous / Next Column */}
          {(() => {
            const group = groups[groupIndex!];
            const columns = group.columns || 1;
            if (columns <= 1) return null;

            const component = group.components[componentIndex!];
            
            // Initialize column if it doesn't exist
            const currentCol = component.column ?? (componentIndex! % columns);

            const canMovePrev = currentCol > 0;
            const canMoveNext = currentCol < columns - 1;

            if (!canMovePrev && !canMoveNext) return null;

            return (
              <>
                <div className="border-t border-gray-600 my-1" />
                {canMovePrev && (
                  <button
                    onClick={() => handleClick(() => onMoveToPrevColumn(groupIndex!, componentIndex!))}
                    className="w-full text-left px-4 py-2 text-white text-sm hover:bg-gray-600 transition-colors"
                  >
                    Move to Previous Column
                  </button>
                )}
                {canMoveNext && (
                  <button
                    onClick={() => handleClick(() => onMoveToNextColumn(groupIndex!, componentIndex!))}
                    className="w-full text-left px-4 py-2 text-white text-sm hover:bg-gray-600 transition-colors"
                  >
                    Move to Next Column
                  </button>
                )}
              </>
            );
          })()}
        </>
      )}
    </div>
  );
});

ContextMenu.displayName = "ContextMenu";

export default ContextMenu;
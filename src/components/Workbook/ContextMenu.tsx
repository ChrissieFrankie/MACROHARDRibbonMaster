// src/components/Workbook/ContextMenu.tsx
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
  onMoveLeft: (groupIndex: number, componentIndex: number) => void;
  onMoveRight: (groupIndex: number, componentIndex: number) => void;
  onClose: () => void;
}

export default function ContextMenu({
  position,
  groups,
  onCreateGroup,
  onCreateComponent,
  onCreateDropdown,
  onDestroyDropdown,
  onAddColumn,
  onRemoveColumn,
  onMoveLeft,
  onMoveRight,
  onClose,
}: ContextMenuProps) {
  if (!position) return null;

  const { x, y, groupIndex, componentIndex } = position;

  // Helper to handle click and close
  const handleClick = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div
      className="context-menu fixed bg-gray-700 border border-gray-600 rounded shadow-lg z-50 min-w-[180px] py-1"
      style={{ left: `${x}px`, top: `${y}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Right-click on empty ribbon area */}
      {groupIndex === undefined && componentIndex === undefined && (
        <button
          onClick={() => handleClick(() => onCreateGroup())}
          className="w-full text-left px-4 py-2 text-white text-sm hover:bg-gray-600 transition-colors"
        >
          Create New Group
        </button>
      )}

      {/* Right-click on a Group (but not on a component inside it) */}
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

      {/* Right-click on a Component */}
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

          {/* Move Left/Right - only if multi-column and valid move */}
          {(groups[groupIndex]?.columns || 1) > 1 && groups[groupIndex]?.components.length > 1 && (
            <>
              <div className="border-t border-gray-600 my-1" />
              {(() => {
                const group = groups[groupIndex!];
                const columns = group.columns || 1;
                const col = componentIndex! % columns;
                const currentRow = Math.floor(componentIndex! / columns);
                const nextPos = componentIndex! + 1;
                const canMoveRight =
                  col < columns - 1 &&
                  nextPos < group.components.length &&
                  Math.floor(nextPos / columns) === currentRow;

                const canMoveLeft = col > 0;

                return (
                  <>
                    {canMoveLeft && (
                      <button
                        onClick={() => handleClick(() => onMoveLeft(groupIndex!, componentIndex!))}
                        className="w-full text-left px-4 py-2 text-white text-sm hover:bg-gray-600 transition-colors"
                      >
                        Move Left
                      </button>
                    )}
                    {canMoveRight && (
                      <button
                        onClick={() => handleClick(() => onMoveRight(groupIndex!, componentIndex!))}
                        className="w-full text-left px-4 py-2 text-white text-sm hover:bg-gray-600 transition-colors"
                      >
                        Move Right
                      </button>
                    )}
                  </>
                );
              })()}
            </>
          )}
        </>
      )}
    </div>
  );
}
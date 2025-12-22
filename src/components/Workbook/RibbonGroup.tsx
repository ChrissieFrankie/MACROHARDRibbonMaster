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

  // Group components by their column property
  const componentsByColumn: { [key: number]: Array<{ component: any; originalIndex: number }> } = {};
  
  for (let col = 0; col < columns; col++) {
    componentsByColumn[col] = [];
  }

  group.components.forEach((component, index) => {
    const col = component.column ?? (index % columns);
    const validCol = Math.max(0, Math.min(col, columns - 1));
    componentsByColumn[validCol].push({ component, originalIndex: index });
  });

  // Calculate max rows across all columns
  const rowsCount = Math.max(
    ...Object.values(componentsByColumn).map(col => col.length),
    1
  );

  // Build grid differently: track which cells should be skipped due to spanning
  const gridComponents: Array<{ component: any; compIndex: number; isOnlyInColumn: boolean; rowSpan: number } | null> = [];
  const skippedCells = new Set<string>(); // Track "row,col" positions that should be skipped
  
  for (let row = 0; row < rowsCount; row++) {
    for (let col = 0; col < columns; col++) {
      const cellKey = `${row},${col}`;
      
      // Skip this cell if it's covered by a spanning component
      if (skippedCells.has(cellKey)) {
        continue; // Don't add anything - the cell is already occupied
      }
      
      const colComponents = componentsByColumn[col];
      
      if (row < colComponents.length) {
        const { component, originalIndex } = colComponents[row];
        const isOnlyInColumn = colComponents.length === 1;
        const rowSpan = isOnlyInColumn ? rowsCount : 1;
        
        gridComponents.push({ component, compIndex: originalIndex, isOnlyInColumn, rowSpan });
        
        // Mark cells below this one as skipped if it spans multiple rows
        if (rowSpan > 1) {
          for (let skipRow = row + 1; skipRow < row + rowSpan; skipRow++) {
            skippedCells.add(`${skipRow},${col}`);
          }
        }
      } else {
        // Empty cell
        gridComponents.push(null);
      }
    }
  }

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
        style={{ 
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rowsCount}, minmax(0, 1fr))`
        }}
      >
        {gridComponents.map((item, gridIndex) => {
          if (!item) {
            // Empty cell
            return <div key={`empty-${gridIndex}`} />;
          }

          const { component, compIndex, isOnlyInColumn, rowSpan } = item;
          
          // Use the rowSpan calculated during grid generation
          const gridRowStyle = rowSpan > 1 ? `span ${rowSpan}` : 'span 1';

          return (
            <div key={component.id} className="relative" style={{ gridRow: gridRowStyle }}>
              <RibbonComponent
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
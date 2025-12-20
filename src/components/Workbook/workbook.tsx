'use client';

import { useEffect, useRef, useState } from 'react';

interface RibbonSubcomponent {
  id: string;
  label: string;
}

interface RibbonComponent {
  id: string;
  label: string;
  subcomponents?: RibbonSubcomponent[];
}

interface RibbonGroup {
  id: string;
  label: string;
  components: RibbonComponent[];
}

export default function Workbook() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTab, setSelectedTab] = useState('Home');
  const [groups, setGroups] = useState<RibbonGroup[]>([]);
  const [editingComponentId, setEditingComponentId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Adjustable grid settings
    const cols = 26; // A-Z
    const rows = 50;
    const colWidth = 80;
    const rowHeight = 25;
    const headerHeight = 30;
    const headerWidth = 50;

    canvas.width = headerWidth + cols * colWidth;
    canvas.height = headerHeight + rows * rowHeight;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let i = 0; i <= cols; i++) {
      const x = headerWidth + i * colWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let j = 0; j <= rows; j++) {
      const y = headerHeight + j * rowHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Header backgrounds
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, headerHeight); // Column headers row
    ctx.fillRect(0, 0, headerWidth, canvas.height); // Row numbers column

    // Column letters (A, B, ..., Z)
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < cols; i++) {
      const letter = String.fromCharCode(65 + i);
      const x = headerWidth + i * colWidth + colWidth / 2;
      ctx.fillText(letter, x, headerHeight / 2);
    }

    // Row numbers (1, 2, ...)
    ctx.textAlign = 'center';
    for (let j = 0; j < rows; j++) {
      const y = headerHeight + j * rowHeight + rowHeight / 2;
      ctx.fillText((j + 1).toString(), headerWidth / 2, y);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdownId(null);
      }
    };

    if (openDropdownId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openDropdownId]);

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col overflow-hidden">
      {/* Simple Ribbon Placeholder – expand this into your custom MACROHARD Ribbon later */}
      <div className="bg-black border-b-2 border-gray-500 px-6 py-3 flex items-center gap-8">
      <span 
        className={`font-bold text-lg text-white cursor-pointer pb-1 ${selectedTab === 'File' ? 'border-b-2 border-green-500' : ''}`}
        onClick={() => setSelectedTab('File')}
      >
        File
      </span>
        <span 
          className={`font-bold text-lg text-white cursor-pointer pb-1 ${selectedTab === 'Home' ? 'border-b-2 border-green-500' : ''}`}
          onClick={() => setSelectedTab('Home')}
        >
          Home
        </span>
        <span 
          className={`font-bold text-lg text-white cursor-pointer pb-1 ${selectedTab === 'Insert' ? 'border-b-2 border-green-500' : ''}`}
          onClick={() => setSelectedTab('Insert')}
        >
          Insert
        </span>
        <span 
          className={`font-bold text-lg text-white cursor-pointer pb-1 ${selectedTab === 'Formulas' ? 'border-b-2 border-green-500' : ''}`}
          onClick={() => setSelectedTab('Formulas')}
        >
          Formulas
        </span>
        {/* Add macro buttons here */}
      </div>

      {/* Ribbon panel - shown when Home is selected */}
      {selectedTab === 'Home' && (
        <div className="bg-[#292929] min-h-32 border-b-2 border-[#292929] px-4 py-3">
          {/* Display groups and components */}
          <div className="flex gap-6">
            {groups.map((group, groupIndex) => (
              <div key={group.id} className="border-l border-gray-600 pl-4 relative group">
                <div className="text-white text-xs mb-2 font-semibold flex items-center justify-between">
                  {group.label}
                  <button
                    onClick={() => {
                      const newGroup: RibbonGroup = {
                        id: `group-${Date.now()}`,
                        label: `Group ${groups.length + 1}`,
                        components: []
                      };
                      const updatedGroups = [...groups];
                      updatedGroups.splice(groupIndex + 1, 0, newGroup);
                      setGroups(updatedGroups);
                    }}
                    className="opacity-50 hover:opacity-100 text-white text-lg transition-opacity ml-2"
                    title="Add Group"
                  >
                    →
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {group.components.map((component, compIndex) => (
                    <div key={component.id} className="relative dropdown-container">
                      <div
                        className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded cursor-pointer transition-colors flex items-center justify-between"
                      >
                        {editingComponentId === component.id ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => {
                              if (editValue.trim()) {
                                const updatedGroups = [...groups];
                                const currentGroup = updatedGroups[groupIndex];
                                updatedGroups[groupIndex] = {
                                  ...currentGroup,
                                  components: currentGroup.components.map(comp =>
                                    comp.id === component.id ? { ...comp, label: editValue.trim() } : comp
                                  )
                                };
                                setGroups(updatedGroups);
                              }
                              setEditingComponentId(null);
                              setEditValue('');
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.blur();
                              } else if (e.key === 'Escape') {
                                setEditingComponentId(null);
                                setEditValue('');
                              }
                            }}
                            autoFocus
                            className="bg-gray-500 text-white text-sm rounded px-2 py-1 flex-1 outline-none border border-gray-400"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              setEditingComponentId(component.id);
                              setEditValue(component.label);
                            }}
                            className="flex-1"
                          >
                            {component.label}
                          </span>
                        )}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(openDropdownId === component.id ? null : component.id);
                            }}
                            className={`opacity-50 hover:opacity-100 text-white text-lg transition-all ${
                              openDropdownId === component.id ? 'rotate-90' : ''
                            }`}
                            title="Toggle Dropdown"
                          >
                            ▶
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const updatedGroups = [...groups];
                              const currentGroup = updatedGroups[groupIndex];
                              updatedGroups[groupIndex] = {
                                ...currentGroup,
                                components: [
                                  ...currentGroup.components.slice(0, compIndex + 1),
                                  {
                                    id: `component-${Date.now()}`,
                                    label: `Component ${currentGroup.components.length + 1}`
                                  },
                                  ...currentGroup.components.slice(compIndex + 1)
                                ]
                              };
                              setGroups(updatedGroups);
                            }}
                            className="opacity-50 hover:opacity-100 text-white text-lg transition-opacity ml-2"
                            title="Add Component"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                      {openDropdownId === component.id && (
                        <div className="mt-1 ml-4 border-l-2 border-gray-600 pl-3 flex flex-col gap-1">
                          {component.subcomponents?.map((subcomp) => (
                            <div
                              key={subcomp.id}
                              className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded cursor-pointer"
                            >
                              {subcomp.label}
                            </div>
                          ))}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const updatedGroups = [...groups];
                              const currentGroup = updatedGroups[groupIndex];
                              const currentComponent = currentGroup.components[compIndex];
                              const newSubcomponent: RibbonSubcomponent = {
                                id: `subcomponent-${Date.now()}`,
                                label: `Subcomponent ${(currentComponent.subcomponents?.length || 0) + 1}`
                              };
                              updatedGroups[groupIndex] = {
                                ...currentGroup,
                                components: currentGroup.components.map(comp =>
                                  comp.id === component.id
                                    ? { ...comp, subcomponents: [...(comp.subcomponents || []), newSubcomponent] }
                                    : comp
                                )
                              };
                              setGroups(updatedGroups);
                            }}
                            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded cursor-pointer opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center"
                            title="Add Subcomponent"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {group.components.length === 0 && (
                    <button
                      onClick={() => {
                        const updatedGroups = [...groups];
                        const currentGroup = updatedGroups[groupIndex];
                        updatedGroups[groupIndex] = {
                          ...currentGroup,
                          components: [{
                            id: `component-${Date.now()}`,
                            label: 'Component 1'
                          }]
                        };
                        setGroups(updatedGroups);
                      }}
                      className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded cursor-pointer transition-colors flex items-center justify-end opacity-50 hover:opacity-100"
                      title="Add Component"
                    >
                      ↓
                    </button>
                  )}
                </div>
              </div>
            ))}
            {groups.length === 0 && (
              <button
                onClick={() => {
                  const newGroup: RibbonGroup = {
                    id: `group-${Date.now()}`,
                    label: 'Group 1',
                    components: []
                  };
                  setGroups([newGroup]);
                }}
                className="opacity-50 hover:opacity-100 text-white text-lg transition-opacity"
                title="Add Group"
              >
                →
              </button>
            )}
          </div>
        </div>
      )}

      {/* The blank spreadsheet grid */}
      <div className="flex-1 overflow-auto bg-white">
        <canvas ref={canvasRef} className="shadow-lg" />
      </div>
    </div>
  );
}
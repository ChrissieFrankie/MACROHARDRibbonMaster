// src/components/Workbook/types.ts
export interface RibbonSubcomponent {
    id: string;
    label: string;
  }
  
  export interface RibbonComponent {
    id: string;
    label: string;
    subcomponents?: RibbonSubcomponent[];
  }
  
  export interface RibbonGroup {
    id: string;
    label: string;
    components: RibbonComponent[];
    columns?: number;
  }
  
  export interface ContextMenuPosition {
    x: number;
    y: number;
    groupIndex?: number;
    componentIndex?: number;
  }
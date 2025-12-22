// src/components/Workbook/RibbonTabs.tsx
interface RibbonTabsProps {
    selectedTab: string;
    onTabChange: (tab: string) => void;
  }
  
  export default function RibbonTabs({ selectedTab, onTabChange }: RibbonTabsProps) {
    const tabs = ['File', 'Home', 'Insert', 'Formulas'];
  
    return (
      <div className="bg-black border-b-2 border-gray-500 px-6 py-3 flex items-center gap-8">
        {tabs.map((tab) => (
          <span
            key={tab}
            className={`font-bold text-lg text-white cursor-pointer pb-1 ${
              selectedTab === tab ? 'border-b-2 border-green-500' : ''
            }`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </span>
        ))}
      </div>
    );
  }
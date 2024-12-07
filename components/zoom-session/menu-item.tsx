"use client";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export function MenuItem({ icon, label, onClick }: MenuItemProps) {
  return (
    <div 
      className="w-full flex items-center px-3 py-2 hover:bg-gray-50 transition-colors duration-200 rounded-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}
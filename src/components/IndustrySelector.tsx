
import React from 'react';

interface Industry {
  id: string;
  name: string;
  icon: string;
}

interface IndustrySelectorProps {
  industries: Industry[];
  activeIndustry: string;
  onIndustryChange: (industry: string) => void;
}

export const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  industries,
  activeIndustry,
  onIndustryChange
}) => {
  return (
    <select
      value={activeIndustry}
      onChange={(e) => onIndustryChange(e.target.value)}
      className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
    >
      {industries.map(industry => (
        <option key={industry.id} value={industry.id}>
          {industry.icon} {industry.name}
        </option>
      ))}
    </select>
  );
};

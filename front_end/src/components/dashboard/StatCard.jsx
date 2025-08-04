import React from "react";

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = "positive", 
  icon: Icon, 
  color = "color-1",
  description 
}) => {
  return (
    <div className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-color-1/30 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r from-${color}/10 to-${color}/5`}>
          <Icon size={24} className={`text-${color}`} />
        </div>
        {change && (
          <div className={`text-sm font-medium ${
            changeType === 'positive' ? 'text-green-400' : 
            changeType === 'negative' ? 'text-red-400' : 'text-n-4'
          }`}>
            {changeType === 'positive' ? '+' : changeType === 'negative' ? '-' : ''}{change}
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <h3 className="text-2xl font-bold text-n-1 mb-1">{value}</h3>
        <p className="text-n-4 text-sm">{title}</p>
        {description && (
          <p className="text-n-5 text-xs mt-2">{description}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;

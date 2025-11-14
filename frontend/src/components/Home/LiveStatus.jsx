import React from "react";
import {
  Activity,
  Sun,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const LiveStatus = () => {
  const statusItems = [
    {
      id: "weather",
      icon: Sun,
      title: "Weather",
      subtitle: "28°C ",
      status: "good",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "traffic",
      icon: TrendingUp,
      title: "Traffic",
      subtitle: "Light",
      status: "good",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "crowds",
      icon: Users,
      title: "Crowds",
      subtitle: "Moderate",
      status: "moderate",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      id: "best-time",
      icon: Clock,
      title: "Best Time",
      subtitle: "3-5PM",
      status: "recommended",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  return (
    <div className="px-4 py-4 mx-4 rounded-2xl shadow-sm mb-4 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Activity className="w-5 h-5 text-red-600" />
          <span className="text-xl font-bold text-gray-800 ml-2">
            Live Status
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
          <span className="text-xs font-semibold text-green-600">LIVE</span>
          <span className="text-gray-500 text-xs ml-2">2:30 PM</span>
        </div>
      </div>

      {/* Status Items */}
      <div className="grid grid-cols-4 gap-4 mb-3">
        {statusItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              className="flex flex-col items-center active:scale-95 transition-transform"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${item.bgColor} ${item.borderColor}`}
              >
                <IconComponent className={`w-6 h-6 ${item.color}`} />
              </div>
              <span className="font-semibold text-gray-800 text-sm text-center mt-2 mb-1">
                {item.title}
              </span>
              <span className="text-gray-500 text-xs text-center">
                {item.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quick Status Bar */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700 ml-2">
              Perfect day for exploration!
            </span>
          </div>
          <span className="text-gray-500 text-xs">Updated 2:30 PM</span>
        </div>
      </div>
    </div>
  );
};

export default LiveStatus;

import { useHub } from "@sms-hub/ui";
import { getHubStatsContent } from "@sms-hub/hub-logic";

export const StatsSection: React.FC = () => {
  const { currentHub } = useHub();
  const content = getHubStatsContent(currentHub);

  return (
    <div className="bg-black rounded-lg p-12">
      <h3 className="text-2xl font-bold text-amber-400 text-center mb-8">
        {content.title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {content.stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-5xl font-bold text-white mb-2">{stat.value}</div>
            <div className="text-amber-400 font-medium">{stat.label}</div>
            <div className="text-gray-500 text-sm">{stat.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};


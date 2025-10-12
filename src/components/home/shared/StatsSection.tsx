import { useHub } from "@sms-hub/ui/marketing";
import { getHubStatsContent } from "@sms-hub/hub-logic";

export const StatsSection: React.FC = () => {
  const { currentHub } = useHub();
  const content = getHubStatsContent(currentHub);

  return (
    <div className="bg-black border-t border-gray-800/60 pt-12 md:pt-16 pb-8">
      <h3 className="text-xl md:text-2xl font-semibold text-white text-center mb-8">
        {content.title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
        {content.stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-5xl font-bold text-white mb-2">{stat.value}</div>
            <div className="text-gray-300 font-medium">{stat.label}</div>
            <div className="text-caption">{stat.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

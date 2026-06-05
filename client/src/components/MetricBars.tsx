import { motion } from 'framer-motion';

interface MetricBarsProps {
  metrics: {
    latency: number;
    throughput: number;
    cost: number;
    complexity: number;
  };
  showLabels?: boolean;
}

/**
 * Visualizes metric deltas with colored bars
 * -2 to +2 scale where:
 * - For latency/cost/complexity: lower is better (green for negative)
 * - For throughput: higher is better (green for positive)
 */
export function MetricBars({ metrics, showLabels = true }: MetricBarsProps) {
  const metricConfig = {
    latency: { label: 'Latency', inverse: true, color: 'blue' },
    throughput: { label: 'Throughput', inverse: false, color: 'green' },
    cost: { label: 'Cost', inverse: true, color: 'orange' },
    complexity: { label: 'Complexity', inverse: true, color: 'purple' }
  };

  const getBarColor = (value: number, inverse: boolean): string => {
    if (inverse) {
      // Lower is better: negative = good (green), positive = bad (red)
      if (value < 0) return 'bg-green-500';
      if (value > 0) return 'bg-red-500';
      return 'bg-gray-400';
    } else {
      // Higher is better: positive = good (green), negative = bad (red)
      if (value > 0) return 'bg-green-500';
      if (value < 0) return 'bg-red-500';
      return 'bg-gray-400';
    }
  };

  const getBarWidth = (value: number): string => {
    // Map -2..+2 to 10..90%
    const normalized = Math.max(-2, Math.min(2, value));
    const percentage = ((normalized + 2) / 4) * 80 + 10;
    return `${percentage}%`;
  };

  const getIndicatorPosition = (value: number): string => {
    // Map -2..+2 to 0..100%
    const normalized = Math.max(-2, Math.min(2, value));
    const percentage = ((normalized + 2) / 4) * 100;
    return `${percentage}%`;
  };

  return (
    <div className="space-y-3">
      {Object.entries(metrics).map(([key, value]) => {
        const config = metricConfig[key as keyof typeof metricConfig];
        const barColor = getBarColor(value, config.inverse);
        const barWidth = getBarWidth(value);
        const indicatorPos = getIndicatorPosition(value);

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-1"
          >
            {showLabels && (
              <div className="flex justify-between text-xs font-medium text-muted-foreground">
                <span>{config.label}</span>
                <span className={`font-mono ${value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {value > 0 ? '+' : ''}{value}
                </span>
              </div>
            )}
            
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              {/* Background bar */}
              <motion.div
                className={`h-full ${barColor} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: barWidth }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              
              {/* Center indicator (0 point) */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-400 dark:bg-gray-500" />
              
              {/* Value indicator dot */}
              <motion.div
                className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white dark:bg-gray-900 border-2 border-gray-800 dark:border-gray-200 rounded-full shadow-sm"
                initial={{ left: '50%' }}
                animate={{ left: indicatorPos }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {/* Scale labels */}
            {showLabels && (
              <div className="flex justify-between text-[10px] text-muted-foreground opacity-60">
                <span>-2</span>
                <span>0</span>
                <span>+2</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
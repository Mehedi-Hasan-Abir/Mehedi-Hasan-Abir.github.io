import { motion } from 'framer-motion';
import { MetricBars } from './MetricBars';
import { trackTradeoffShareResult } from '@/lib/analytics';

interface ResultsSummaryProps {
  totals: {
    latency: number;
    throughput: number;
    cost: number;
    complexity: number;
  };
  xpEarned: number;
  style: string;
  sessionCount: number;
  badges: string[];
  newBadges: string[];
  onRestart: () => void;
  sessionId: string;
  totalQuestions: number;
}

export function ResultsSummary({ 
  totals, 
  xpEarned, 
  style, 
  sessionCount, 
  badges, 
  newBadges, 
  onRestart,
  sessionId,
  totalQuestions
}: ResultsSummaryProps) {
  
  const handleShare = async () => {
    const text = `🎮 System Design Trade-off Game Results

📊 Style: ${style}
⚡ XP Earned: ${xpEarned}
📈 Sessions Completed: ${sessionCount}

Metric Totals:
• Latency: ${totals.latency > 0 ? '+' : ''}${totals.latency}
• Throughput: ${totals.throughput > 0 ? '+' : ''}${totals.throughput}
• Cost: ${totals.cost > 0 ? '+' : ''}${totals.cost}
• Complexity: ${totals.complexity > 0 ? '+' : ''}${totals.complexity}

${badges.length > 0 ? `🏆 Badges: ${badges.join(', ')}` : ''}

${newBadges.length > 0 ? `🎉 New Badges Unlocked: ${newBadges.join(', ')}` : ''}

#SystemDesign #Tradeoffs #TechLeadership`;

    try {
      await navigator.clipboard.writeText(text);
      trackTradeoffShareResult(sessionId, style);
      alert('Results copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy results. Please try again.');
    }
  };

  const determineStyle = (totals: ResultsSummaryProps['totals']): string => {
    const scores = [
      { name: 'Latency Optimizer', value: totals.latency, weight: -1 },
      { name: 'Throughput Maximizer', value: totals.throughput, weight: 1 },
      { name: 'Cost Saver', value: totals.cost, weight: -1 },
      { name: 'Simplicity-first', value: totals.complexity, weight: -1 }
    ];

    // Find the dominant style
    const sorted = scores
      .filter(s => s.value !== 0)
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

    if (sorted.length === 0) return 'Balanced';
    
    const top = sorted[0];
    if (Math.abs(top.value) < 2) return 'Balanced';
    
    return top.name;
  };

  const calculatedStyle = style || determineStyle(totals);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Session Complete! 🎉</h2>
        <p className="text-muted-foreground">Here's your system design style analysis</p>
      </div>

      {/* Style Badge */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-2xl p-6 text-center"
      >
        <div className="text-sm font-semibold text-primary mb-1">Your Design Style</div>
        <div className="text-2xl font-bold text-foreground">{calculatedStyle}</div>
        <div className="text-xs text-muted-foreground mt-2">
          Based on your choices across {totalQuestions} scenarios
        </div>
      </motion.div>

      {/* XP & Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="text-sm text-muted-foreground mb-1">XP Earned</div>
          <div className="text-3xl font-bold text-primary">{xpEarned}</div>
          <div className="text-xs text-muted-foreground mt-1">
            +10 per question +20 bonus
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="text-sm text-muted-foreground mb-1">Sessions</div>
          <div className="text-3xl font-bold text-secondary">{sessionCount}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Total completed sessions
          </div>
        </motion.div>
      </div>

      {/* Badges */}
      {(badges.length > 0 || newBadges.length > 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="text-sm font-semibold mb-3">🏆 Badges</div>
          <div className="flex flex-wrap gap-2">
            {badges.map(badge => (
              <span key={badge} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium">
                {badge}
              </span>
            ))}
            {newBadges.map(badge => (
              <motion.span
                key={badge}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-bold shadow-lg"
              >
                {badge} ✨
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Metric Totals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="text-sm font-semibold mb-4">Overall Impact</div>
        <MetricBars metrics={totals} />
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col gap-3"
      >
        <button
          onClick={handleShare}
          className="w-full py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
        >
          📋 Share Results
        </button>
        <button
          onClick={onRestart}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          🔄 Start New Session
        </button>
      </motion.div>

      {/* Session Info */}
      <div className="text-center text-xs text-muted-foreground">
        Session ID: <span className="font-mono">{sessionId}</span>
      </div>
    </motion.div>
  );
}

// Helper function to calculate totals from answers
export function calculateTotals(answers: Array<{ metrics: { latency: number; throughput: number; cost: number; complexity: number } }>) {
  return answers.reduce(
    (acc, answer) => ({
      latency: acc.latency + answer.metrics.latency,
      throughput: acc.throughput + answer.metrics.throughput,
      cost: acc.cost + answer.metrics.cost,
      complexity: acc.complexity + answer.metrics.complexity
    }),
    { latency: 0, throughput: 0, cost: 0, complexity: 0 }
  );
}

// Helper function to determine style from totals
export function determineStyle(totals: { latency: number; throughput: number; cost: number; complexity: number }): string {
  const scores = [
    { name: 'Latency Optimizer', value: totals.latency, weight: -1 },
    { name: 'Throughput Maximizer', value: totals.throughput, weight: 1 },
    { name: 'Cost Saver', value: totals.cost, weight: -1 },
    { name: 'Simplicity-first', value: totals.complexity, weight: -1 }
  ];

  const nonZero = scores.filter(s => s.value !== 0);
  if (nonZero.length === 0) return 'Balanced';

  const sorted = nonZero.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  const top = sorted[0];

  if (Math.abs(top.value) < 3) return 'Balanced';
  if (top.value > 0 && top.weight > 0) return top.name;
  if (top.value < 0 && top.weight < 0) return top.name;

  return 'Balanced';
}
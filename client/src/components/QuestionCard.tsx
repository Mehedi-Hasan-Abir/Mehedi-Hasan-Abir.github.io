import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TradeoffQuestion, TradeoffOption } from '@/data/tradeoffs';
import { MetricBars } from './MetricBars';
import { trackTradeoffChoice } from '@/lib/analytics';

interface QuestionCardProps {
  question: TradeoffQuestion;
  onAnswer: (answer: {
    questionId: string;
    optionId: string;
    metrics: {
      latency: number;
      throughput: number;
      cost: number;
      complexity: number;
    };
  }) => void;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionCard({ question, onAnswer, questionNumber, totalQuestions }: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<TradeoffOption | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionSelect = (option: TradeoffOption) => {
    if (selectedOption) return; // Prevent multiple selections

    setSelectedOption(option);
    setShowExplanation(true);

    // Track analytics
    trackTradeoffChoice({
      questionId: question.id,
      optionId: option.id,
      category: question.category,
      latencyDelta: option.metrics.latency,
      throughputDelta: option.metrics.throughput,
      costDelta: option.metrics.cost,
      complexityDelta: option.metrics.complexity
    });

    // Call parent handler after a delay for animation
    setTimeout(() => {
      onAnswer({
        questionId: question.id,
        optionId: option.id,
        metrics: option.metrics
      });
    }, 2000);
  };

  const handleNext = () => {
    setShowExplanation(false);
    setSelectedOption(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Question {questionNumber} of {totalQuestions}</span>
          <span className="font-medium text-primary">{question.category}</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6 shadow-lg mb-4"
      >
        <h3 className="text-xl font-bold mb-4 text-foreground">
          {question.scenario}
        </h3>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {['optionA', 'optionB'].map((key) => {
            const option = question[key as 'optionA' | 'optionB'];
            const isSelected = selectedOption?.id === option.id;
            const isDisabled = !!selectedOption && !isSelected;

            return (
              <motion.button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                disabled={!!selectedOption}
                whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                className={`
                  relative p-4 rounded-xl border-2 text-left transition-all
                  ${isSelected ? 'border-primary bg-primary/10' : ''}
                  ${!selectedOption ? 'border-gray-200 dark:border-gray-700 hover:border-primary/50' : ''}
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="font-bold text-lg mb-1">{option.title}</div>
                <div className="text-sm text-muted-foreground">{option.description}</div>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-2 right-2 text-primary"
                  >
                    ✓
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Explanation (shown after selection) */}
        <AnimatePresence>
          {showExplanation && selectedOption && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              {/* Optimizes For */}
              <div>
                <div className="text-sm font-semibold text-primary mb-1">Optimizes For:</div>
                <div className="text-sm text-foreground">{selectedOption.optimizesFor}</div>
              </div>

              {/* Trade-offs */}
              <div>
                <div className="text-sm font-semibold text-orange-500 mb-1">Trade-offs:</div>
                <div className="text-sm text-foreground">{selectedOption.tradeoffs}</div>
              </div>

              {/* Metric Visualization */}
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-2">Impact Analysis:</div>
                <MetricBars metrics={selectedOption.metrics} />
              </div>

              {/* Tech Lead Takeaway */}
              <div className="bg-secondary/30 p-3 rounded-lg">
                <div className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1">
                  💡 Tech Lead Takeaway:
                </div>
                <div className="text-sm text-foreground italic">
                  {selectedOption.techLeadTakeaway}
                </div>
              </div>

              {/* References */}
              {question.references && question.references.length > 0 && (
                <div>
                  <div className="text-sm font-semibold text-muted-foreground mb-1">References:</div>
                  <div className="flex flex-wrap gap-2">
                    {question.references.map((ref, idx) => (
                      <a
                        key={idx}
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {ref.title} ↗
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Button */}
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Next Question →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
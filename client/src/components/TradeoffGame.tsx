import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRADEOFF_QUESTIONS, TradeoffQuestion } from '@/data/tradeoffs';
import { useSessionState, useGameProgress } from '@/hooks/useLocalStorage';
import { 
  trackTradeoffGameView, 
  trackTradeoffSessionStart, 
  trackTradeoffSessionComplete,
  generateSessionId 
} from '@/lib/analytics';
import { QuestionCard } from './QuestionCard';
import { ResultsSummary, calculateTotals, determineStyle } from './ResultsSummary';

type GameState = 'intro' | 'playing' | 'results';

export function TradeoffGame() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [availableQuestions, setAvailableQuestions] = useState<TradeoffQuestion[]>([]);
  
  const { session, startSession, addAnswer, resetSession } = useSessionState();
  const { 
    progress, 
    addXP, 
    incrementSession, 
    addBadge, 
    updateLastSession, 
    checkBadges 
  } = useGameProgress();

  const QUESTIONS_PER_SESSION = 10;

  // Track game view on mount
  useEffect(() => {
    trackTradeoffGameView();
  }, []);

  // Initialize available questions
  useEffect(() => {
    // Shuffle and pick unique questions
    const shuffled = [...TRADEOFF_QUESTIONS].sort(() => Math.random() - 0.5);
    setAvailableQuestions(shuffled);
  }, []);

  const startNewSession = () => {
    if (availableQuestions.length === 0) return;

    const questionIds = availableQuestions
      .slice(0, QUESTIONS_PER_SESSION)
      .map(q => q.id);
    
    const sessionId = generateSessionId();
    startSession(questionIds, sessionId);
    
    trackTradeoffSessionStart(sessionId, QUESTIONS_PER_SESSION);
    setGameState('playing');
  };

  const handleAnswer = (answer: {
    questionId: string;
    optionId: string;
    metrics: {
      latency: number;
      throughput: number;
      cost: number;
      complexity: number;
    };
  }) => {
    addAnswer(answer);

    // Check if this was the last question
    if (session.currentQuestionIndex >= session.questions.length - 1) {
      completeSession();
    }
  };

  const completeSession = () => {
    if (!session.startTime) return;

    const totalTime = Math.round((Date.now() - session.startTime) / 1000);
    const totals = calculateTotals(session.answers);
    const style = determineStyle(totals);
    
    // Calculate XP: +10 per question +20 bonus
    const xpEarned = (session.answers.length * 10) + 20;

    // Update progress
    addXP(xpEarned);
    incrementSession();
    updateLastSession({ xp: xpEarned, style, totals });

    // Check for new badges
    const newBadges = checkBadges();
    newBadges.forEach(badge => addBadge(badge));

    // Track completion
    trackTradeoffSessionComplete({
      xpEarned,
      style,
      totals,
      timeSeconds: totalTime,
      sessionId: session.sessionId
    });

    setGameState('results');
  };

  const restartSession = () => {
    resetSession();
    setGameState('intro');
  };

  const getCurrentQuestion = (): TradeoffQuestion | null => {
    if (gameState !== 'playing' || !session.questions[session.currentQuestionIndex]) {
      return null;
    }
    const questionId = session.questions[session.currentQuestionIndex];
    return TRADEOFF_QUESTIONS.find(q => q.id === questionId) || null;
  };

  const currentQuestion = getCurrentQuestion();

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {gameState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6 p-6"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">
                System Design Trade-off Game
              </h2>
              <p className="text-muted-foreground">
                Test your architectural decision-making skills
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 text-left max-w-lg mx-auto space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">How it works:</h3>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Answer {QUESTIONS_PER_SESSION} system design scenarios</li>
                  <li>Choose between two architectural approaches</li>
                  <li>See metric impacts and expert takeaways</li>
                  <li>Earn XP and unlock badges</li>
                  <li>Discover your design style</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-secondary">Your Progress:</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-secondary/20 p-2 rounded">
                    <div className="text-muted-foreground">Total XP</div>
                    <div className="font-bold text-xl">{progress.totalXP}</div>
                  </div>
                  <div className="bg-secondary/20 p-2 rounded">
                    <div className="text-muted-foreground">Sessions</div>
                    <div className="font-bold text-xl">{progress.sessionCount}</div>
                  </div>
                </div>
                {progress.badges.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {progress.badges.map(badge => (
                      <span key={badge} className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-medium">
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {progress.lastSession && (
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Last Session:</div>
                  <div className="text-sm">
                    <span className="font-medium">{progress.lastSession.style}</span>
                    {' '}• {progress.lastSession.xp} XP
                  </div>
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startNewSession}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              Start Session →
            </motion.button>

            {progress.sessionCount > 0 && (
              <button
                onClick={() => {
                  if (confirm('Reset all progress? This cannot be undone.')) {
                    // Clear all localStorage
                    localStorage.removeItem('tradeoff_game_progress');
                    localStorage.removeItem('tradeoff_current_session');
                    window.location.reload();
                  }
                }}
                className="block mx-auto text-xs text-muted-foreground hover:text-red-500 underline mt-4"
              >
                Reset All Progress
              </button>
            )}
          </motion.div>
        )}

        {gameState === 'playing' && currentQuestion && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="p-4"
          >
            <QuestionCard
              question={currentQuestion}
              onAnswer={handleAnswer}
              questionNumber={session.currentQuestionIndex + 1}
              totalQuestions={session.questions.length}
            />
          </motion.div>
        )}

        {gameState === 'results' && session.answers.length > 0 && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="p-4"
          >
            <ResultsSummary
              totals={calculateTotals(session.answers)}
              xpEarned={(session.answers.length * 10) + 20}
              style={determineStyle(calculateTotals(session.answers))}
              sessionCount={progress.sessionCount}
              badges={progress.badges}
              newBadges={checkBadges()}
              onRestart={restartSession}
              sessionId={session.sessionId}
              totalQuestions={session.questions.length}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
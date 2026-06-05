import { useState, useEffect } from 'react';

/**
 * Custom hook for localStorage with type safety
 * Handles SSR and gracefully falls back to in-memory storage
 */

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';

  // Use useState to manage the value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isBrowser) {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // useEffect to sync with localStorage
  useEffect(() => {
    if (!isBrowser) return;

    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = storedValue instanceof Function ? storedValue(storedValue) : storedValue;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, isBrowser]);

  // Function to clear the value
  const clear = () => {
    if (!isBrowser) return;
    
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error clearing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setStoredValue, clear];
}

/**
 * Hook for managing game progress with specific typing
 */

export interface GameProgress {
  totalXP: number;
  sessionCount: number;
  badges: string[];
  lastSession: {
    xp: number;
    style: string;
    totals: {
      latency: number;
      throughput: number;
      cost: number;
      complexity: number;
    };
    timestamp: number;
  } | null;
}

export function useGameProgress() {
  const [progress, setProgress, clearProgress] = useLocalStorage<GameProgress>('tradeoff_game_progress', {
    totalXP: 0,
    sessionCount: 0,
    badges: [],
    lastSession: null
  });

  const addXP = (xp: number) => {
    setProgress(prev => ({
      ...prev,
      totalXP: prev.totalXP + xp
    }));
  };

  const incrementSession = () => {
    setProgress(prev => ({
      ...prev,
      sessionCount: prev.sessionCount + 1
    }));
  };

  const addBadge = (badge: string) => {
    setProgress(prev => {
      if (prev.badges.includes(badge)) return prev;
      return {
        ...prev,
        badges: [...prev.badges, badge]
      };
    });
  };

  const updateLastSession = (sessionData: {
    xp: number;
    style: string;
    totals: {
      latency: number;
      throughput: number;
      cost: number;
      complexity: number;
    };
  }) => {
    setProgress(prev => ({
      ...prev,
      lastSession: {
        ...sessionData,
        timestamp: Date.now()
      }
    }));
  };

  const checkBadges = (): string[] => {
    const newBadges: string[] = [];
    const sessionCount = progress.sessionCount;

    if (sessionCount >= 1 && !progress.badges.includes('Bronze')) {
      newBadges.push('Bronze');
    }
    if (sessionCount >= 5 && !progress.badges.includes('Silver')) {
      newBadges.push('Silver');
    }
    if (sessionCount >= 10 && !progress.badges.includes('Gold')) {
      newBadges.push('Gold');
    }

    return newBadges;
  };

  return {
    progress,
    addXP,
    incrementSession,
    addBadge,
    updateLastSession,
    checkBadges,
    clearProgress
  };
}

/**
 * Hook for managing current session state
 */

export interface SessionState {
  questions: string[];
  currentQuestionIndex: number;
  answers: Array<{
    questionId: string;
    optionId: string;
    metrics: {
      latency: number;
      throughput: number;
      cost: number;
      complexity: number;
    };
  }>;
  startTime: number | null;
  sessionId: string;
}

export function useSessionState() {
  const [session, setSession, clearSession] = useLocalStorage<SessionState>('tradeoff_current_session', {
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    startTime: null,
    sessionId: ''
  });

  const startSession = (questionIds: string[], sessionId: string) => {
    setSession({
      questions: questionIds,
      currentQuestionIndex: 0,
      answers: [],
      startTime: Date.now(),
      sessionId
    });
  };

  const addAnswer = (answer: {
    questionId: string;
    optionId: string;
    metrics: {
      latency: number;
      throughput: number;
      cost: number;
      complexity: number;
    };
  }) => {
    setSession(prev => ({
      ...prev,
      answers: [...prev.answers, answer],
      currentQuestionIndex: prev.currentQuestionIndex + 1
    }));
  };

  const resetSession = () => {
    clearSession();
  };

  return {
    session,
    startSession,
    addAnswer,
    resetSession
  };
}
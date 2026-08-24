import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoryFlipCards() {
  const emojis = ["🎮", "🎨", "🎭", "🎪", "🎯", "🎲", "🎸", "🎺"];
  
  const initializeGame = (): Card[] => {
    const cards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        value: emoji,
        isFlipped: false,
        isMatched: false,
      }));
    return cards;
  };

  const [cards, setCards] = useState<Card[]>(initializeGame());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [sessionHighScore, setSessionHighScore] = useState<number | null>(null);

  // Load session high score on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('memoryGameHighScore');
      if (stored) {
        setSessionHighScore(parseInt(stored));
      }
    }
  }, []);

  // Save high score when game is won
  useEffect(() => {
    if (matched.length === cards.length && moves > 0) {
      const currentHigh = sessionHighScore ?? Infinity;
      if (moves < currentHigh) {
        setSessionHighScore(moves);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('memoryGameHighScore', moves.toString());
        }
      }
    }
  }, [matched, cards, moves, sessionHighScore]);

  const handleCardClick = (id: number) => {
    if (flipped.includes(id) || matched.includes(id) || flipped.length >= 2) {
      return;
    }

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);

      const [first, second] = newFlipped;
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (firstCard.value === secondCard.value) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 800);
      }
    }
  };

  const resetGame = () => {
    setCards(initializeGame());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const resetHighScore = () => {
    setSessionHighScore(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('memoryGameHighScore');
    }
  };

  const isWon = matched.length === cards.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-md mx-auto p-6 bg-card rounded-2xl border border-border"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">🧠 Memory Flip Cards</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Flip cards and match pairs!
        </p>
        <div className="flex justify-center gap-4 text-center mb-4">
          <div>
            <div className="text-2xl font-bold text-primary">{moves}</div>
            <div className="text-xs text-muted-foreground">Moves</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {matched.length / 2}/{emojis.length}
            </div>
            <div className="text-xs text-muted-foreground">Matched</div>
          </div>
          {sessionHighScore !== null && (
            <div>
              <div className="text-2xl font-bold text-primary">{sessionHighScore}</div>
              <div className="text-xs text-muted-foreground">Best (Session)</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {cards.map((card) => {
          const isRevealed = flipped.includes(card.id) || matched.includes(card.id);
          const isMatched = matched.includes(card.id);

          return (
            <motion.button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card.id)}
              aria-label={`Card ${card.id + 1}: ${
                isRevealed ? `${card.value}${isMatched ? ", matched" : ""}` : "hidden"
              }`}
              aria-pressed={isRevealed}
              className={`aspect-square rounded-lg font-2xl transition-all ${
                isRevealed
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80 text-muted-foreground"
              } ${isMatched ? "ring-2 ring-primary/50" : ""}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isRevealed ? card.value : "?"}
            </motion.button>
          );
        })}
      </div>

      {isWon && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-4 p-4 bg-primary/10 rounded-lg border border-primary/30"
        >
          <p className="text-lg font-bold text-primary mb-2">🎉 You Won!</p>
          <p className="text-sm text-muted-foreground mb-2">
            Completed in {moves} moves
          </p>
          {sessionHighScore !== null && moves <= sessionHighScore && (
            <p className="text-xs font-bold text-primary">
              ⭐ NEW BEST SCORE! (Session)
            </p>
          )}
        </motion.div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={resetGame}
          className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all"
        >
          {isWon ? "Play Again" : "Reset"}
        </button>
        {sessionHighScore !== null && (
          <button
            type="button"
            onClick={resetHighScore}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-all text-sm"
          >
            Reset Best
          </button>
        )}
      </div>
    </motion.div>
  );
}

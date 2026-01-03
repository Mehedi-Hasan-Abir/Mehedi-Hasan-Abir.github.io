import { useState } from "react";
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
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-lg font-2xl transition-all ${
              flipped.includes(card.id) || matched.includes(card.id)
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80 text-muted-foreground"
            } ${matched.includes(card.id) ? "ring-2 ring-primary/50" : ""}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {flipped.includes(card.id) || matched.includes(card.id)
              ? card.value
              : "?"}
          </motion.button>
        ))}
      </div>

      {isWon && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-4 p-4 bg-primary/10 rounded-lg border border-primary/30"
        >
          <p className="text-lg font-bold text-primary mb-2">🎉 You Won!</p>
          <p className="text-sm text-muted-foreground">
            Completed in {moves} moves
          </p>
        </motion.div>
      )}

      <button
        onClick={resetGame}
        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all"
      >
        {isWon ? "Play Again" : "Reset"}
      </button>
    </motion.div>
  );
}

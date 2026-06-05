# System Design Trade-off Game

A lightweight, accessible React component that simulates architectural decision-making scenarios.

## Features

- **10 Questions per Session**: Randomly sampled from 20+ questions
- **No Right/Wrong Answers**: Focuses on design style and trade-offs
- **Metric Visualization**: Shows impact on latency, throughput, cost, and complexity
- **XP & Badges**: Gamification with localStorage persistence
- **Analytics**: GA4 integration for tracking user behavior
- **Accessible**: Keyboard navigation and screen reader support

## Architecture

### Components
- `TradeoffGame` - Main state machine (intro → playing → results)
- `QuestionCard` - Individual question with options and explanations
- `MetricBars` - Visual metric delta representation
- `ResultsSummary` - Session summary with style analysis
- `GamesSection` - Two-column layout wrapper

### Hooks
- `useLocalStorage` - Type-safe localStorage with SSR support
- `useGameProgress` - Manages XP, sessions, and badges
- `useSessionState` - Tracks current session answers

### Data
- `tradeoffs.ts` - 20+ questions with AI infrastructure focus
- `analytics.ts` - Safe GA4 wrapper

## Usage

### Standalone Page
```tsx
import { TradeoffGamePage } from '@/components/TradeoffGamePage';

function MyPage() {
  return <TradeoffGamePage />;
}
```

### Integrated in Portfolio (Two-Column Layout)
```tsx
import { GamesSection } from '@/components/GamesSection';

function Home() {
  return (
    <main>
      {/* Other sections */}
      <GamesSection /> {/* MemoryGame + TradeoffGame side by side */}
    </main>
  );
}
```

## Analytics Events

All events are safely tracked and won't crash if gtag is missing:

- `tradeoff_game_view` - When game is rendered
- `tradeoff_session_start` - When user starts a session
- `tradeoff_choice` - On each question answer
- `tradeoff_session_complete` - When all 10 questions done
- `tradeoff_share_result` - When user copies results

## Design Styles

The game categorizes users into:
- **Latency Optimizer** - Prioritizes speed
- **Throughput Maximizer** - Focuses on scale
- **Cost Saver** - Minimizes expenses
- **Simplicity-first** - Prefers simple solutions
- **Balanced** - Mix of approaches

## Badges

- 🥉 Bronze (1 session)
- 🥈 Silver (5 sessions)
- 🥇 Gold (10 sessions)

## Data Persistence

All progress is stored in localStorage:
- `tradeoff_game_progress` - Total XP, sessions, badges
- `tradeoff_current_session` - Active session state

## Question Categories

- **AI Infrastructure** (5+ questions)
  - vLLM vs TGI
  - AWQ/GPTQ quantization
  - FlashAttention vs standard
  - KV cache quantization
  - RAG approaches

- **API & Messaging** (5+ questions)
  - REST vs GraphQL
  - Kafka vs RabbitMQ
  - WebSockets vs SSE
  - JWT vs Sessions

- **Database & Storage** (5+ questions)
  - SQL vs NoSQL
  - Elasticsearch vs Typesense
  - S3 vs MinIO

- **Infrastructure** (5+ questions)
  - Monolith vs Microservices
  - Kubernetes vs Docker Swarm
  - Redis vs Memcached
  - Nginx vs HAProxy

## Accessibility

- Keyboard navigation (Tab, Enter, Space)
- Focus indicators
- Screen reader announcements
- Motion reduction support
- High contrast friendly

## Performance

- No external dependencies beyond React/Framer Motion
- Lazy loading friendly
- Minimal bundle impact
- Optimized animations

## Customization

### Styling
Uses Tailwind classes. Override via `className` props.

### Questions
Edit `client/src/data/tradeoffs.ts` to add/remove questions.

### Metrics
Adjust scale in `MetricBars` component if needed.

### XP/Badges
Modify logic in `useGameProgress` hook.

## Testing

```bash
# Type check
npm run check

# Run tests (if any)
npm test
```

## Future Enhancements

- [ ] Multi-language support
- [ ] Share to social media
- [ ] Leaderboard
- [ ] Question difficulty levels
- [ ] Team mode
- [ ] Export results as PDF
- [ ] Dark/light theme toggle for game
- [ ] Sound effects
- [ ] Tutorial mode
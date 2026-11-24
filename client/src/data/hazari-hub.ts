/**
 * The Hazari section: one hub page at /hazari/ that links to every Hazari article.
 *
 * Each article is a real page with its own question, numbers or build story, and every one
 * ends with the same two choices, so a reader who is curious about the game can start playing:
 * practise alone against the computer, or keep score and share the banter with friends.
 */
export const HAZARI_APP_URL = "https://hazari-card-game-scoring.vercel.app/";
export const HAZARI_PLAY_URL = "https://hazari-card-game-scoring.vercel.app/play";

export const HAZARI_HUB = {
  path: "/hazari/",
  title: "Hazari Card Game: Odds, Strategy and Scoring Guides",
  heading: "Hazari card game guides",
  description:
    "Odds, strategy, scoring examples and build notes for the Hazari card game, from the developer of a free Hazari scorekeeper that also plays against the computer.",
  intro:
    "Hazari is a four-player card game played in South Asia. Each player arranges 13 cards into groups, the groups are compared, and the points add up to a running score until someone reaches 1,000. These pages explain the numbers, the strategy and the scoring, and show how the free scorekeeper behind them is built.",
} as const;

/** Order in which topics appear on the hub page. */
export const HAZARI_TOPICS = [
  "Odds and numbers",
  "Strategy",
  "Scoring and house rules",
  "Playing with friends",
  "Behind the app",
] as const;

export const HAZARI_CTA = {
  heading: "Play it or score it",
  text: "Play Hazari alone against the computer, or keep score and share the banter with your friends. It is free and works offline.",
  play: { label: "Play against the computer", href: HAZARI_PLAY_URL },
  score: { label: "Keep score and share live", href: HAZARI_APP_URL },
} as const;

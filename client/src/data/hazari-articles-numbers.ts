import type { Article } from "./articles";

/**
 * Hazari articles built on counted numbers. Every figure here was produced by running the same
 * game engine that powers the app's computer opponent, not estimated by hand:
 * - all 22,100 three-card hands were classified one by one;
 * - 400 whole games were simulated between four computer players that arrange their cards at random;
 * - the arrangement counts come from enumerating every split of a 13-card hand.
 * The simulations follow the standard four-player rules described by Pagat, with the assumptions
 * listed in the articles. They describe those rules, not any particular family's table.
 */
export const numbersArticles: Article[] = [
  {
    slug: "hazari-three-card-hand-odds",
    title: "How Rare Is a Troy? The Odds of Every Three-Card Hand in Hazari",
    summary:
      "Exact odds for Troy, Colour Run, Run, Colour, Pair and Indi in Hazari, counted across all 22,100 three-card hands, plus a surprise about which is rarer.",
    date: "2026-11-24",
    tags: ["Hazari", "Card Games", "Probability", "Odds"],
    hub: "hazari",
    topic: "Odds and numbers",
    blocks: [
      { t: "p", text: "In Hazari every group of cards is judged as a three-card hand. The order, from strongest to weakest, is Troy, Colour Run, Run, Colour, Pair and Indi. Knowing the order is easy. Knowing how rare each hand is tells you how much to trust a group when you arrange your cards." },
      { t: "p", text: "I counted them. There are 22,100 different ways to pick three cards from a 52-card deck, and I ran every one of them through the same function the game engine uses to rank hands." },
      { t: "h2", text: "The numbers" },
      {
        t: "ul",
        items: [
          "**Troy** (three cards of one rank): 52 hands, 0.235%, about 1 in 425.",
          "**Colour Run** (a sequence in one suit): 48 hands, 0.217%, about 1 in 460.",
          "**Run** (a sequence in mixed suits): 720 hands, 3.258%, about 1 in 31.",
          "**Colour** (one suit, no sequence): 1,096 hands, 4.959%, about 1 in 20.",
          "**Pair** (two cards of one rank): 3,744 hands, 16.941%, about 1 in 6.",
          "**Indi** (none of the above): 16,440 hands, 74.389%, about three in four.",
        ],
      },
      { t: "p", text: "The six counts add up to 22,100, which is a useful check on the counting." },
      { t: "h2", text: "A surprise: Colour Run is rarer than Troy" },
      { t: "p", text: "Hazari ranks a Troy above a Colour Run, but there are only 48 Colour Runs against 52 Troys. In a random three-card hand a Colour Run is slightly harder to get. The ranking is a convention of the game, not a ranking by rarity, so do not be surprised when a table argues about it." },
      { t: "p", text: "The same counts appear in three-card poker, which uses the same six hands. That agreement is a good independent check that the counting is right." },
      { t: "h2", text: "What the odds mean for a group" },
      { t: "p", text: "Rank a hand by how many other three-card hands it beats and the picture becomes clearer:" },
      {
        t: "ul",
        items: [
          "A **Pair** beats every Indi, so it already beats about three hands in four.",
          "A **Colour** beats about 91% of all hands.",
          "A **Run** beats about 96%.",
          "A **Troy** or **Colour Run** beats more than 99%.",
        ],
      },
      { t: "p", text: "These figures are the reason a plain Pair is a respectable group, and why the computer opponent in the scorekeeper treats the jump from Indi to Pair as worth far more than the jump from Run to Colour Run. The [article on how the computer chooses its cards](/blog/how-the-hazari-computer-opponent-works/) uses exactly this idea." },
      { t: "h2", text: "A limit of these numbers" },
      { t: "p", text: "These are odds for three random cards. In the real game you hold 13 cards and choose how to group them, so you can build a Pair or a Colour far more often than random chance suggests. The [number of ways to arrange 13 cards](/blog/ways-to-arrange-13-cards-hazari/) shows how much choice you actually have." },
      { t: "p", text: "Rank order and tie-breaks follow the standard rules in the [Hazari rules guide](https://hazari-card-game-scoring.vercel.app/hazari-game-rules). Check your own table's variations before you rely on a close call." },
    ],
  },
  {
    slug: "why-hazari-deal-is-360-points",
    title: "Why Every Hazari Deal Is Worth Exactly 360 Points",
    summary:
      "The arithmetic behind 360 points per deal, how it splits across the four rounds, and the one-line check that catches most Hazari scoring mistakes.",
    date: "2026-11-24",
    tags: ["Hazari", "Card Games", "Scoring", "Arithmetic"],
    hub: "hazari",
    topic: "Odds and numbers",
    blocks: [
      { t: "p", text: "Every deal of standard Hazari hands out exactly 360 points, no more and no less. That fixed total is the most useful fact in the scoring, because it lets you catch mistakes in seconds. Here is where it comes from." },
      { t: "h2", text: "The arithmetic" },
      {
        t: "ul",
        items: [
          "In each suit, the ace, king, queen, jack and ten are worth 10 points each. That is five cards and 50 points.",
          "The 2 through the 9 are worth 5 points each. That is eight cards and 40 points.",
          "One suit is worth 50 + 40 = 90 points.",
          "Four suits are worth 4 × 90 = **360 points**.",
        ],
      },
      { t: "p", text: "Put another way, 20 cards are worth 10 points (200 points) and 32 cards are worth 5 points (160 points). The full table is in the [Hazari card points guide](https://hazari-card-game-scoring.vercel.app/hazari-card-points)." },
      { t: "h2", text: "How the 360 points reach players" },
      { t: "p", text: "Each player arranges 13 cards into groups of 3, 3, 3 and 4. The groups are compared one round at a time, and the winner of a round takes every card played in it. The first three rounds each contain 12 cards (four players, three cards each). The last round contains 16 cards because each player puts down four." },
      { t: "p", text: "The average card is worth 360 ÷ 52, a little under 7 points. So on average:" },
      {
        t: "ul",
        items: [
          "A 12-card round holds about **83 points**.",
          "The 16-card round holds about **111 points**, nearly a third of the whole deal.",
        ],
      },
      { t: "p", text: "A real round can hold more or fewer points than the average, depending on which cards were played. The point is that the last round is the biggest prize, which is why the [four-card group](/blog/hazari-four-card-group/) deserves more thought than its position suggests." },
      { t: "h2", text: "The one-line check" },
      { t: "p", text: "After each deal, add up the points every player collected. The answer must be 360. If it is not, someone miscounted, and you know it before the totals are written down." },
      { t: "p", text: "If three players have 275 between them, the fourth must have 85. If the scores add up to 350, ten points went missing. A common slip is counting a ten as 5 points or a 9 as 10." },
      { t: "p", text: "The scorekeeper uses this check. When a round does not add up to the round total, it asks you to confirm before saving instead of silently accepting it. It does not block you, because some tables play with different totals." },
      { t: "h2", text: "When 360 is not the total" },
      { t: "p", text: "Some tables use other point values or totals. The [house rules checklist](/blog/hazari-house-rules-checklist/) lists what to agree on before the first deal. If you change the card values, change the expected total with them." },
      { t: "p", text: "Want to see a full game of these deals added up? The [worked scoring example](/blog/hazari-scoring-worked-example/) follows one game to 1,000." },
    ],
  },
  {
    slug: "how-many-deals-in-a-game-of-hazari",
    title: "How Many Deals Does a Game of Hazari to 1,000 Take?",
    summary:
      "I simulated 400 whole Hazari games to find out. The average is about eight deals, the shortest possible is three, and the results show why skill shortens games.",
    date: "2026-11-24",
    tags: ["Hazari", "Card Games", "Simulation", "Game Length"],
    hub: "hazari",
    topic: "Odds and numbers",
    blocks: [
      { t: "p", text: "You are about to start a game of Hazari to 1,000. How long will it last? Players guess anything from a handful of deals to an evening that never ends. I simulated 400 complete games to get a number." },
      { t: "h2", text: "How I tested it" },
      { t: "p", text: "Four computer players played each game under the standard rules: 13 cards each, groups of 3, 3, 3 and 4, scores carried from deal to deal, and the game ending when someone reaches 1,000. In this first test every player arranged their cards at random, within the rules. That makes it a floor for skill, not a picture of how people play." },
      { t: "p", text: "The simulation also assumes the deal passes to the next player each time and the player after the dealer leads the first round. If your table differs, the exact numbers will shift a little." },
      { t: "h2", text: "What came out" },
      {
        t: "ul",
        items: [
          "**Average:** 7.9 deals per game.",
          "**Middle game:** 8 deals.",
          "**Shortest:** 3 deals. **Longest:** 11 deals.",
          "**Typical range:** 8 games in 10 lasted between 6 and 10 deals.",
        ],
      },
      { t: "p", text: "The minimum of three deals is not luck. One deal is worth 360 points, so two deals can give a player at most 720. Reaching 1,000 needs at least three, and that needs a near-perfect run." },
      { t: "h2", text: "Does the seat matter?" },
      { t: "p", text: "Across the 400 games the four seats won 95, 92, 107 and 106 times. That is close to an even split of 100 each, so I found no sign that sitting first or last helps. Two games ended with two players tied for the top score." },
      { t: "h2", text: "Skill shortens the game" },
      { t: "p", text: "Strong arrangement ends games faster, because one player keeps winning rounds and the points pile up in one place." },
      {
        t: "ul",
        items: [
          "One player choosing the best of 40 random arrangements against three random players won all 200 simulated games, in about 4.3 deals on average.",
          "One player using an exhaustive search for the best arrangement, against the same three random players, won all 60 simulated games, in about 3.3 deals on average.",
        ],
      },
      { t: "p", text: "So if a game drags on, a likely reason is that nobody is arranging much better than anyone else. A table of evenly matched players trades points around for longer." },
      { t: "h2", text: "Planning an evening" },
      { t: "p", text: "Plan for around eight deals, and be ready for six or ten. Time one deal at your table and multiply. If you want a shorter game, a lower target is easy to agree on; the [house rules checklist](/blog/hazari-house-rules-checklist/) covers it." },
      { t: "p", text: "Scores add up fast, so keeping them in one place matters. See the [full game worked example](/blog/hazari-scoring-worked-example/) for how the totals build up." },
    ],
  },
  {
    slug: "ways-to-arrange-13-cards-hazari",
    title: "200,200 Ways to Arrange 13 Cards: Why Hazari Is Harder Than It Looks",
    summary:
      "A 13-card Hazari hand can be split into groups in 200,200 ways. About a tenth are legal. Here is the counting, and why arranging is the real skill.",
    date: "2026-11-24",
    tags: ["Hazari", "Card Games", "Combinatorics", "Strategy"],
    hub: "hazari",
    topic: "Odds and numbers",
    blocks: [
      { t: "p", text: "In Hazari nobody plays a card from the hand one by one. You arrange all 13 cards into groups before the first round begins, and the arrangement is hidden until the groups are compared. Everything depends on that one decision, so it is worth knowing how large the decision is." },
      { t: "h2", text: "Counting the splits" },
      { t: "p", text: "The groups are three, three, three and four cards. To count the ways to split 13 cards:" },
      {
        t: "ol",
        items: [
          "Choose the four cards for the last group: 13 choose 4, which is **715** ways.",
          "Split the other nine cards into three groups of three. The order of those groups does not matter yet, which gives **280** ways.",
          "Multiply: 715 × 280 = **200,200** different splits.",
        ],
      },
      { t: "p", text: "That is the number of ways to divide any 13-card hand. It is a little over two hundred thousand." },
      { t: "h2", text: "Most of them are not allowed" },
      { t: "p", text: "The rules say the groups must go from strongest to weakest, with the four-card group last and the weakest of all. The four-card group is judged by its best three cards. A split where the four-card group beats any of the other groups is illegal." },
      { t: "p", text: "I counted the legal splits for twelve random hands. The numbers ranged from 14,153 to 25,622, and the average was about 20,650. So roughly one split in ten is legal." },
      { t: "p", text: "Once a split is legal, the strongest-first order is settled, because you simply sort the three groups of three by strength." },
      { t: "h2", text: "What that means for a player" },
      {
        t: "ul",
        items: [
          "Nobody can check 20,000 arrangements by eye, so human arranging is a matter of principles and pattern spotting.",
          "A computer can check them all. The scorekeeper's hardest computer opponent does exactly that.",
          "The choice matters a great deal. In simulation, a player who picked the best arrangement beat three players who arranged at random in every game I ran.",
        ],
      },
      { t: "p", text: "You do not need to count to play well. A few principles remove most of the choices, and the [practical guide to arranging your cards](/blog/how-to-arrange-cards-in-hazari/) lists them." },
            { t: "p", text: "To see what a computer does with all of them, read [how the Hazari computer opponent chooses its cards](/blog/how-the-hazari-computer-opponent-works/). To see how strong a single group is, check the [odds of every three-card hand](/blog/hazari-three-card-hand-odds/)." },
      { t: "p", text: "For the rules that decide which splits are legal, see the [Hazari rules guide](https://hazari-card-game-scoring.vercel.app/hazari-game-rules)." },
    ],
  },
];

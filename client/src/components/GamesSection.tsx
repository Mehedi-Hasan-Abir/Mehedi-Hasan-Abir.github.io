import { MemoryFlipCards } from './MemoryFlipCards';
import { TradeoffGame } from './TradeoffGame';
import { SectionHeading } from './SectionHeading';

/**
 * Combined games section showing MemoryGame and TradeoffGame in a two-column layout
 * Desktop: side by side
 * Mobile: stacked vertically
 */
export function GamesSection() {
  return (
    <section id="games" className="py-24 md:py-32 bg-background/50">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Fun & Games" 
          subtitle="Test your memory and architectural skills"
        />
        
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Memory Game - Left Column */}
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-foreground">Memory Flip Cards</h3>
              <p className="text-sm text-muted-foreground">Classic matching game</p>
            </div>
            <div className="flex justify-center">
              <MemoryFlipCards />
            </div>
          </div>

          {/* Tradeoff Game - Right Column */}
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-foreground">System Design Trade-offs</h3>
              <p className="text-sm text-muted-foreground">Architectural decision making</p>
            </div>
            <div className="flex justify-center">
              <TradeoffGame />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import { TradeoffGame } from './TradeoffGame';
import { SectionHeading } from './SectionHeading';

/**
 * Page wrapper component for the Tradeoff Game
 * Can be used standalone or integrated into the main portfolio
 */
export function TradeoffGamePage() {
  return (
    <section id="tradeoff-game" className="py-24 md:py-32 bg-background/50">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="System Design Game" 
          subtitle="Test your architectural decision-making skills"
        />
        
        <div className="mt-12 flex justify-center">
          <div className="w-full max-w-4xl">
            <TradeoffGame />
          </div>
        </div>
      </div>
    </section>
  );
}
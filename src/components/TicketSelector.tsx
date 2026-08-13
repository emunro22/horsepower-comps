'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { useStore } from '@/lib/store';

interface TicketSelectorProps {
  competitionId: string;
  competitionTitle: string;
  imageUrl: string;
  ticketPrice: number;
  maxPerPerson: number;
  remainingTickets: number;
}

const quickPicks = [1, 5, 10, 25, 50];

export default function TicketSelector({ competitionId, competitionTitle, imageUrl, ticketPrice, maxPerPerson, remainingTickets }: TicketSelectorProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useStore();
  const max = Math.min(maxPerPerson, remainingTickets);
  const total = quantity * ticketPrice;

  const handleChange = (val: number) => {
    setQuantity(Math.max(1, Math.min(val, max)));
  };

  const handleAddToCart = () => {
    addToCart({
      competitionId,
      competitionTitle,
      imageUrl,
      ticketPrice,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground mb-1">Get Your Tickets</h3>
        <p className="text-sm text-muted font-medium">
          {formatPrice(ticketPrice)} per ticket &middot; Max {maxPerPerson} per person
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {quickPicks.filter((n) => n <= max).map((n) => (
          <button
            key={n}
            onClick={() => setQuantity(n)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              quantity === n
                ? 'bg-primary text-background glow-primary'
                : 'bg-background border border-border text-muted hover:text-foreground hover:border-primary/50'
            }`}
          >
            {n} {n === 1 ? 'ticket' : 'tickets'}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => handleChange(quantity - 1)}
          disabled={quantity <= 1}
          className="w-12 h-12 rounded-xl bg-background border border-border text-foreground font-bold text-xl flex items-center justify-center hover:border-primary/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          -
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => handleChange(parseInt(e.target.value) || 1)}
          min={1}
          max={max}
          className="flex-1 h-12 bg-background border border-border rounded-xl text-center text-lg font-black text-foreground focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={() => handleChange(quantity + 1)}
          disabled={quantity >= max}
          className="w-12 h-12 rounded-xl bg-background border border-border text-foreground font-bold text-xl flex items-center justify-center hover:border-primary/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>

      <div className="bg-background rounded-xl p-4 flex items-center justify-between">
        <span className="text-muted font-semibold">Total</span>
        <span className="text-2xl font-black text-foreground">
          {formatPrice(total)}
        </span>
      </div>

      <button
        onClick={handleAddToCart}
        className={`w-full py-4 font-black text-lg rounded-xl transition-all hover:scale-[1.02] ${
          added
            ? 'bg-success text-background glow-success'
            : 'bg-primary hover:bg-primary-light text-background glow-primary'
        }`}
      >
        {added ? '✓ Added to Cart' : 'Add to Cart'}
      </button>

      <p className="text-xs text-muted text-center font-medium">
        We&apos;re currently only accepting payment by bank transfer. You must be 18+ to enter.
      </p>
    </div>
  );
}

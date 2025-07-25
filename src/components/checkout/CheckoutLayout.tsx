
import Navigation from '@/components/Navigation';

interface CheckoutLayoutProps {
  children: React.ReactNode;
}

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-souq-cream to-souq-sand">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="glass-card rounded-2xl shadow-luxury p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

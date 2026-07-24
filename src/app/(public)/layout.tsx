import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { CustomCursor } from '@/components/public/CustomCursor';
import { PageTransition } from '@/components/public/PageTransition';
import { TransitionLoader } from '@/components/public/TransitionLoader';
import { CartProvider } from '@/components/store/CartProvider';

const CLUB_NAME = 'Grandes Paisas';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <CustomCursor />
        <TransitionLoader />
        <Navbar clubName={CLUB_NAME} />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer clubName={CLUB_NAME} />
      </div>
    </CartProvider>
  );
}


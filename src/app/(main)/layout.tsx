import PaymentNotice from '@/components/PaymentNotice';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import InstantWinReveal from '@/components/InstantWinReveal';
import CookieBanner from '@/components/CookieBanner';
import { StoreProvider } from '@/lib/store';
import { AuthProvider } from '@/lib/auth-context';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <StoreProvider>
        <PaymentNotice />
        <AnnouncementBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <InstantWinReveal />
        <CookieBanner />
      </StoreProvider>
    </AuthProvider>
  );
}

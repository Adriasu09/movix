import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, Play } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Button } from '@/shared/components/ui/Button';
import { AppNav } from '@/shared/components/layout/AppNav';
import { MobileMenuDrawer } from '@/shared/components/layout/MobileMenuDrawer';
import { NavbarSearch } from '@/shared/components/layout/NavbarSearch';
import { ROUTES } from '@/config/routesConfig';
import copy from '@/config/copy.json';

export const Navbar = ({ variant = 'app' }) => {
  if (variant === 'welcome') return <WelcomeNavbar />;
  return <AppNavbar />;
};

const Brand = () => (
  <NavLink to={ROUTES.home} className="flex items-center gap-xs">
    <Play aria-hidden="true" className="h-4 w-4 fill-gold-500 text-gold-500 md:h-5 md:w-5" />
    <span className="font-display text-display-xs tracking-tight text-gold-500 uppercase">
      {copy.appName}
    </span>
  </NavLink>
);

const AuthControls = () => {
  const navigate = useNavigate();
  return (
    <>
      <SignedOut>
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.signIn)}>
          {copy.auth.signIn}
        </Button>
      </SignedOut>
      <SignedIn>
        <UserButton
          afterSignOutUrl={ROUTES.home}
          appearance={{
            elements: {
              userButtonAvatarBox: 'w-9 h-9 ring-2 ring-gold-500/30',
            },
          }}
        />
      </SignedIn>
    </>
  );
};

const WelcomeNavbar = () => (
  <header className="fixed inset-x-0 top-0 z-50">
    <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-lg md:h-18 md:px-2xl">
      <Brand />
      <AuthControls />
    </div>
  </header>
);

const AppNavbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'border-b border-border-default/30 bg-bg-base/95 backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <div className="relative mx-auto flex h-14 max-w-7xl items-center justify-between px-lg md:h-18 md:px-2xl">
          <div className="flex items-center gap-md md:gap-lg">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={copy.nav.openMenuAria}
              className="rounded-mvx-sm p-xs text-text-primary transition-colors hover:text-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:outline-none md:hidden"
            >
              <Menu aria-hidden="true" className="h-5 w-5" />
            </button>

            <Brand />

            <div className="hidden md:block">
              <AppNav orientation="horizontal" />
            </div>
          </div>

          <div className="flex items-center gap-sm">
            <NavbarSearch />
            <AuthControls />
          </div>
        </div>
      </header>

      <MobileMenuDrawer isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

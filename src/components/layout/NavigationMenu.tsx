import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming react-router-dom
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // For mobile menu
import { Menu, Search, Briefcase, UserCircle, LogIn, UserPlus } from 'lucide-react'; // Example icons

// Placeholder navigation links
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Browse Services' },
  { href: '/post-job', label: 'Post a Job' },
  { href: '/help', label: 'Help Center' },
];

const NavigationMenu: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = false; // Placeholder for auth state

  console.log("Rendering NavigationMenu");

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand Name */}
          <Link to="/" className="text-2xl font-bold text-primary">
            ServicePlatform
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons & Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="outline">
                  <UserCircle className="mr-2 h-4 w-4" /> Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">
                    <LogIn className="mr-2 h-4 w-4" /> Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 p-4">
                  <Link to="/" className="text-xl font-bold text-primary mb-4" onClick={() => setIsMobileMenuOpen(false)}>
                    ServicePlatform
                  </Link>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-base text-muted-foreground hover:text-primary transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <hr/>
                  {isAuthenticated ? (
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <UserCircle className="mr-2 h-5 w-5" /> Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <LogIn className="mr-2 h-5 w-5" /> Login
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full justify-start">
                          <UserPlus className="mr-2 h-5 w-5" /> Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default NavigationMenu;
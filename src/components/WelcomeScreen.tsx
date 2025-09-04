import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Car, User, ChevronRight } from '@phosphor-icons/react';
import { Driver } from '@/types';

interface WelcomeScreenProps {
  driver: Driver;
  onSignIn: () => void;
  onSwitchAccount: () => void;
}

export function WelcomeScreen({ driver, onSignIn, onSwitchAccount }: WelcomeScreenProps) {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    // Simulate sign-in process
    setTimeout(() => {
      onSignIn();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex flex-col">
      {/* Status bar spacer */}
      <div className="h-12" />
      
      {/* GQ Cars Logo and Branding */}
      <div className="text-center px-8 pt-8 pb-12">
        <div className="flex items-center justify-center mb-3">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
            <Car size={32} className="text-primary-foreground" weight="bold" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-primary mb-2">
          GQ Cars
        </h1>
        <p className="text-lg text-muted-foreground font-medium">
          for drivers
        </p>
      </div>

      {/* Driver Profile Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Driver Avatar */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 border-4 border-primary/20 flex items-center justify-center overflow-hidden">
            <User size={48} className="text-primary" weight="duotone" />
          </div>
          {/* Online status indicator */}
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-card rounded-full border-4 border-card flex items-center justify-center">
            <div className="w-4 h-4 bg-success rounded-full"></div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
            Hello,
          </h2>
          <h1 className="text-3xl font-bold text-foreground">
            {driver.name}
          </h1>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-8 pb-12 space-y-4">
        <Button
          onClick={handleSignIn}
          disabled={isSigningIn}
          className="w-full h-14 text-lg font-semibold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
        >
          {isSigningIn ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Signing in...
            </div>
          ) : (
            "Sign in"
          )}
        </Button>

        <Button
          variant="ghost"
          onClick={onSwitchAccount}
          className="w-full h-12 text-base font-medium text-muted-foreground hover:text-foreground"
        >
          Sign in to a different account
        </Button>
      </div>

      {/* App Version */}
      <div className="text-center pb-6">
        <p className="text-xs text-muted-foreground">
          v1.0.0 (20241201)
        </p>
      </div>

      {/* Bottom indicator (home indicator for iPhone-style) */}
      <div className="h-8 flex justify-center items-end pb-2">
        <div className="w-32 h-1 bg-muted-foreground/30 rounded-full" />
      </div>
    </div>
  );
}
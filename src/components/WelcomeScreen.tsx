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
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Status bar spacer */}
      <div className="h-12" />
      
      {/* App Branding Header */}
      <div className="text-center px-8 pt-8 pb-16">
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Car size={40} className="text-white" weight="bold" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          GQ Cars
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
          Professional Driver
        </p>
      </div>

      {/* Driver Profile Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Driver Avatar - circular and prominent */}
        <div className="relative mb-8">
          <div className="w-36 h-36 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-gray-100 dark:border-gray-600 flex items-center justify-center overflow-hidden shadow-lg">
            <User size={60} className="text-gray-500 dark:text-gray-400" weight="duotone" />
          </div>
        </div>

        {/* Personalized Greeting */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Hello,
          </h2>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {driver.name}
          </h1>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-8 pb-8 space-y-4">
        {/* Primary Sign In Button - Freenow style bright red/pink */}
        <Button
          onClick={handleSignIn}
          disabled={isSigningIn}
          className="w-full h-14 text-lg font-semibold rounded-2xl bg-red-500 hover:bg-red-600 text-white shadow-lg transition-colors"
        >
          {isSigningIn ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </div>
          ) : (
            "Sign in"
          )}
        </Button>

        {/* Secondary Account Switch Option */}
        <Button
          variant="ghost"
          onClick={onSwitchAccount}
          className="w-full h-12 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Sign in to a different account
        </Button>
      </div>

      {/* App Version at Bottom */}
      <div className="text-center pb-8">
        <p className="text-xs text-gray-400 font-medium">
          v1.0.0 (20241201)
        </p>
      </div>

      {/* iPhone-style Home Indicator */}
      <div className="h-8 flex justify-center items-end pb-2">
        <div className="w-32 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
      </div>
    </div>
  );
}
'use client';

import { UserButton as ClerkUserButton, SignedIn, SignedOut } from '@clerk/nextjs';

export function UserButton() {
  return (
    <>
      <SignedIn>
        <ClerkUserButton />
      </SignedIn>
      <SignedOut>
        {/* Login button hidden - only accessible via /sign-in */}
      </SignedOut>
    </>
  );
}

"use client";

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ProgressBar
        height="3px"
        color="#A2804B" /* Your Copper Color */
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}
"use client";

import CartProvider from "@/context/CartContext";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      <Notifications position="top-right" transitionDuration={400} />
      <CartProvider>
        <SessionProvider>{children}</SessionProvider>
      </CartProvider>
    </MantineProvider>
  );
}

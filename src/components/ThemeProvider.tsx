import { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Dark theme is the only supported theme.
export const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <NextThemesProvider
    attribute="class"
    defaultTheme="dark"
    forcedTheme="dark"
    enableSystem={false}
    disableTransitionOnChange
  >
    {children}
  </NextThemesProvider>
);

"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { createTheme, MantineProvider } from "@mantine/core";
import { ThemeProvider } from "styled-components";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { Toaster } from "react-hot-toast";
import GlobalStyle from "../constants/globalStyle";
import { lightTheme } from "../constants/theme";
import { smartColorSchemeManager } from "../lib/utils/mantineColorScheme";

const theme = createTheme({
  autoContrast: true,
  fontSmoothing: false,
  respectReducedMotion: true,
  cursorType: "pointer",
  fontFamily:
    'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
  defaultGradient: {
    from: "#388cdb",
    to: "#0f037f",
    deg: 180,
  },
  primaryShade: 8,
  colors: {
    brightBlue: [
      "#e6f2ff",
      "#cee1ff",
      "#9bc0ff",
      "#649dff",
      "#3980fe",
      "#1d6dfe",
      "#0964ff",
      "#0054e4",
      "#004acc",
      "#003fb5",
    ],
  },
  radius: {
    lg: "12px",
  },
  components: {
    Button: {
      defaultProps: {
        fw: 500,
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const colorSchemeManager = useMemo(
    () =>
      smartColorSchemeManager({
        key: "editor-color-scheme",
        getPathname: () => pathnameRef.current || "/",
        dynamicPaths: ["/editor"],
      }),
    []
  );

  return (
    <MantineProvider
      colorSchemeManager={colorSchemeManager}
      defaultColorScheme="light"
      theme={theme}
    >
      <ThemeProvider theme={lightTheme}>
        <Toaster
          position="bottom-right"
          containerStyle={{
            bottom: 34,
            right: 8,
            fontSize: 14,
          }}
          toastOptions={{
            style: {
              background: "#4D4D4D",
              color: "#B9BBBE",
              borderRadius: 4,
            },
          }}
        />
        <GlobalStyle />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && <GoogleAnalytics trackPageViews />}
        {children}
      </ThemeProvider>
    </MantineProvider>
  );
}

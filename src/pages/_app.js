import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";
import React, { useEffect } from "react";

const theme = createTheme();

const App = ({ Component, pageProps }) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>

      <Analytics />
    </>
  );
};

export default App;

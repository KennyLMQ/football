import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { createDarkTheme } from "../src/darkTheme";
import { createLightTheme } from "../src/lightTheme";
import createEmotionCache from "../src/createEmotionCache";
import { AppBar, Container, Switch } from "@mui/material";
import { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const [isDarkTheme, setIsDarkTheme] = useState(true);

  React.useEffect(() => {
    if (localStorage.getItem("theme") === "dark" && !isDarkTheme) {
      setIsDarkTheme(true);
    } else if (localStorage.getItem("theme") === "light" && isDarkTheme) {
      setIsDarkTheme(false);
    }
  }, []);

  const changeTheme = () => {
    const newTheme = !isDarkTheme;

    localStorage.setItem("theme", newTheme === true ? "dark" : "light");

    setIsDarkTheme(newTheme);
  };

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>KennyLMQ.com</title>
      </Head>
      <ThemeProvider
        theme={isDarkTheme ? createDarkTheme() : createLightTheme()}
      >
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Header isDarkTheme={isDarkTheme} changeTheme={changeTheme} />
        <Container sx={{ pt: 6, pb: 6 }}>
          <Component {...pageProps} />
        </Container>
        <Footer></Footer>
      </ThemeProvider>
    </CacheProvider>
  );
}

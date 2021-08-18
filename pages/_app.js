import React from "react";
import { AuthContextProvider } from "../store/auth-context";
import { AddLiquidityContextProvider } from "../store/addLiquidity-context";
import { SwapContextProvider } from "../store/swap-context";
import { ButtonContextProvider } from "../store/buttonMessage-context";
import { ScreenSizeContextProvider } from "../store/screenSize-context";

import CssBaseline from '@material-ui/core/CssBaseline';

import AppLayout from "../components/UI/AppLayout/AppLayout";
import PropTypes from 'prop-types';
import Head from 'next/head';

import "../styles/globals.css";

export default function MyApp(props) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
      <React.Fragment>
        <Head>
          <title>BabyDogeSwap</title>
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <CssBaseline />
        <AuthContextProvider>
          <AppLayout />
          <AddLiquidityContextProvider>
            <SwapContextProvider>
              <ButtonContextProvider>
                <ScreenSizeContextProvider>
                  <Component {...pageProps} />
                </ScreenSizeContextProvider>
              </ButtonContextProvider>
            </SwapContextProvider>
          </AddLiquidityContextProvider>
        </AuthContextProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
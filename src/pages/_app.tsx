import "../styles/globals.css";
import type { AppProps } from "next/app";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "./api/trpc/[trpc]";
import { Global, css } from "@emotion/react";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Global
        styles={css`
          *{
            margin: 0;
            padding: 0;
          }
          body {
            color: white;
            background-color: #041c37;
            max-width: 1200px;
            width: 95%;
            margin: 0 auto !important;
          }
        `}
      />
      <Component {...pageProps} />
    </>
  );
};

function getBaseUrl() {
  if (process.browser) return ""; // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
     const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
  //  */
  ssr: true,
})(MyApp);

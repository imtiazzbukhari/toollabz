import type { AppProps } from "next/app";

/** Default Pages Router shell when `pages/` is present alongside `app/`. */
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

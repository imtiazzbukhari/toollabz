import { Head, Html, Main, NextScript } from "next/document";

/** Minimal Pages Router document for libs that expect `next/document`. App Router stays primary. */
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

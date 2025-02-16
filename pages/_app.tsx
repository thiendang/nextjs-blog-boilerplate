import { Provider } from 'next-auth/client';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session} refetchInterval={300}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;

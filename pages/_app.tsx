import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

interface CustomAppProps extends AppProps {
  pageProps: {
    session?: any; // Adjust the type if you have a specific session type
    [key: string]: any;
  };
}

const App = ({ Component, pageProps: { session, ...pageProps } }: CustomAppProps) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
import App, { Component } from 'next/app';
import Page from '../components/Page';
import { ApolloProvider } from 'react-apollo-hooks';
import withData from '../lib/withData';

class MyApp extends App {
  
  static async getInitialProps({ Component, ctx }) { 
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    pageProps.query = ctx.query

    return { pageProps };
  }

  render() {
    const { Component, apollo, pageProps } = this.props;
    return (
      <>
        <ApolloProvider client={apollo}>
          <Page>
            <Component {...pageProps} />
          </Page>
        </ApolloProvider>
      </>
    )
  }
}

export default withData(MyApp)
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createClient, Provider, dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import NavBar from "../components/NavBar";
import {
  GraphCacheConfig,
  CurrentUserDocument,
} from "../graphql/generated/graphql";

const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    dedupExchange,
    cacheExchange<GraphCacheConfig>({
      updates: {
        Mutation: {
          login: (result, args, cache, info) => {
            // Document = a GraphQL request generated by graphql-codegen
            cache.updateQuery({ query: CurrentUserDocument }, (data) => {
              if (result.login.errors) {
                // if bad login, just return the currently cached currentUser
                return data;
              } else {
                // set the currentUser to the logged in user
                return {
                  __typename: "User",
                  currentUser: {
                    ...result.login.user,
                  },
                };
              }
            });
          },
          register: (result, args, cache, info) => {
            cache.updateQuery({ query: CurrentUserDocument }, (data) => {
              if (result.register.errors) {
                return data;
              } else {
                return {
                  __typename: "User",
                  currentUser: {
                    ...result.register.user,
                  },
                };
              }
            });
          },
        },
      },
    }),
    fetchExchange,
  ],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <NavBar />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;

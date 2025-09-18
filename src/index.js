// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// runtime-first, fall back to build-time env
const SHOPIFY_API_ENDPOINT = process.env.REACT_APP_SHOPIFY_API_ENDPOINT;
const SHOPIFY_STOREFRONT_TOKEN = process.env.REACT_APP_SHOPIFY_STOREFRONT_TOKEN;
if (!SHOPIFY_API_ENDPOINT || !SHOPIFY_STOREFRONT_TOKEN) {
  console.error("❌ Missing Shopify environment variables");
} // note exact name

const httpLink = createHttpLink({
  uri: SHOPIFY_API_ENDPOINT,
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN || '',
    'Content-Type': 'application/json'
  }
}));

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

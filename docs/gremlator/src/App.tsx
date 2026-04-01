import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Navigator from './components/Navigator';
import Footer from './components/Footer';
import QueryTranslator from './views/QueryTranslator';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, sans-serif;
    background-color: #f4f5f7;
    color: #222;
  }
`;

const Main = styled.main`
  padding-top: 60px;
  min-height: 100vh;
`;

const App = () => (
  <>
    <GlobalStyle />
    <Navigator />
    <Main>
      <QueryTranslator />
    </Main>
    <Footer />
  </>
);

export default App;

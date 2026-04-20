/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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

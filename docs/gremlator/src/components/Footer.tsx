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
import styled from 'styled-components';
import lockFile from '../../package-lock.json';

const gremlinVersion = lockFile.packages['node_modules/gremlin'].version;

const FooterWrapper = styled.footer`
  text-align: center;
  padding: 24px;
  font-size: 0.8rem;
  color: #888;
  border-top: 1px solid #e0e0e0;
  margin-top: 48px;
  line-height: 20px;
`;

const Footer = () => (
  <FooterWrapper>
    <p>Gremlin version: {gremlinVersion}</p>
    <p>Copyright © 2015-2026 The Apache Software Foundation.</p>
    <p>
      <a href="https://tinkerpop.apache.org" target="_blank" rel="noreferrer">
        Apache TinkerPop™
      </a>
    </p>
  </FooterWrapper>
);

export default Footer;

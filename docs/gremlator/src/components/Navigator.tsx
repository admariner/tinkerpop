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
import styled from 'styled-components';

const Bar = styled.header`
  background-color: #2c2f36;
  color: #f2f2f2;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
`;

const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  color: #f2f2f2;
  letter-spacing: 0.5px;
`;

const Subtitle = styled.span`
  font-size: 0.8rem;
  color: #aaa;
  border-left: 1px solid #555;
  padding-left: 16px;
`;

const Navigator = () => (
  <Bar>
    <Title>Gremlator</Title>
    <Subtitle>Gremlin Language Variant Translator — Apache TinkerPop</Subtitle>
  </Bar>
);

export default Navigator;

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
import { TranslatorKey, TRANSLATOR_KEYS, TRANSLATOR_DISPLAY_NAMES } from '../store/types';

const TabBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 0;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: none;
  border-bottom: 3px solid ${({ $active }) => ($active ? '#2c7be5' : 'transparent')};
  background: none;
  font-size: 0.875rem;
  font-weight: ${({ $active }) => ($active ? '700' : '400')};
  color: ${({ $active }) => ($active ? '#2c7be5' : '#555')};
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  margin-bottom: -2px;

  &:hover {
    color: #2c7be5;
  }
`;

interface Props {
  activeTab: TranslatorKey;
  onTabChange: (tab: TranslatorKey) => void;
}

const LanguageTabs = ({ activeTab, onTabChange }: Props) => (
  <TabBar role="tablist">
    {TRANSLATOR_KEYS.map((key) => (
      <Tab
        key={key}
        role="tab"
        aria-selected={activeTab === key}
        $active={activeTab === key}
        onClick={() => onTabChange(key)}
      >
        {TRANSLATOR_DISPLAY_NAMES[key]}
      </Tab>
    ))}
  </TabBar>
);

export default LanguageTabs;

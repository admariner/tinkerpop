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

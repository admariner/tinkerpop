import React, { useState } from 'react';
import styled from 'styled-components';
import { TranslatorKey, TRANSLATOR_DISPLAY_NAMES } from '../store/types';

const Wrapper = styled.div`
  position: relative;
  border: 1px solid #e0e0e0;
  border-top: none;
  border-radius: 0 0 4px 4px;
  background-color: #f8f9fa;
`;

const CodeBlock = styled.pre`
  margin: 0;
  padding: 16px 48px 16px 16px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  color: #222;
  min-height: 80px;
`;

const Placeholder = styled.span`
  color: #aaa;
  font-style: italic;
`;

const CopyButton = styled.button<{ copied: boolean }>`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 10px;
  font-size: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: ${({ copied }) => (copied ? '#d4edda' : '#fff')};
  color: ${({ copied }) => (copied ? '#155724' : '#555')};
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: ${({ copied }) => (copied ? '#d4edda' : '#f0f0f0')};
  }
`;

interface Props {
  activeTab: TranslatorKey;
  translations: Record<TranslatorKey, string>;
}

const TranslationResult = ({ activeTab, translations }: Props) => {
  const [copied, setCopied] = useState(false);
  const text = translations[activeTab];

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <Wrapper role="tabpanel">
      <CodeBlock>
        {text ? (
          text
        ) : (
          <Placeholder>
            Enter a Gremlin query above and click Translate to see the{' '}
            {TRANSLATOR_DISPLAY_NAMES[activeTab]} output.
          </Placeholder>
        )}
      </CodeBlock>
      {text && (
        <CopyButton copied={copied} onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </CopyButton>
      )}
    </Wrapper>
  );
};

export default TranslationResult;

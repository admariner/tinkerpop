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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #444;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px 14px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  box-sizing: border-box;
  background-color: #fafafa;
  color: #222;

  &:focus {
    outline: none;
    border-color: #2c7be5;
    background-color: #fff;
  }
`;

const TranslateButton = styled.button`
  align-self: flex-start;
  padding: 10px 24px;
  background-color: #2c7be5;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #1a63c4;
  }

  &:active {
    background-color: #1453a8;
  }
`;

interface Props {
  value: string;
  onChange: (value: string) => void;
  onTranslate: () => void;
}

const PLACEHOLDER = `g.V().has('name', 'marko').out('knows').values('name')`;

const QueryInput = ({ value, onChange, onTranslate }: Props) => (
  <Wrapper>
    <Label htmlFor="gremlin-input">Gremlin Query</Label>
    <TextArea
      id="gremlin-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={PLACEHOLDER}
      spellCheck={false}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          onTranslate();
        }
      }}
    />
    <TranslateButton onClick={onTranslate}>Translate</TranslateButton>
  </Wrapper>
);

export default QueryInput;

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

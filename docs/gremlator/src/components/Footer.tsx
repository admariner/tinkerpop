import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  text-align: center;
  padding: 24px;
  font-size: 0.8rem;
  color: #888;
  border-top: 1px solid #e0e0e0;
  margin-top: 48px;
`;

const Footer = () => (
  <FooterWrapper>
    Powered by{' '}
    <a href="https://tinkerpop.apache.org/" target="_blank" rel="noreferrer">
      Apache TinkerPop
    </a>{' '}
    — Licensed under the Apache License 2.0
  </FooterWrapper>
);

export default Footer;

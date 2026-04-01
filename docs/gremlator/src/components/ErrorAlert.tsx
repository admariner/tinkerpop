import React from 'react';
import styled from 'styled-components';

const Alert = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 12px 40px 12px 16px;
  font-size: 0.875rem;
  position: relative;
  line-height: 1.5;
`;

const DismissButton = styled.button`
  position: absolute;
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.1rem;
  color: #721c24;
  cursor: pointer;
  line-height: 1;
  padding: 0 4px;

  &:hover {
    opacity: 0.7;
  }
`;

interface Props {
  message: string;
  onDismiss: () => void;
}

const ErrorAlert = ({ message, onDismiss }: Props) => (
  <Alert role="alert">
    <strong>Translation error:</strong> {message}
    <DismissButton onClick={onDismiss} aria-label="Dismiss error">
      &times;
    </DismissButton>
  </Alert>
);

export default ErrorAlert;

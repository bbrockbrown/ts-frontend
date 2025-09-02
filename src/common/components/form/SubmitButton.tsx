import React from 'react';

import { StyledButton } from './styles';

interface SubmitButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}
export default function SubmitButton({
  children,
  onClick,
  disabled,
}: SubmitButtonProps) {
  return (
    <StyledButton type='submit' onClick={onClick} disabled={disabled}>
      {children}
    </StyledButton>
  );
}

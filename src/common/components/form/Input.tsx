import { type ChangeEvent, useState } from 'react';

import { Icon } from '@/assets/icons.ts';

import {
  IconContainer,
  InputContainer,
  InputName,
  InputTitle,
  PasswordContainer,
  RedSpan,
  StyledInput,
} from './styles';

interface TitledInputProps {
  title: string;
  required: boolean;
  children: React.ReactNode;
}
function TitledInput({ title, required, children }: TitledInputProps) {
  return (
    <InputContainer>
      <InputName>
        <InputTitle>{title}</InputTitle>
        {required && <RedSpan>*</RedSpan>}
      </InputName>
      {children}
    </InputContainer>
  );
}

interface InputPropTypes {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value?: string;
  required: boolean;
  name?: string;
}
function TextField(props: InputPropTypes) {
  props.placeholder ??= 'Text Here';
  return <StyledInput type='text' {...props} />;
}

interface InputTextProps extends InputPropTypes {
  title: string;
}
function InputText({ title, ...rest }: InputTextProps) {
  return (
    <TitledInput title={title} required={rest.required}>
      <TextField {...rest} />
    </TitledInput>
  );
}

interface PasswordFieldProps extends InputPropTypes {}
function PasswordField(props: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <PasswordContainer>
      <StyledInput type={showPassword ? 'text' : 'password'} {...props} />
      <IconContainer onClick={toggleShowPassword}>
        <img 
          src={showPassword ? Icon.eyeClosed : Icon.eye} 
          alt={showPassword ? 'Hide password' : 'Show password'}
          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
        />
      </IconContainer>
    </PasswordContainer>
  );
}

interface InputPasswordProps extends InputPropTypes {
  title: string;
}
function InputPassword({ title, ...rest }: InputPasswordProps) {
  return (
    <TitledInput title={title} required={rest.required}>
      <PasswordField {...rest} />
    </TitledInput>
  );
}

export const Input = {
  Text: InputText,
  Password: InputPassword,
};

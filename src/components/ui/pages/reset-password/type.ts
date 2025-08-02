import { PageUIProps } from '../common-type';

export type ResetPasswordUIProps = Omit<PageUIProps, 'email' | 'setEmail'> & {
  password: string;
  passwordError?: string;
  token: string;
  setPassword: (value: string) => void;
  setToken: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

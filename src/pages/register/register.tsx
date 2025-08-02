import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { createUserAccount } from '../../services/slices/authenticationSlice';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const storeDispatch = useDispatch();

  function handleRegistrationSubmit(e: SyntheticEvent) {
    e.preventDefault();
    storeDispatch(createUserAccount({ name: userName, email, password }));
  }

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleRegistrationSubmit}
    />
  );
};

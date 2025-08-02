import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [passwordError, setPasswordError] = useState<string>('');

  // Проверка на латинские символы
  const validatePassword = (value: string) => {
    const latinRegex = /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    if (value && !latinRegex.test(value)) {
      setPasswordError('Пароль должен содержать латинские символы');
    } else {
      setPasswordError('');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    validatePassword(value);
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);

    // Проверяем наличие ошибки пароля перед отправкой
    if (passwordError) {
      return;
    }

    resetPasswordApi({ password, token })
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      })
      .catch((err) => setError(err));
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      passwordError={passwordError}
      password={password}
      token={token}
      setPassword={handlePasswordChange}
      setToken={(e) => setToken(e.target.value)}
      handleSubmit={handleSubmit}
    />
  );
};

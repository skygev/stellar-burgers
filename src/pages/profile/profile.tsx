import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getUserProfile,
  updateUserProfile
} from '../../services/slices/authenticationSlice';

export const Profile: FC = () => {
  const storeDispatch = useDispatch();
  const currentUser = useSelector(getUserProfile);

  const [formValue, setFormValue] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    password: ''
  });

  function updateFormWithUserData() {
    setFormValue((prevState) => ({
      ...prevState,
      name: currentUser?.name || '',
      email: currentUser?.email || ''
    }));
  }

  useEffect(updateFormWithUserData, [currentUser]);

  const isFormChanged =
    formValue.name !== currentUser?.name ||
    formValue.email !== currentUser?.email ||
    !!formValue.password;

  function handleFormSubmission(e: SyntheticEvent) {
    e.preventDefault();
    storeDispatch(updateUserProfile(formValue));
  }

  function handleFormReset(e: SyntheticEvent) {
    e.preventDefault();
    setFormValue({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      password: ''
    });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleFormReset}
      handleSubmit={handleFormSubmission}
      handleInputChange={handleInputChange}
    />
  );
};

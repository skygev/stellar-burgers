import {
  authenticationReducer,
  createUserAccount,
  authenticateUser,
  updateUserProfile,
  signOutUser,
  verifyUserSession,
  setUserProfile,
  signOut,
  sessionVerified
} from './authenticationSlice';

// Константы статусов запросов (из authenticationSlice)
const REQUEST_STATUS = {
  IDLE: 'Idle' as const,
  LOADING: 'Loading' as const,
  SUCCESS: 'Success' as const,
  FAILED: 'Failed' as const
};

describe('authenticationSlice reducer tests', () => {
  const initialState = {
    error: null,
    statusRequest: REQUEST_STATUS.IDLE,
    data: null,
    isAuth: false
  };

  const mockUser = {
    name: 'Test User',
    email: 'test@example.com'
  };

  it('должен вернуть начальное состояние', () => {
    const result = authenticationReducer(undefined, { type: 'unknown' });
    expect(result).toEqual(initialState);
  });

  describe('синхронные actions', () => {
    it('должен обработать setUserProfile', () => {
      const action = setUserProfile(mockUser);
      const result = authenticationReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        data: mockUser
      });
    });

    it('должен обработать signOut', () => {
      const stateWithUser = {
        ...initialState,
        isAuth: true,
        data: mockUser
      };

      const action = signOut();
      const result = authenticationReducer(stateWithUser, action);

      expect(result).toEqual({
        ...stateWithUser,
        isAuth: false
      });
    });

    it('должен обработать sessionVerified', () => {
      const action = sessionVerified();
      const result = authenticationReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        isAuth: true
      });
    });
  });

  describe('async thunks - pending состояния', () => {
    it('должен обработать createUserAccount.pending', () => {
      const action = createUserAccount.pending('test-id', {
        name: 'Test',
        email: 'test@test.com',
        password: '123'
      });
      const result = authenticationReducer(initialState, action);

      expect(result.statusRequest).toBe(REQUEST_STATUS.LOADING);
    });

    it('должен обработать authenticateUser.pending', () => {
      const action = authenticateUser.pending('test-id', {
        email: 'test@test.com',
        password: '123'
      });
      const result = authenticationReducer(initialState, action);

      expect(result.statusRequest).toBe(REQUEST_STATUS.LOADING);
    });

    it('должен обработать updateUserProfile.pending', () => {
      const action = updateUserProfile.pending('test-id', {
        name: 'Updated Name'
      });
      const result = authenticationReducer(initialState, action);

      expect(result.statusRequest).toBe(REQUEST_STATUS.LOADING);
    });
  });

  describe('async thunks - fulfilled состояния', () => {
    it('должен обработать createUserAccount.fulfilled', () => {
      const action = {
        type: createUserAccount.fulfilled.type,
        payload: mockUser
      };
      const result = authenticationReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        statusRequest: REQUEST_STATUS.SUCCESS,
        data: mockUser
      });
    });

    it('должен обработать authenticateUser.fulfilled', () => {
      const action = {
        type: authenticateUser.fulfilled.type,
        payload: mockUser
      };
      const result = authenticationReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        statusRequest: REQUEST_STATUS.SUCCESS,
        data: mockUser
      });
    });

    it('должен обработать updateUserProfile.fulfilled', () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const action = {
        type: updateUserProfile.fulfilled.type,
        payload: updatedUser
      };
      const result = authenticationReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        statusRequest: REQUEST_STATUS.SUCCESS,
        data: updatedUser
      });
    });

    it('должен обработать signOutUser.fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        isAuth: true,
        data: mockUser,
        statusRequest: REQUEST_STATUS.LOADING
      };

      const action = { type: signOutUser.fulfilled.type };
      const result = authenticationReducer(stateWithUser, action);

      expect(result).toEqual({
        error: null,
        statusRequest: REQUEST_STATUS.IDLE,
        data: null,
        isAuth: false
      });
    });

    it('должен обработать verifyUserSession.fulfilled', () => {
      const action = { type: verifyUserSession.fulfilled.type };
      const result = authenticationReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        statusRequest: REQUEST_STATUS.SUCCESS
      });
    });
  });

  describe('async thunks - rejected состояния', () => {
    it('должен обработать createUserAccount.rejected', () => {
      const action = createUserAccount.rejected(
        new Error('Registration failed'),
        'test-id',
        { name: 'Test', email: 'test@test.com', password: '123' }
      );
      const result = authenticationReducer(initialState, action);

      expect(result.statusRequest).toBe(REQUEST_STATUS.FAILED);
    });

    it('должен обработать authenticateUser.rejected', () => {
      const action = authenticateUser.rejected(
        new Error('Login failed'),
        'test-id',
        { email: 'test@test.com', password: '123' }
      );
      const result = authenticationReducer(initialState, action);

      expect(result.statusRequest).toBe(REQUEST_STATUS.FAILED);
    });

    it('должен обработать updateUserProfile.rejected', () => {
      const action = updateUserProfile.rejected(
        new Error('Update failed'),
        'test-id',
        { name: 'Updated Name' }
      );
      const result = authenticationReducer(initialState, action);

      expect(result.statusRequest).toBe(REQUEST_STATUS.FAILED);
    });
  });
});

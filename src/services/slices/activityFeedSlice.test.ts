import { activityFeedReducer, fetchActivityFeed } from './activityFeedSlice';

describe('activityFeedSlice reducer tests', () => {
  const initialState = {
    errorMessage: null,
    isLoading: false,
    activityData: null
  };

  it('должен вернуть начальное состояние', () => {
    const result = activityFeedReducer(undefined, { type: 'unknown' });
    expect(result).toEqual(initialState);
  });

  it('должен обработать fetchActivityFeed.pending', () => {
    const action = { type: fetchActivityFeed.pending.type };
    const result = activityFeedReducer(initialState, action);

    expect(result).toEqual({
      errorMessage: null,
      isLoading: true,
      activityData: null
    });
  });

  it('должен обработать fetchActivityFeed.fulfilled', () => {
    const mockData = {
      orders: [{ _id: '1', status: 'done', name: 'Test Order' }],
      total: 100,
      totalToday: 10
    };

    const action = {
      type: fetchActivityFeed.fulfilled.type,
      payload: mockData
    };

    const result = activityFeedReducer(initialState, action);

    expect(result).toEqual({
      errorMessage: null,
      isLoading: false,
      activityData: mockData
    });
  });

  it('должен обработать fetchActivityFeed.rejected', () => {
    const errorMessage = 'Network error';
    const action = {
      type: fetchActivityFeed.rejected.type,
      error: { message: errorMessage }
    };

    const result = activityFeedReducer(initialState, action);

    expect(result).toEqual({
      errorMessage: errorMessage,
      isLoading: false,
      activityData: null
    });
  });

  it('должен обработать fetchActivityFeed.rejected с неизвестной ошибкой', () => {
    const action = {
      type: fetchActivityFeed.rejected.type,
      error: {}
    };

    const result = activityFeedReducer(initialState, action);

    expect(result).toEqual({
      errorMessage: 'Unknown error occurred',
      isLoading: false,
      activityData: null
    });
  });
});

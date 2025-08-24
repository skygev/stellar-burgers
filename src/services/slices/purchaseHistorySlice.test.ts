import {
  purchaseHistoryReducer,
  fetchUserPurchases,
  fetchPurchaseByNumber,
  createNewPurchase,
  closePurchaseModal
} from './purchaseHistorySlice';
import { fetchActivityFeed } from './activityFeedSlice';

describe('purchaseHistorySlice reducer tests', () => {
  const initialState = {
    errorMessage: null,
    isLoading: false,
    isProcessingPurchase: false,
    selectedPurchase: null,
    purchaseList: []
  };

  const mockOrder = {
    _id: '1',
    status: 'done',
    name: 'Test Burger',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    number: 12345,
    ingredients: ['ingredient1', 'ingredient2']
  };

  const mockOrdersResponse = [mockOrder];

  it('должен вернуть начальное состояние', () => {
    const result = purchaseHistoryReducer(undefined, { type: 'unknown' });
    expect(result).toEqual(initialState);
  });

  describe('синхронные actions', () => {
    it('должен обработать closePurchaseModal', () => {
      const stateWithPurchase = {
        ...initialState,
        isProcessingPurchase: true,
        selectedPurchase: mockOrder
      };

      const action = closePurchaseModal();
      const result = purchaseHistoryReducer(stateWithPurchase, action);

      expect(result).toEqual({
        ...initialState,
        isProcessingPurchase: false,
        selectedPurchase: null
      });
    });
  });

  describe('fetchUserPurchases async thunk', () => {
    it('должен обработать fetchUserPurchases.pending', () => {
      const action = { type: fetchUserPurchases.pending.type };
      const result = purchaseHistoryReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        isProcessingPurchase: true,
        isLoading: true,
        errorMessage: null
      });
    });

    it('должен обработать fetchUserPurchases.fulfilled', () => {
      const action = {
        type: fetchUserPurchases.fulfilled.type,
        payload: mockOrdersResponse
      };
      const result = purchaseHistoryReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        isProcessingPurchase: false,
        isLoading: false,
        purchaseList: mockOrdersResponse,
        errorMessage: null
      });
    });

    it('должен обработать fetchUserPurchases.rejected', () => {
      const errorMessage = 'Failed to fetch orders';
      const action = {
        type: fetchUserPurchases.rejected.type,
        error: { message: errorMessage }
      };
      const result = purchaseHistoryReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        isLoading: false,
        errorMessage: errorMessage
      });
    });

    it('должен обработать fetchUserPurchases.rejected с неизвестной ошибкой', () => {
      const action = {
        type: fetchUserPurchases.rejected.type,
        error: {}
      };
      const result = purchaseHistoryReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        isLoading: false,
        errorMessage: 'Failed to fetch purchase history'
      });
    });
  });

  describe('fetchPurchaseByNumber async thunk', () => {
    it('должен обработать fetchPurchaseByNumber.pending', () => {
      const action = { type: fetchPurchaseByNumber.pending.type };
      const result = purchaseHistoryReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        isLoading: true,
        errorMessage: null
      });
    });

    it('должен обработать fetchPurchaseByNumber.fulfilled', () => {
      const action = {
        type: fetchPurchaseByNumber.fulfilled.type,
        payload: { orders: [mockOrder] }
      };
      const result = purchaseHistoryReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        isLoading: false,
        selectedPurchase: mockOrder,
        errorMessage: null
      });
    });

    it('должен обработать fetchPurchaseByNumber.rejected', () => {
      const errorMessage = 'Order not found';
      const action = {
        type: fetchPurchaseByNumber.rejected.type,
        error: { message: errorMessage }
      };
      const result = purchaseHistoryReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        isLoading: false,
        errorMessage: errorMessage
      });
    });
  });

  describe('createNewPurchase async thunk', () => {
    it('должен обработать createNewPurchase.pending', () => {
      const action = { type: createNewPurchase.pending.type };
      const result = purchaseHistoryReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        isProcessingPurchase: true,
        isLoading: true,
        errorMessage: null
      });
    });

    it('должен обработать createNewPurchase.fulfilled', () => {
      const action = {
        type: createNewPurchase.fulfilled.type,
        payload: { order: mockOrder }
      };
      const result = purchaseHistoryReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        isProcessingPurchase: false,
        selectedPurchase: mockOrder,
        errorMessage: null,
        isLoading: false
      });
    });

    it('должен обработать createNewPurchase.rejected', () => {
      const errorMessage = 'Failed to create order';
      const action = {
        type: createNewPurchase.rejected.type,
        error: { message: errorMessage }
      };
      const result = purchaseHistoryReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        isProcessingPurchase: false,
        isLoading: false,
        errorMessage: errorMessage
      });
    });
  });

  describe('fetchActivityFeed cross-slice actions', () => {
    it('должен обработать fetchActivityFeed.pending', () => {
      const action = { type: fetchActivityFeed.pending.type };
      const result = purchaseHistoryReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        errorMessage: null,
        isLoading: true
      });
    });

    it('должен обработать fetchActivityFeed.fulfilled', () => {
      const action = {
        type: fetchActivityFeed.fulfilled.type,
        payload: { orders: mockOrdersResponse }
      };
      const result = purchaseHistoryReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        isProcessingPurchase: false,
        isLoading: false,
        purchaseList: mockOrdersResponse,
        errorMessage: null
      });
    });

    it('должен обработать fetchActivityFeed.rejected', () => {
      const errorMessage = 'Failed to fetch feed';
      const action = {
        type: fetchActivityFeed.rejected.type,
        error: { message: errorMessage }
      };
      const result = purchaseHistoryReducer(initialState, action);

      expect(result).toEqual({
        ...initialState,
        isLoading: false,
        errorMessage: errorMessage
      });
    });
  });
});

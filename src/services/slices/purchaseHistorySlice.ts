import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import { fetchActivityFeed } from './activityFeedSlice';
import { TOrder } from '@utils-types';

// Тип состояния истории покупок/заказов
type PurchaseHistoryState = {
  errorMessage: string | null; // Сообщение об ошибке
  isLoading: boolean; // Общий статус загрузки
  isProcessingPurchase: boolean; // Статус обработки заказа
  selectedPurchase: TOrder | null; // Выбранный заказ для отображения
  purchaseList: TOrder[]; // Список заказов пользователя
};

// Начальное состояние истории покупок
const initialState: PurchaseHistoryState = {
  errorMessage: null,
  isLoading: false,
  isProcessingPurchase: false,
  selectedPurchase: null,
  purchaseList: []
};

// Загрузка истории заказов пользователя
export const fetchUserPurchases = createAsyncThunk(
  'purchaseHistory/fetchUserPurchases',
  async function () {
    try {
      const purchaseData = await getOrdersApi();
      return purchaseData;
    } catch (error) {
      throw error; // Пробрасываем ошибку для обработки в rejected case
    }
  }
);

// Получение конкретного заказа по номеру
export const fetchPurchaseByNumber = createAsyncThunk(
  'purchaseHistory/fetchPurchaseByNumber',
  async function (purchaseNumber: number) {
    try {
      const purchaseDetails = await getOrderByNumberApi(purchaseNumber);
      return purchaseDetails;
    } catch (error) {
      throw error; // Пробрасываем ошибку для обработки в rejected case
    }
  }
);

// Создание нового заказа из выбранных ингредиентов
export const createNewPurchase = createAsyncThunk(
  'purchaseHistory/createNewPurchase',
  async function (ingredientIds: string[]) {
    try {
      const newPurchase = await orderBurgerApi(ingredientIds);
      return newPurchase;
    } catch (error) {
      throw error; // Пробрасываем ошибку для обработки в rejected case
    }
  }
);

// Создание slice'а истории покупок с комплексной логикой
export const purchaseHistorySlice = createSlice({
  name: 'purchaseHistory',
  initialState,
  reducers: {
    // Закрытие модального окна заказа
    closePurchaseModal: function (state) {
      state.isProcessingPurchase = false;
      state.selectedPurchase = null;
    }
  },
  // Обработчики async thunk'ов и cross-slice действий
  extraReducers: function (builder) {
    builder
      // Обработка создания нового заказа
      .addCase(createNewPurchase.rejected, function (state, action) {
        state.isProcessingPurchase = false;
        state.isLoading = false;
        const errorMsg = action.error.message;
        state.errorMessage = errorMsg ? errorMsg : 'Failed to create purchase';
      })
      .addCase(createNewPurchase.fulfilled, function (state, action) {
        state.isProcessingPurchase = false;
        state.selectedPurchase = action.payload.order;
        state.errorMessage = null;
        state.isLoading = false;
      })
      .addCase(createNewPurchase.pending, function (state) {
        state.isProcessingPurchase = true;
        state.isLoading = true;
        state.errorMessage = null;
      })

      // Обработка получения заказа по номеру
      .addCase(fetchPurchaseByNumber.rejected, function (state, action) {
        state.isLoading = false;
        const errorMsg = action.error.message;
        state.errorMessage = errorMsg
          ? errorMsg
          : 'Failed to fetch purchase details';
      })
      .addCase(fetchPurchaseByNumber.fulfilled, function (state, action) {
        state.isLoading = false;
        state.selectedPurchase = action.payload.orders[0];
        state.errorMessage = null;
      })
      .addCase(fetchPurchaseByNumber.pending, function (state) {
        state.isLoading = true;
        state.errorMessage = null;
      })

      // Обработка получения списка заказов пользователя
      .addCase(fetchUserPurchases.rejected, function (state, action) {
        state.isLoading = false;
        const errorMsg = action.error.message;
        state.errorMessage = errorMsg
          ? errorMsg
          : 'Failed to fetch purchase history';
      })
      .addCase(fetchUserPurchases.fulfilled, function (state, action) {
        state.isProcessingPurchase = false;
        state.isLoading = false;
        state.purchaseList = action.payload;
        state.errorMessage = null;
      })
      .addCase(fetchUserPurchases.pending, function (state) {
        state.isProcessingPurchase = true;
        state.isLoading = true;
        state.errorMessage = null;
      })

      // Обработка получения общего фида (cross-slice логика)
      .addCase(fetchActivityFeed.rejected, function (state, action) {
        state.isLoading = false;
        const errorMsg = action.error.message;
        state.errorMessage = errorMsg
          ? errorMsg
          : 'Failed to fetch activity feed';
      })
      .addCase(fetchActivityFeed.fulfilled, function (state, action) {
        state.isProcessingPurchase = false;
        state.isLoading = false;
        state.purchaseList = action.payload.orders;
        state.errorMessage = null;
      })
      .addCase(fetchActivityFeed.pending, function (state) {
        state.errorMessage = null;
        state.isLoading = true;
      });
  }
});

// Извлечение actions и reducer из slice'а
const sliceActions = purchaseHistorySlice.actions;
const sliceReducer = purchaseHistorySlice.reducer;

export const closePurchaseModal = sliceActions.closePurchaseModal;
export const purchaseHistoryReducer = sliceReducer;

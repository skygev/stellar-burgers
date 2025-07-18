import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '../utils/types';

type OrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    startOrderRequest(state) {
      state.orderRequest = true;
    },
    setOrderSuccess(state, action: PayloadAction<TOrder>) {
      state.orderRequest = false;
      state.orderModalData = action.payload;
    },
    clearOrder(state) {
      state.orderRequest = false;
      state.orderModalData = null;
    }
  }
});

export const { startOrderRequest, setOrderSuccess, clearOrder } =
  orderSlice.actions;

export default orderSlice.reducer;

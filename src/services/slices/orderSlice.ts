import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';

interface OrderState {
  orderId: number | null;
  loading: boolean;
  error?: string;
  detailsVisible: boolean;
}

const initialState: OrderState = {
  orderId: null,
  loading: false,
  detailsVisible: false
};

export const createBurgerOrder = createAsyncThunk(
  'orders/create',
  async (items: string[], thunkAPI) => {
    try {
      const response = await orderBurgerApi(items);
      return response.order.number;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Order failed');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    hideOrderDetails(state) {
      state.detailsVisible = false;
    },
    clearOrder(state) {
      state.orderId = null;
      state.detailsVisible = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBurgerOrder.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createBurgerOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderId = action.payload;
        state.detailsVisible = true;
      })
      .addCase(createBurgerOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { hideOrderDetails, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;

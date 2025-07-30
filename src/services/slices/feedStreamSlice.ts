import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Order {
  _id: string;
  number: number;
  name: string;
  status: 'created' | 'pending' | 'done';
  ingredients: string[];
  createdAt: string;
  updatedAt: string;
}

interface FeedState {
  wsConnected: boolean;
  orders: Order[];
  total: number;
  totalToday: number;
  error?: string;
}

const initialState: FeedState = {
  wsConnected: false,
  orders: [],
  total: 0,
  totalToday: 0
};

const feedStream = createSlice({
  name: 'orderFeed',
  initialState,
  reducers: {
    connectionStarted(state) {
      state.wsConnected = true;
      state.error = undefined;
    },
    connectionClosed(state) {
      state.wsConnected = false;
    },
    feedReceived(
      state,
      action: PayloadAction<{
        orders: Order[];
        total: number;
        totalToday: number;
      }>
    ) {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    connectionError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.wsConnected = false;
    }
  }
});

export const {
  connectionStarted,
  connectionClosed,
  feedReceived,
  connectionError
} = feedStream.actions;

export default feedStream.reducer;

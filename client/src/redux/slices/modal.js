import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import stellarService from "../../services/web3/stellarService";
import chainService from "../../services/web3/chainService";

const initialState = {
  isOpen: false,
  loading: false,
  data: null,
};

export const getTransaction = createAsyncThunk(
  "modal/getTransaction",
  async ({ txID, txAssetID }, thunkAPI) => {

    try {
      thunkAPI.dispatch(openJSONModal());
      const stellarRes = await stellarService.getTransactionById(txID);
      const chainRes = await chainService.serachAssetById(txAssetID);

      return { data: { stellarData: stellarRes?.data, chainData: chainRes } };
    } catch (error) {
      console.log(error);
      thunkAPI.dispatch(closeJSONModal());
      return thunkAPI.rejectWithValue();
    }
  }
);

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openJSONModal: (state, action) => {
      state.isOpen = true;
    },
    closeJSONModal: (state, action) => {
      state.isOpen = false;
      state.data = null;
      state.loading = false;
    },
  },
  extraReducers: {
    [getTransaction.pending]: (state, action) => {
      state.loading = true;
    },
    [getTransaction.fulfilled]: (state, action) => {
      state.loading = false;
      state.isOpen = true;
      state.data = action.payload.data;
    },
    [getTransaction.rejected]: (state, action) => {
      state.loading = false;
      state.isOpen = false;
      state.data = null;
    },
  },
});

const { reducer, actions } = modalSlice;
export const { openJSONModal, closeJSONModal } = actions;

export default reducer;

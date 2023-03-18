import { createSlice } from "@reduxjs/toolkit";
import { NETWORK } from "../../enum";

const initialState = { network: localStorage.getItem("network") };

const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    setLiveNet: () => {
      localStorage.setItem("network", NETWORK.LIVENET);
      return { network: NETWORK.LIVENET };
    },
    setTestNet: () => {
      localStorage.setItem("network", NETWORK.TESTNET);
      return { network: NETWORK.TESTNET };
    },
  },
});

const { reducer, actions } = networkSlice;

export const { setLiveNet, setTestNet } = actions;
export default reducer;

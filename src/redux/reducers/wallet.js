const initialState = {
  wallet: null,
  encryptedWallet: null,
  walletInfo: null,
  provider: null,
  providerName: null,
  walletConnectProvider: null,
  balance: 0,
  assets: [],
};

const wallet = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_WALLET':
      return {
        ...state,
        wallet: action.wallet,
        walletInfo: action.walletInfo,
        provider: action.provider,
        providerName: action.providerName,
        encryptedWallet: action.encryptedWallet,
        assets: action.assets,
      };

    case 'CLEAR_WALLET':
      return {
        ...state,
        wallet: null,
      };

    case 'SET_WALLET_NETWORK':
      return {
        ...state,
        provider: action.provider,
        balance: action.balance,
        providerName: action.providerName,
      };
    case 'SET_WALLET_BALANCE':
      return {
        ...state,
        balance: action.balance,
      };

    case 'UPDATE_ASSETS':
      return {
        ...state,
        assets: action.payload,
      };

    default:
      return state;
  }
};

export default wallet;

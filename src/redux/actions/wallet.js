import AsyncStorage from '@react-native-async-storage/async-storage';
import {ethers} from 'ethers';
import Contract from '../../../blockchain/contract';
import * as api from '../api';

const TEST_NETWORK_URL = 'https://testnetwork.esatya.io';
const DEFAULT_PROVIDER_NAME = 'Rumsan Test Network';

export const setWallet =
  (
    wallet,
    walletInfo,
    encryptedWallet,
    provider,
    providerName,
    assets,
    setWalletSuccess,
  ) =>
  async dispatch => {
    dispatch({
      type: 'SET_WALLET',
      wallet,
      walletInfo,
      encryptedWallet,
      provider,
      providerName,
      assets,
    });
    setWalletSuccess();
  };

export const getWallet =
  (type, onSuccess, onError, mnemonic, passcode) => async dispatch => {
    const provider = new ethers.providers.JsonRpcProvider(TEST_NETWORK_URL);

    let wallet, encryptedWallet, connectedWallet;
    // if (type === 'create') {
    //   try {
    //     wallet = ethers.Wallet.createRandom();
    //     connectedWallet = wallet.connect(provider);
    //   } catch (e) {
    //     onError(e.message);
    //     return;
    //   }
    // }
    if (type === 'createWithEncryption') {
      try {
        wallet = ethers.Wallet.createRandom();
        encryptedWallet = await wallet.encrypt(passcode, {
          scrypt: {
            N: 2,
          },
        });
        connectedWallet = wallet.connect(provider);
      } catch (e) {
        onError(e.message);
        return;
      }
    }
    if (type === 'restoreUsingMnemonic') {
      try {
        wallet = ethers.Wallet.fromMnemonic(mnemonic);
        encryptedWallet = await wallet.encrypt(passcode, {
          scrypt: {
            N: 2,
          },
        });
        connectedWallet = wallet.connect(provider);
      } catch (e) {
        onError(e.message);
        return;
      }
    }

    const walletInfo = {
      _isSigner: wallet._isSigner,
      mnemonic: wallet._mnemonic().phrase,
      privateKey: wallet._signingKey().privateKey,
      address: wallet.address,
      provider: wallet.provider,
    };
    let infoToStore;
    // if (type === 'create' || 'restoreUsingMnemonic') {
    //   infoToStore = walletInfo;
    // } else {
    //   infoToStore = encryptedWallet;
    // }
    // if (type === 'create' || 'restoreUsingMnemonic') {
    //   infoToStore = walletInfo;
    // } else {
    //   infoToStore = encryptedWallet;
    // }

    const asyncWalletInfo = ['walletInfo', JSON.stringify(walletInfo)];
    const encryptedWalletInfo = [
      'encryptedWallet',
      JSON.stringify(encryptedWallet),
    ];

    //   AsyncStorage.setItem('walletInfo', JSON.stringify(infoToStore))
    //     .then(() => {
    //       dispatch({
    //         type: 'SET_WALLET',
    //         wallet: connectedWallet,
    //         provider,
    //       });
    //       onSuccess();
    //     })
    //     .catch(e => {
    //       onError();
    //       console.log('error:', e);
    //     });
    // };
    AsyncStorage.multiSet([asyncWalletInfo, encryptedWalletInfo])
      .then(() => {
        dispatch({
          type: 'SET_WALLET',
          wallet: connectedWallet,
          walletInfo,
          encryptedWallet,
          provider,
          providerName: DEFAULT_PROVIDER_NAME,
        });
        onSuccess();
      })
      .catch(e => {
        onError();
        console.log('error:', e);
      });
  };

export const restoreUsingDrive =
  (walletInfo, passcode, onSuccess, onError) => async dispatch => {
    try {
      let wallet, connectedWallet, provider, encryptedWallet;
      wallet = new ethers.Wallet(walletInfo.privateKey);
      provider = new ethers.providers.JsonRpcProvider(TEST_NETWORK_URL);
      connectedWallet = wallet.connect(provider);
      encryptedWallet = await wallet.encrypt(passcode, {
        scrypt: {
          N: 2,
        },
      });

      AsyncStorage.setItem('walletInfo', JSON.stringify(walletInfo))
        .then(() => {
          dispatch({
            type: 'SET_WALLET',
            wallet: connectedWallet,
            walletInfo,
            encryptedWallet,
            provider,
            providerName: DEFAULT_PROVIDER_NAME,
          });
          onSuccess();
        })
        .catch(e => {
          onError(e);
        });
    } catch (e) {
      onError(e);
    }
  };

export const clearWallet = onSuccess => async dispatch => {
  try {
    await AsyncStorage.clear();
    dispatch({type: 'CLEAR_WALLET'});
    onSuccess();
  } catch (e) {
    console.log(e);
  }
};

export const connectToNetwork =
  (providerName, providerUrl, wallet, onSuccess, onError) => async dispatch => {
    console.log(providerName, 'provider name');
    let balance;
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    provider
      .getBalance(wallet.address)
      .then(_balance => {
        balance = ethers.utils.formatEther(_balance);
        dispatch({
          type: 'SET_WALLET_NETWORK',
          provider,
          providerName,
          balance,
          // walletConnectProvider,
        });

        onSuccess && onSuccess();
      })
      .catch(e => {
        console.log(e);
        onError(e);
      });
  };

export const getWalletBalance =
  (provider, wallet, onSuccess) => async dispatch => {
    provider
      .getBalance(wallet.address)
      .then(_balance => {
        const formatBalance = ethers.utils.formatEther(_balance);
        dispatch({
          type: 'SET_WALLET_BALANCE',
          balance: formatBalance,
        });
        onSuccess && onSuccess();
      })
      .catch(e => {
        console.log(e);
      });
  };
export const getAssetBalances =
  (assets, wallet, onSuccess) => async dispatch => {
    try {
      let newAssets = [];
      await Promise.all(
        assets?.map(async (item, index) => {
          const tokenContract = Contract({
            wallet,
            address: item.address,
            type: item.type,
          }).get();
          const balance = await tokenContract.balanceOf(wallet.address);
          const formattedBalance = ethers.utils.formatEther(balance);
          item.balance = formattedBalance;
          newAssets = [item, ...newAssets];
          return;
        }),
      );
      AsyncStorage.setItem('assets', JSON.stringify(newAssets))
        .then(() => {
          dispatch({type: 'UPDATE_ASSETS', payload: newAssets});
          onSuccess();
        })
        .catch(e => console.log(e));
    } catch (e) {
      console.log(e);
    }
  };

export const sendToken =
  (address, amount, wallet, provider, onSuccess, onError) => async dispatch => {
    const tx = {
      to: address,
      value: ethers.utils.parseEther(amount),
    };
    let walletConnectProvider = wallet.connect(provider);

    walletConnectProvider
      .sendTransaction(tx)
      .then(res => {
        onSuccess();
      })
      .catch(e => {
        console.log(e, 'error');
        onError(e);
      });
  };

export const uploadDocument = (data, onSuccess, onError) => async dispatch => {
  try {
    const response = await api.apiUploadDocument(data);
    onSuccess(response.data);
  } catch (e) {
    onError(e);
    console.log(e);
  }
};

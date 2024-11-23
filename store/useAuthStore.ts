import {create} from 'zustand';
import api from '../helper/axios';
import {showToast} from '../helper/toast';
import {removeData, storeData} from '../helper/storage';

type User = {
  email: string;
  password: string;
};

type AuthStoreStates = {
  isFetchLoading: boolean;
  isLoginLoading: boolean;
  userLoginPayload: User;
  setUserLoginPayload: (data: Partial<User>) => void;
  user: User | null;
  getUser: () => Promise<boolean>;
  login: () => Promise<boolean>;
  logout: () => Promise<boolean>;
};

const useAuthStore = create<AuthStoreStates>((set, get) => ({
  user: null,
  isFetchLoading: true,
  isLoginLoading: false,
  userLoginPayload: {
    email: '',
    password: '',
  },

  setUserLoginPayload: data => {
    let prev = get().userLoginPayload;
    set({userLoginPayload: {...prev, ...data}});
  },

  getUser: async () => {
    try {
      set({isFetchLoading: true});
      const {data} = await api.get('/user');
      set({user: data?.data});
      return true;
    } catch (e: any) {
      showToast('error', e.response.data.message);
      removeData('token');
      return false;
    } finally {
      set({isFetchLoading: false});
    }
  },
  login: async () => {
    try {
      set({isLoginLoading: true});
      const userLoginPayload = get().userLoginPayload;
      const {data} = await api.post('/auth/login', userLoginPayload);
      set({
        user: userLoginPayload,
      });
      showToast('success', 'Login Successful');
      storeData('token', data.data.token);
      return true;
    } catch (e: any) {
      showToast('error', e.response.data.message);
      removeData('token');
      return false;
    } finally {
      set({isLoginLoading: false});
    }
  },
  logout: async () => {
    try {
      removeData('token');
      set({user:null})
      return true;
    } catch (error) {
      return false;
    }
  },
}));

export default useAuthStore;

import {create} from 'zustand';
import api from '../helper/axios';
import {showToast} from '../helper/toast';
import {removeData, storeData} from '../helper/storage';

type User = {
  email: string;
  password: string;
};

type AuthStoreStates = {
  loading: boolean;
  user: User;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  getUser: () => void;
  login: () => void;
  checkIsAuthenticated: () => void;
};

const useAuthStore = create<AuthStoreStates>(set => ({
  user: {
    email: '',
    password: '',
  },
  loading: false,
  isAuthenticated: false,
  setUser: user => set({user}),
  getUser: async () => {
    try {
      const {data} = await api.get('/user');
      set({loading: false, isAuthenticated: true});
    } catch (e: any) {
      showToast('error', e.response.data.message);
      set({loading: false, isAuthenticated: false});
      removeData('token');
    }
  },
  login: async () => {
    set({loading: true});
    try {
      const {email, password} = useAuthStore.getState().user;
      console.log(email, password);
      const {data} = await api.post('/auth/login', {email, password});
      set({
        loading: false,
        isAuthenticated: true,
        user: {email: '', password: ''},
      });
      showToast('success', 'Login Successful');
      storeData('token', data.data.token);
    } catch (e: any) {
      showToast('error', e.response.data.message);
      set({loading: false, isAuthenticated: false});
      removeData('token');
    }
  },
  checkIsAuthenticated: async () => {
    try {
      const {data} = await api.get('/user');
      console.log(data);
      set({loading: false, isAuthenticated: true});
    } catch (e: any) {
      set({loading: false, isAuthenticated: false});
      removeData('token');
    }
  },
}));

export default useAuthStore;

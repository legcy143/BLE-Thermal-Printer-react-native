import {create} from 'zustand';
import api from '../helper/axios';
import {showToast} from '../helper/toast';

export type Event = {
  _id: string;
  user: string;
  name: string;
  logo: string;
  bgImage: string;
  eventType: string;
  eventDate: {
    start: string;
    end: string;
  };
  sessions: any[];
};

type EventStoreStates = {
  loading: boolean;
  events: Event[];
  getEvents: () => void;
};

const useEventStore = create<EventStoreStates>(set => ({
  loading: false,
  events: [],
  getEvents: async () => {
    set({loading: true});
    try {
      const {data} = await api.get('/registration');
      set({loading: false, events: data.data});
    } catch (e: any) {
      showToast('error', e.response.data.message);
      set({loading: false});
    }
  },
}));

export default useEventStore;

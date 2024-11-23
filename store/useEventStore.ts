import {create} from 'zustand';
import api from '../helper/axios';
import {showToast} from '../helper/toast';

export interface RegistrationInterface {
  _id: string;
  name: string;
  logo: string;
  bgImage: string;
  eventType: 'COLLECT' | 'SEND';
  eventDate: {
    start: Date;
    end: Date;
  };
  Location: string;
  plannerDetails: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  venue: string;
  marketingMessage: any;
  fields: any[];
  data: any[];
  attendeeTypes: any;
  sessions: any;
  createdAt: string;
  forms?: {
    data: any[];
  };
}

type EventStoreStates = {
  isFetchLoading: boolean;
  events: RegistrationInterface[] | null;
  getEvents: () => void;
};

const useEventStore = create<EventStoreStates>(set => ({
  isFetchLoading: false,
  events: null,
  getEvents: async () => {
    try {
      set({isFetchLoading: true});
      const {data} = await api.get('/registration');
      set({isFetchLoading: false, events: data?.data});
    } catch (e: any) {
      showToast('error', e?.response?.data?.message);
      set({isFetchLoading: false});
    }
  },
}));

export default useEventStore;

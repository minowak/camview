import { create } from 'zustand';

export type CameraResponse = {
  id: string;
  details: {
    id: string;
    link: string;
    image: string;
    country: string;
    region: string;
    city: string;
    loclat: string;
    locllon: string;
    zip: string;
    timezone: string;
    manufacturer: string;
  };
};

export type Countries = Record<
  string,
  {
    country: string;
    count: number;
  }
>;

export type CameraStoreState = {
  newCameras: CameraResponse[];
  countryCameras: Record<string, CameraResponse[]>;
  countries: Countries;
  selectedCountry: string;
  loading: boolean;
  fetchNewCameras: () => Promise<void>;
  fetchCountryCameras: (country: string) => Promise<void>;
  fetchCountries: () => Promise<void>;
  setSelectedCountry: (country: string) => void;
};

export const useCameraStore = create<CameraStoreState>()((set, get) => ({
  newCameras: [],
  countryCameras: {},
  loading: false,
  countries: {},
  selectedCountry: 'RU',
  fetchNewCameras: async () => {
    set({ loading: true });
    window.electron.ipcRenderer.once('get-new-cameras', (response) => {
      set({ newCameras: response as CameraResponse[], loading: false });
    });
    window.electron.ipcRenderer.sendMessage('get-new-cameras');
  },
  fetchCountryCameras: async (country: string) => {
    set({ loading: true });
    console.log(country);
    window.electron.ipcRenderer.once('get-country-cameras', (response) => {
      let existing = { ...get().countryCameras };
      existing[country] = response as CameraResponse[];
      console.log(country);
      set({ countryCameras: existing, loading: false });
    });
    window.electron.ipcRenderer.sendMessage('get-country-cameras', [country]);
  },
  fetchCountries: async () => {
    window.electron.ipcRenderer.once('get-countries', (response) => {
      set({ countries: response as Countries });
    });
    window.electron.ipcRenderer.sendMessage('get-countries');
  },
  setSelectedCountry: (country: string) => {
    set({ selectedCountry: country });
  },
}));

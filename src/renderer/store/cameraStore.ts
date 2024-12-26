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
  placeCameras: Record<string, CameraResponse[]>;
  manufacturerCameras: Record<string, CameraResponse[]>;

  countries: Countries;
  places: string[];
  manufacturers: string[];

  selectedCountry: string;
  selectedPlace: string;
  selectedManufacturer: string;
  cameraDetails?: CameraResponse;
  selectedCameraId?: string;
  loading: boolean;
  setSelectedCameraId: (id: string) => void;
  fetchNewCameras: () => Promise<void>;
  fetchCountryCameras: (country: string) => Promise<void>;
  fetchPlaceCameras: (place: string) => Promise<void>;
  fetchCountries: () => Promise<void>;
  setSelectedCountry: (country: string) => void;
  setSelectedPlace: (place: string) => void;
  fetchPlaces: () => Promise<void>;
  fetchManufacturers: () => Promise<void>;
  setSelectedManufacturer: (manufacturer: string) => void;
  fetchManufacturerCameras: (manufacturer: string) => Promise<void>;
  fetchCameraDetails: (id: string) => Promise<void>;
};

export const useCameraStore = create<CameraStoreState>()((set, get) => ({
  newCameras: [],
  countryCameras: {},
  placeCameras: {},
  loading: false,
  countries: {},
  selectedCountry: '',
  selectedPlace: '',
  cameraDetails: undefined,
  places: [],
  manufacturers: [],
  selectedManufacturer: '',
  manufacturerCameras: {},
  selectedCameraId: undefined,
  setSelectedCameraId: (id: string) => {
    set({ selectedCameraId: id });
  },
  fetchCameraDetails: async (id: string) => {
    set({ loading: true });
    window.electron.ipcRenderer.once('get-camera-details', (response) => {
      set({ cameraDetails: response as CameraResponse, loading: false });
    });
    window.electron.ipcRenderer.sendMessage('get-camera-details', [id]);
  },
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
  fetchPlaces: async () => {
    window.electron.ipcRenderer.once('get-places', (response) => {
      console.log(response);
      set({ places: response as string[] });
    });
    window.electron.ipcRenderer.sendMessage('get-places');
  },
  setSelectedPlace: (place: string) => {
    set({ selectedPlace: place });
  },
  fetchPlaceCameras: async (place: string) => {
    set({ loading: true });
    window.electron.ipcRenderer.once('get-place-cameras', (response) => {
      let existing = { ...get().placeCameras };
      existing[place] = response as CameraResponse[];
      set({ placeCameras: existing, loading: false });
    });
    window.electron.ipcRenderer.sendMessage('get-place-cameras', [place]);
  },
  setSelectedManufacturer: (manufacturer: string) => {
    set({ selectedManufacturer: manufacturer });
  },
  fetchManufacturers: async () => {
    window.electron.ipcRenderer.once('get-manufacturers', (response) => {
      set({ manufacturers: response as string[] });
    });
    window.electron.ipcRenderer.sendMessage('get-manufacturers');
  },
  fetchManufacturerCameras: async (manufacturer: string) => {
    set({ loading: true });
    window.electron.ipcRenderer.once('get-manufacturer-cameras', (response) => {
      let existing = { ...get().manufacturerCameras };
      existing[manufacturer] = response as CameraResponse[];
      set({ manufacturerCameras: existing, loading: false });
    });
    window.electron.ipcRenderer.sendMessage('get-manufacturer-cameras', [
      manufacturer,
    ]);
  },
}));

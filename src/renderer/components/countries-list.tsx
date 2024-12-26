import { useEffect, useState } from 'react';
import { CameraList } from './camera-list';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';
import { useCameraStore } from '@/store/cameraStore';
import { RefreshCwIcon, SearchIcon } from 'lucide-react';

export const CountriesList: React.FC = () => {
  const {
    fetchCountryCameras,
    countryCameras,
    countries,
    fetchCountries,
    loading,
    selectedCountry,
    setSelectedCountry,
  } = useCameraStore((state) => state);

  useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <div className="mt-4">
      <div className="flex gap-4 items-center">
        <Select
          defaultValue={selectedCountry}
          onValueChange={(country) => setSelectedCountry(country)}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {Object.keys(countries)
              .sort()
              .map((country) => (
                <SelectItem key={country} value={country}>
                  {countries[country].country} ({countries[country].count})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => fetchCountryCameras(selectedCountry)}
          disabled={loading}
        >
          {loading ? (
            <RefreshCwIcon className="size-4 animate-spin" />
          ) : (
            <SearchIcon className="size-4" />
          )}
          Show
        </Button>
      </div>
      <CameraList
        fetchCameras={() => fetchCountryCameras(selectedCountry)}
        cameras={countryCameras[selectedCountry]}
      />
    </div>
  );
};

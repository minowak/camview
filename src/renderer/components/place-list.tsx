import { useEffect } from 'react';
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

export const PlacesList: React.FC = () => {
  const {
    fetchPlaceCameras,
    placeCameras,
    places,
    fetchPlaces,
    loading,
    selectedPlace,
    setSelectedPlace,
  } = useCameraStore((state) => state);

  useEffect(() => {
    fetchPlaces();
  }, []);

  return (
    <div className="mt-4">
      <div className="flex gap-4 items-center">
        <Select
          defaultValue={selectedPlace}
          onValueChange={(place) => setSelectedPlace(place)}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select place" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {places.sort().map((place) => (
              <SelectItem key={place} value={place}>
                {place}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => fetchPlaceCameras(selectedPlace)}
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
        fetchCameras={() => fetchPlaceCameras(selectedPlace)}
        cameras={placeCameras[selectedPlace]}
      />
    </div>
  );
};

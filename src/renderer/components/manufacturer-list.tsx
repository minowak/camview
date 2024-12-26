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

export const ManufacturerList: React.FC = () => {
  const {
    fetchManufacturerCameras,
    manufacturerCameras,
    manufacturers,
    fetchManufacturers,
    loading,
    selectedManufacturer,
    setSelectedManufacturer,
  } = useCameraStore((state) => state);

  useEffect(() => {
    fetchManufacturers();
  }, []);

  return (
    <div className="mt-4">
      <div className="flex gap-4 items-center">
        <Select
          defaultValue={selectedManufacturer}
          onValueChange={(manufacturer) =>
            setSelectedManufacturer(manufacturer)
          }
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select manufacturer" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {manufacturers.sort().map((manufacturer) => (
              <SelectItem key={manufacturer} value={manufacturer}>
                {manufacturer}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => fetchManufacturerCameras(selectedManufacturer)}
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
        fetchCameras={() => fetchManufacturerCameras(selectedManufacturer)}
        cameras={manufacturerCameras[selectedManufacturer]}
      />
    </div>
  );
};

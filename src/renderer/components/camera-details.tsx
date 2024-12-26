import { useCameraStore } from '@/store/cameraStore';
import { useEffect, useRef } from 'react';
import { CameraList } from './camera-list';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { RefreshCwIcon, SearchIcon } from 'lucide-react';

export const CameraDetails: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    selectedCameraId,
    setSelectedCameraId,
    cameraDetails,
    fetchCameraDetails,
    loading,
  } = useCameraStore((state) => state);

  useEffect(() => {
    if (selectedCameraId) {
      fetchCameraDetails(selectedCameraId);
    }
  }, [selectedCameraId]);

  return (
    <div className="mt-4">
      <div className="flex items-center gap-4">
        <Input
          ref={inputRef}
          className="w-[300px]"
          defaultValue={selectedCameraId}
          placeholder="Camera ID"
        />
        <Button
          disabled={loading}
          onClick={() => {
            setSelectedCameraId(inputRef.current?.value || '');
          }}
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
        fetchCameras={() => fetchCameraDetails(selectedCameraId)}
        cameras={cameraDetails ? [cameraDetails] : []}
      />
    </div>
  );
};

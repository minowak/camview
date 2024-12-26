import { encode as base64_encode } from 'base-64';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { RefreshCwIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CameraResponse } from '@/store/cameraStore';
import { useCameraStore } from '@/store/cameraStore';

type Props = {
  fetchAtStart?: boolean;
  fetchCameras: () => Promise<void>;
  cameras: CameraResponse[];
};

export const CameraList: React.FC<Props> = ({
  fetchAtStart,
  fetchCameras,
  cameras,
}) => {
  const navigate = useNavigate();
  const { loading } = useCameraStore((state) => state);

  useEffect(() => {
    if (fetchAtStart) {
      fetchCameras();
    }
  }, [fetchAtStart]);

  return (
    <div>
      <div className="my-4 flex justify-end">
        <Button onClick={fetchCameras} disabled={loading} variant="outline">
          <RefreshCwIcon
            className={cn('size-4 mr-2', loading ? 'animate-spin' : '')}
          />
          Refresh
        </Button>
      </div>
      <Table>
        <TableCaption>
          {cameras?.length ? 'A list of cameras' : 'No results'}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Camera ID</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>City</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cameras?.map((cameraResponse) => (
            <TableRow key={'camera_' + cameraResponse.id}>
              <TableCell>{cameraResponse.id}</TableCell>
              <TableCell>
                <img src={cameraResponse.details.image} className="size-24" />
              </TableCell>
              <TableCell>{cameraResponse.details.country}</TableCell>
              <TableCell>{cameraResponse.details.region}</TableCell>
              <TableCell>{cameraResponse.details.city}</TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    navigate(
                      `/camera-view/${base64_encode(cameraResponse.details.link)}`,
                    );
                  }}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

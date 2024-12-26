import { encode as base64_encode } from 'base-64';
import { CameraResponse } from '@/pages/MainPage';
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
import { useEffect, useState } from 'react';
import { Channels } from 'src/main/preload';
import { RefreshCwIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Spinner } from './spinner';

type Props = {
  channel: Channels;
  args?: any;
  fetchAtStart?: boolean;
};

export const CameraList: React.FC<Props> = ({
  channel,
  args,
  fetchAtStart,
}) => {
  const navigate = useNavigate();
  const [cameraList, setCameraList] = useState<CameraResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const onClick = () => {
    setLoading(true);
    window.electron.ipcRenderer.once(channel, (response) => {
      setCameraList(response as CameraResponse[]);
      setLoading(false);
    });
    window.electron.ipcRenderer.sendMessage(channel, args);
  };

  useEffect(() => {
    if (fetchAtStart) {
      onClick();
    }
  }, [fetchAtStart]);

  return (
    <div>
      <div className="my-4 flex justify-end">
        <Button onClick={onClick} disabled={loading} variant="outline">
          <RefreshCwIcon
            className={cn('size-4 mr-2', loading ? 'animate-spin' : '')}
          />
          Refresh
        </Button>
      </div>
      <Table>
        <TableCaption>
          {cameraList?.length ? 'A list of cameras' : 'No results'}
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
          {cameraList.map((cameraResponse) => (
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

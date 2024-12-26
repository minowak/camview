import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';

type CameraResponse = {
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

export const MainPage: React.FC = () => {
  const [cameraList, setCameraList] = useState<CameraResponse[]>([]);

  const onClick = () => {
    window.electron.ipcRenderer.once('get-country-cameras', (response) => {
      setCameraList(response as CameraResponse[]);
    });
    window.electron.ipcRenderer.sendMessage('get-country-cameras', ['US']);
  };

  return (
    <div>
      <h1 className="text-center">CamView</h1>
      <div className="flex gap-x-4 justify-center">
        <Button onClick={onClick}>Show list</Button>
      </div>
      {cameraList?.length > 0 && (
        <div>
          <Table>
            <TableCaption>A list of cameras</TableCaption>
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
                    <img
                      src={cameraResponse.details.image}
                      className="size-24"
                    />
                  </TableCell>
                  <TableCell>{cameraResponse.details.country}</TableCell>
                  <TableCell>{cameraResponse.details.region}</TableCell>
                  <TableCell>{cameraResponse.details.city}</TableCell>
                  <TableCell>
                    <Button>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

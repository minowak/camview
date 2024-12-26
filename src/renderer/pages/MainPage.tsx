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
import { useNavigate } from 'react-router-dom';
import { encode as base64_encode } from 'base-64';
import { TopBar } from '@/components/top-bar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2Icon,
  EarthIcon,
  FactoryIcon,
  HashIcon,
  RssIcon,
} from 'lucide-react';

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
  const navigate = useNavigate();
  const [cameraList, setCameraList] = useState<CameraResponse[]>([]);

  const onClick = () => {
    window.electron.ipcRenderer.once('get-country-cameras', (response) => {
      setCameraList(response as CameraResponse[]);
    });
    window.electron.ipcRenderer.sendMessage('get-country-cameras', ['US']);
  };

  return (
    <div>
      <TopBar />
      <Tabs defaultValue="new" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="new">
            <RssIcon className="size-4 mr-2" />
            New
          </TabsTrigger>
          <TabsTrigger value="country">
            <EarthIcon className="size-4 mr-2" />
            Country
          </TabsTrigger>
          <TabsTrigger value="city">
            <Building2Icon className="size-4 mr-2" />
            City
          </TabsTrigger>
          <TabsTrigger value="manufacturer">
            <FactoryIcon className="size-4 mr-2" />
            Manufacturer
          </TabsTrigger>
          <TabsTrigger value="cameraId">
            <HashIcon className="size-4 mr-2" />
            Camera ID
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
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
      )}
    </div>
  );
};

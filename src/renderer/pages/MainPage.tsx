import { TopBar } from '@/components/top-bar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2Icon,
  EarthIcon,
  FactoryIcon,
  HashIcon,
  RssIcon,
} from 'lucide-react';
import { CameraList } from '@/components/camera-list';
import { CountriesList } from '@/components/countries-list';
import { useCameraStore } from '@/store/cameraStore';

export const MainPage: React.FC = () => {
  const { fetchNewCameras, newCameras } = useCameraStore((state) => state);

  return (
    <div>
      <TopBar />
      <Tabs defaultValue="new">
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
        <TabsContent value="country">
          <CountriesList />
        </TabsContent>
        <TabsContent value="new">
          <CameraList
            fetchCameras={fetchNewCameras}
            cameras={newCameras}
            fetchAtStart
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

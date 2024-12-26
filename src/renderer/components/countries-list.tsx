import { useEffect, useState } from 'react';
import { CameraList } from './camera-list';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';

type Countries = Record<
  string,
  {
    country: string;
    count: number;
  }
>;

export const CountriesList: React.FC = () => {
  const [countries, setCountries] = useState<Countries>({});
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const fetchCountries = () => {
    window.electron.ipcRenderer.once('get-countries', (response) => {
      setCountries(response as Countries);
    });
    window.electron.ipcRenderer.sendMessage('get-countries');
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <div className="mt-4">
      <div className="flex gap-4 items-center">
        <Select>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(countries).map((country) => (
              <SelectItem
                key={country}
                value={country}
                onClick={() => setSelectedCountry(country)}
              >
                {countries[country].country} ({countries[country].count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button>Show</Button>
      </div>
      <CameraList channel="get-country-cameras" args={[selectedCountry]} />
    </div>
  );
};

import { Button } from '@/components/ui/button';

export const MainPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-center">CamView</h1>
      <div className="flex gap-x-4 justify-center">
        <Button>Show list</Button>
      </div>
    </div>
  );
};

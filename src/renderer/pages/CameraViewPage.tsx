import { useNavigate, useParams } from 'react-router-dom';
import { decode as base64_decode } from 'base-64';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';

export const CameraViewPage: React.FC = () => {
  const navigate = useNavigate();
  const p = useParams();
  const url = base64_decode(p.url as string);

  return (
    <div className="space-y-4 bg-red-40 h-full">
      <Button
        onClick={() => {
          navigate('/');
        }}
      >
        <ArrowLeftIcon className="size-10" />
      </Button>
      <iframe src={url} height="95%" width="100%"></iframe>
    </div>
  );
};

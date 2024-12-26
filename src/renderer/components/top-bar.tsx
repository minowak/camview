import { CctvIcon } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <div className="flex items-start gap-4 border-b border-black mb-4">
      <CctvIcon className="size-8" />
      <h1>CamView</h1>
    </div>
  );
};

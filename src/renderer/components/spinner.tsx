import { cn } from '@/lib/utils';
import { RefreshCwIcon } from 'lucide-react';

type Props = {
  className?: string;
};

export const Spinner: React.FC<Props> = ({ className }) => {
  return <RefreshCwIcon className={cn('animate-spin', className)} />;
};

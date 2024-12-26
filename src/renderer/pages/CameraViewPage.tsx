type Props = {
  url: string;
};

export const CameraViewPage: React.FC<Props> = ({ url }) => {
  return <iframe src={url} height="100%" width="100%"></iframe>;
};

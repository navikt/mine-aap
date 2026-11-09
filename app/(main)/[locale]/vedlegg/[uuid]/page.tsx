import { Vedlegg } from 'components/Vedlegg/Vedlegg';

interface PageParams {
  uuid: string;
}

const Page = async ({ params }: Readonly<{ params: Promise<PageParams> }>) => {
  const { uuid } = await params;

  return <Vedlegg uuid={uuid} />;
};

export default Page;

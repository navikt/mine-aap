const RootPage = ({ params }: { params: { lang: string } }) => {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT !== 'localhost') {
    return null;
  }

  return (
    <div>
      <h1>Valgt språk {params.lang}</h1>
    </div>
  );
};

export default RootPage;

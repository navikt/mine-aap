import { Button, Heading } from '@navikt/ds-react';

const Debug = () => {
  return (
    <div>
      <Heading level="1" size="xlarge">
        Debug
      </Heading>
      <Button
        onClick={() => {
          throw new Error('Hei Faro');
        }}
      >
        Throw error
      </Button>
      <Button onClick={() => console.error('Faro error')}>Log error</Button>
    </div>
  );
};

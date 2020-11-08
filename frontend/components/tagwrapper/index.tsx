import { Box } from '@chakra-ui/core';
import { useRouter } from 'next/dist/client/router';
import React from 'react';

import Tags from '../tags/tags';

const TagName = [
  {
    id: 0,
    label: 'All',
    event: null,
  },
  {
    id: 1,
    label: 'Role Set',
    event: 'roleSet',
  },
  {
    id: 2,
    label: 'Initialised',
    event: 'initialised',
  },
  {
    id: 3,
    label: 'Payout Claimed',
    event: 'payments',
  },
  {
    id: 4,
    label: 'Domain Added',
    event: 'domainAdded',
  },
];

const TagWrapper = () => {
  const { replace } = useRouter();
  return (
    <Box className='container-tagWrapper' d='flex' width='100%' justifyContent='center'>
      {TagName.map(({ id, label, event }) => {
        return (
          <Tags
            key={id}
            tagName={label}
            onClick={() => {
              event ? replace(`/${event}`) : replace(`/`);
            }}
          />
        );
      })}
    </Box>
  );
};

export default TagWrapper;

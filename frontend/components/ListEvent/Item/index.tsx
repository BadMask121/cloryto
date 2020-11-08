import { Box, Image, Text } from '@chakra-ui/core';
import moment from 'dayjs';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import { CLEventGroup } from '../../../../@types/events';

import blockies from 'ethereum-blockies-base64';

const Span = styled.span`
  font-weight: 600;
`;
export const Item = (eventInfo: CLEventGroup) => {
  const avatar = blockies(eventInfo.userAddress);

  const preTitle = useMemo(() => {
    switch (eventInfo.type) {
      case 'roleSet':
        return (
          <Text>
            <Span>{eventInfo.role}</Span> assigned to user <Span>{eventInfo.userAddress}</Span> in
            domain <Span>{eventInfo.domainId}</Span>
          </Text>
        );
      case 'initialised':
        return <Text>{eventInfo.message}</Text>;

      case 'payments':
        return (
          <Text>
            User <Span>{eventInfo.userAddress}</Span> claimed <Span>{eventInfo.amount}</Span>
            <Span>{eventInfo.token}</Span> payout from pot <Span>{eventInfo.fundingPotId}</Span>.
          </Text>
        );

      case 'domainAdded':
        return (
          <Text>
            Domain <Span>{eventInfo.domainId} added</Span>
          </Text>
        );

      default:
        break;
    }
  }, [typeof eventInfo.type !== undefined]);

  return (
    <Box
      height='90px'
      padding='20px 26px'
      boxShadow='0px -1.5px 3px rgba(62, 118, 244, 0.14)'
      d='flex'
      alignItems='center'
    >
      <Box>
        <Image rounded='full' w='37px' h='37px' src={avatar} alt='Avatar of user' />
      </Box>
      <Box marginLeft='20px'>
        <Text fontSize='14px' fontWeight={400}>
          {preTitle}
        </Text>
        <Text color='#A6A5B1' fontSize='12px' fontWeight={500}>
          {moment(eventInfo.timestamp).format('DD MMM YYYY, hh:mm a')}
        </Text>
      </Box>
    </Box>
  );
};

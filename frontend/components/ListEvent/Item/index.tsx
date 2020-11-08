import {
  Box,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/core';
import moment from 'dayjs';
import blockies from 'ethereum-blockies-base64';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import { CLEventGroup } from '../../../../@types/events';

const Span = styled.span`
  font-weight: 600;
`;
export const Item = (eventInfo: CLEventGroup) => {
  const avatar = blockies(eventInfo.userAddress);
  let textRef = React.useRef<HTMLParagraphElement>();
  const [isOverFlowing, setisOverFlowing] = React.useState(false);

  const preTitle = useMemo(() => {
    switch (eventInfo.type) {
      case 'roleSet':
        return (
          <React.Fragment>
            <Span>{eventInfo.role}</Span> assigned to user <Span>{eventInfo.userAddress}</Span> in
            domain <Span>{eventInfo.domainId}</Span>
          </React.Fragment>
        );
      case 'initialised':
        return <React.Fragment>{eventInfo.message}</React.Fragment>;

      case 'payments':
        return (
          <React.Fragment>
            User <Span>{eventInfo.userAddress}</Span> claimed <Span>{eventInfo.amount}</Span>
            <Span>{eventInfo.token}</Span> payout from pot <Span>{eventInfo.fundingPotId}</Span>.
          </React.Fragment>
        );

      case 'domainAdded':
        return (
          <React.Fragment>
            Domain <Span>{eventInfo.domainId} added</Span>
          </React.Fragment>
        );

      default:
        break;
    }
  }, [typeof eventInfo.type !== undefined]);

  // overflow of title to programmatically show tooltip
  function _checkOverflow(el) {
    if (!el) return false;
    var curOverflow = el.style.overflow;
    if (!curOverflow || curOverflow === 'visible') el.style.overflow = 'hidden';
    var isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
    el.style.overflow = curOverflow;
    return isOverflowing;
  }

  React.useEffect(() => {
    if (textRef.current) {
      const isOverFlow = _checkOverflow(textRef.current);
      if (isOverFlow) {
        setisOverFlowing(isOverFlow);
      }
    }
  }, [textRef]);

  return (
    <Box
      height='90px'
      padding='20px 26px'
      boxShadow='0px -1.5px 3px rgba(62, 118, 244, 0.14)'
      d='flex'
      alignItems='center'
    >
      <Box>
        <Image
          rounded='full'
          w={eventInfo.type === 'payments' ? '60px' : '37px'}
          h='37px'
          src={avatar}
          alt='Avatar of user'
        />
      </Box>
      <Box marginLeft='20px' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
        <Popover trigger='hover'>
          <PopoverTrigger>
            <Text
              color='#243447'
              fontSize='14px'
              fontWeight={400}
              overflow='hidden'
              textOverflow='ellipsis'
              id={`preText-${eventInfo?.id}`}
              title={textRef.current?.textContent}
              ref={textRef}
            >
              {preTitle}
            </Text>
          </PopoverTrigger>
          {isOverFlowing && (
            <PopoverContent
              maxW='500px !important'
              boxShadow='0px 0px 5px rgba(62, 118, 244, 0.14)'
            >
              <PopoverArrow />
              <PopoverBody width='500px'>
                <Text whiteSpace='normal' fontSize='13px' fontWeight={500}>
                  {preTitle}
                </Text>
              </PopoverBody>
            </PopoverContent>
          )}
        </Popover>
        <Text color='#A6A5B1' fontSize='12px' fontWeight={500}>
          {moment(eventInfo.timestamp).format('DD MMM YYYY, hh:mm a')}
        </Text>
      </Box>
    </Box>
  );
};

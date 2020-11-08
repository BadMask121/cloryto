import { Box, Image, Spinner, Text } from '@chakra-ui/core';
import Axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useEventContext } from '../context/Event';

export const Item = () => {
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
          w='37px'
          h='37px'
          src='https://bit.ly/sage-adebayo'
          alt='Segun Adebayo'
        />
      </Box>
      <Box marginLeft='20px'>
        <Text fontSize='14px' fontWeight='normal'>
          he
        </Text>
        <Text color='#A6A5B1' fontSize='12px' fontWeight={500}>
          30 Jul
        </Text>
      </Box>
    </Box>
  );
};

const ListEvent = () => {
  const { fetchEvents, events, error } = useEventContext();
  const { query } = useRouter();

  useEffect(() => {
    const axiosSource = Axios.CancelToken.source();
    fetchEvents({ cancelToken: axiosSource.token });
    return () => axiosSource.cancel();
  }, []);

  const EventsContent = React.useMemo(() => {
    return Array.isArray(events) && events.map((o) => <Item />);
  }, [events]);

  const Loader = () => (
    <Box width='100%' d='flex' alignItems='center' justifyContent='center' paddingBottom='20px'>
      <Spinner size={'lg'} />
    </Box>
  );

  const NotFound = () => (
    <Box width='100%' d='flex' alignItems='center' justifyContent='center' paddingBottom='20px'>
      <Text fontSize='30px' fontWeight='bold' style={{ color: 'red' }}>
        No Events Logged
      </Text>
    </Box>
  );

  return (
    <React.Fragment>
      {!error.error ? (
        <InfiniteScroll
          dataLength={events.length} //This is important field to render the next data
          next={() => {
            if (events?.[events.length - 1]?.timestamp) {
              fetchEvents({
                lastTime: events[events.length - 1].timestamp as number,
                event: query?.index as string,
              });
            }
          }}
          hasMore={true}
          loader={<Loader />}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>You have seen it all</b>
            </p>
          }
          refreshFunction={fetchEvents}
          pullDownToRefresh
          pullDownToRefreshThreshold={50}
          pullDownToRefreshContent={
            <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
          }
          releaseToRefreshContent={
            <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
          }
        >
          <Box
            width='700px'
            margin='0 auto'
            borderRadius='6px'
            background='#fff'
            height='fit-content'
          >
            {EventsContent}
          </Box>
        </InfiniteScroll>
      ) : (
        <NotFound />
      )}
    </React.Fragment>
  );
};

export default ListEvent;

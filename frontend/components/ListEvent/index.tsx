import { Box, Spinner, Text } from '@chakra-ui/core';
import Axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useEventContext } from '../context/Event';
import { Item } from './Item';

const ListEvent = () => {
  const { fetchEvents, events, error, loading } = useEventContext();
  const { query } = useRouter();

  // make api call on component render
  useEffect(() => {
    const axiosSource = Axios.CancelToken.source();

    const payload = { cancelToken: axiosSource.token, event: undefined };
    payload.event = query?.index as string;
    fetchEvents(payload);
    return () => axiosSource.cancel();
  }, [query]);

  const EventsContent = React.useMemo(
    () => Array.isArray(events) && events.map((o) => <Item key={o.id} {...o} />),
    [events]
  );

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
            console.log('next');
            if (events?.[events.length - 1]?.timestamp) {
              fetchEvents({
                lastTime: events[events.length - 1].timestamp as number,
                event: query?.index as string,
              });
            }
          }}
          hasMore={typeof events?.[events.length - 1]?.timestamp !== 'undefined'}
          loader={loading ? <Loader /> : null}
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
            marginBottom='30px'
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

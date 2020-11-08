import React from 'react';
import { Media } from '../../../../@types/tweet';
import Player from '../player';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import { Box, IconButton, Text } from '@chakra-ui/core';

// @ts-ignore
import Download from './download-outline-o.svg';
import { download_urls } from '../../../helpers/index';

interface MediaProps {
  media: Media[];
  username: string;
  dateTime: string;
}
const Content = ({ dateTime, media, username }: MediaProps) => {
  const _renderMedia = media.map((o, i) => {
    return (
      <Slide key={i} index={i}>
        <Player {...o} videoProp={{ playing: true }} />
      </Slide>
    );
  });

  return (
    <div className='media-container'>
      <div className='media-container__contents'>
        <CarouselProvider naturalSlideWidth={1} naturalSlideHeight={1} totalSlides={media.length}>
          <Slider>{_renderMedia}</Slider>
          {/* <Box>
            <ButtonBack>Back</ButtonBack>
            <ButtonNext>Next</ButtonNext>
          </Box> */}
        </CarouselProvider>
      </div>
      <Box className='media-container__poster' d='flex' alignItems='center'>
        <Text className='poster' fontWeight={500}>
          {username}
        </Text>
        <Box d='flex' alignItems='center'>
          <Text className='date'>{dateTime}</Text>
          <IconButton
            aria-label='Search database'
            rounded='50px'
            marginLeft='10px'
            icon={<Download />}
            onClick={() => {
              const urls = [];
              media.forEach((o) => {
                urls.push(o.media_url_https);
              });
              download_urls(urls, `${username}__${dateTime}`);
            }}
          />
        </Box>
      </Box>
    </div>
  );
};

export default Content;

import React from 'react';
// import { Image } from '@chakra-ui/core';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import { Media } from '../../../../@types/tweet';
import { ImageWithZoom } from 'pure-react-carousel';

export interface IPlayer extends Media {
  videoProp?: ReactPlayerProps;
}
const Player = (media: IPlayer) => {
  if (media.type !== 'photo')
    return (
      <ReactPlayer
        url={media.media_url_https ?? media.media_url}
        playing={true}
        {...media.videoProp}
      />
    );

  return (
    <ImageWithZoom src={media.media_url_https ?? media.media_url} aria-label={media.media_url} />
  );
};

export default Player;

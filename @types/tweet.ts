export type Tweet = {
  id: string;
  user: User;
  body: string;
  hashtag: string;
  media: Media[];
  timestamp: string | number;
};

export interface ITwitter {
  id: string;
  text?: string;
  created_at?: string;
  user?: User;
  entities?: Entities;
}

export interface Entities {
  hashtags?: any[];
  symbols?: any[];
  urls?: any[];
  user_mentions?: any[];
  media?: Media[];
}

export interface Media {
  id?: number;
  id_str?: string;
  indices?: number[];
  media_url?: string;
  media_url_https?: string;
  url?: string;
  display_url?: string;
  expanded_url?: string;
  type?: string;
  sizes?: Sizes;
}

export interface Sizes {
  medium?: Large;
  thumb?: Large;
  small?: Large;
  large?: Large;
}

export interface Large {
  w?: number;
  h?: number;
  resize?: string;
}

export interface User {
  id?: number;
  id_str?: string;
  name?: string;
  profile_image_url?: string;
  profile_image_url_https?: string;
}

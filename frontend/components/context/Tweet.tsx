import Axios, { CancelToken } from 'axios';
import qs from 'query-string';
import React, { Reducer, useReducer } from 'react';

import { Tweet } from '../../../@types/tweet';
import { TWEETS_URL } from '../../constants';

export type TweetFetchType = {
  tag: string;
  lastTimestamp: number;
  cancelToken: CancelToken;
};

export interface ITweetContext {
  loading: boolean;
  error: {
    error: boolean;
    message: string;
  };
  tweets: Tweet[];
  tag: any;
  dispatch?: any;
  fetchTweets?: (param?: Partial<TweetFetchType>) => Promise<void>;
  seterror?: (message: string) => void;
  setloading?: (condition: boolean) => void;
}

export const initialTweetContext = {
  loading: false,
  error: {
    error: false,
    message: '',
  },
  tweets: [],
  tag: null,
  fetchTweets: null,
  setloading: null,
  seterror: null,
  dispatch: () => {},
};

// tweetContext
export const TweetContext = React.createContext<ITweetContext>(initialTweetContext);

// tweet use context
export const useTweetContext = () => React.useContext(TweetContext);

/**
 * actions
 */
export const FETCH_INITIAL_TWEETS = 'FETCH_INITIAL_TWEETS';
export const FETCH_PAGINATION_TWEETS = 'FETCH_PAGINATION_TWEETS';
export const FETCHING_TWEETS = 'FETCHING_TWEETS';
export const FETCHING_TWEETS_FAILED = 'FETCHING_TWEETS_FAILED';

// reducer
export const TweetReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INITIAL_TWEETS':
      return {
        ...state,
        loading: false,
        error: {
          error: false,
          message: null,
        },
        tweets: action.tweets,
      };

    case 'FETCH_PAGINATION_TWEETS':
      return {
        ...state,
        loading: false,
        error: {
          error: false,
          message: null,
        },
        tweets: [...state.tweets, ...action.tweets],
      };

    case 'FETCHING_TWEETS':
      return {
        ...state,
        loading: true,
        error: {
          error: false,
          message: null,
        },
      };

    case 'FETCHING_TWEETS_FAILED':
      return {
        ...state,
        loading: false,
        error: {
          error: true,
          message: action.error.message,
        },
      };

    default:
      return state;
  }
};

/**
 *
 * @param param0 provider
 */
export const TweetProvider = ({ children }) => {
  const [state, dispatch] = useReducer<Reducer<ITweetContext, any>>(
    TweetReducer,
    initialTweetContext,
    undefined
  );

  const setloading = (condition: boolean) =>
    dispatch({ type: FETCHING_TWEETS, loading: condition });

  const seterror = (message: string) =>
    dispatch({
      type: FETCHING_TWEETS_FAILED,
      error: {
        message,
      },
    });

  const setTweets = React.useCallback(
    (tweets: Tweet[], type?: typeof FETCH_INITIAL_TWEETS | typeof FETCH_PAGINATION_TWEETS) =>
      dispatch({
        type: type || FETCH_INITIAL_TWEETS,
        tweets,
      }),
    []
  );

  /**
   *
   * @param param0
   */
  const fetchTweets = React.useCallback(async (param: Partial<TweetFetchType>) => {
    try {
      setloading(true);
      let reformUrl = null;
      const urlObject: Partial<{ tag: string; cursor: number }> = {};

      if (param?.tag) urlObject.tag = param.tag;
      if (param?.lastTimestamp) urlObject.cursor = param.lastTimestamp;

      reformUrl = `${TWEETS_URL}?${qs.stringify(urlObject)}`; // stringify query params

      const result = await Axios.get(reformUrl, { cancelToken: param?.cancelToken });

      if (!result?.data?.error && result.data?.data?.tweets) {
        const tweets = result.data?.data?.tweets;

        setTweets(tweets, param?.lastTimestamp ? FETCH_PAGINATION_TWEETS : FETCH_INITIAL_TWEETS);
        return Promise.resolve(tweets);
      } else {
        seterror(result?.data?.error);
      }
    } catch (error) {
      seterror(error?.message as string);
    }
  }, []);

  return (
    <TweetContext.Provider value={{ ...state, dispatch, fetchTweets, seterror, setloading }}>
      {children}
    </TweetContext.Provider>
  );
};

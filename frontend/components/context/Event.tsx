import Axios, { CancelToken } from 'axios';
import qs from 'query-string';
import React, { Reducer, useReducer } from 'react';

import { ENDPOINT } from '../../constants';
import { CLEventGroup } from '../../../@types/events';

export type FetchType = {
  event: string;
  lastTime: number;
  cancelToken: CancelToken;
};

export interface IEventContext {
  loading: boolean;
  error: {
    error: boolean;
    message: string;
  };
  events: CLEventGroup[];
  event: any;
  dispatch?: any;
  fetchEvents?: (param?: Partial<FetchType>) => Promise<void>;
  seterror?: (message: string) => void;
  setloading?: (condition: boolean) => void;
}

export const initialEventsContext = {
  loading: false,
  error: {
    error: false,
    message: '',
  },
  events: [],
  event: null,
  fetchEvents: null,
  setloading: null,
  seterror: null,
  dispatch: () => {},
};

//  events Context
export const EventContext = React.createContext<IEventContext>(initialEventsContext);

// events use context
export const useEventContext = () => React.useContext(EventContext);

/**
 * actions
 */
export const FETCH_INITIAL_EVENTS = 'FETCH_INITIAL_EVENTS';
export const FETCH_PAGINATION_EVENTS = 'FETCH_PAGINATION_EVENTS';
export const FETCHING_EVENTS = 'FETCHING_EVENTS';
export const FETCHING_EVENTS_FAILED = 'FETCHING_EVENTS_FAILED';

// reducer
export const EventsReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INITIAL_EVENTS':
      return {
        ...state,
        loading: false,
        error: {
          error: false,
          message: null,
        },
        tweets: action.events,
      };

    case 'FETCH_PAGINATION_EVENTS':
      return {
        ...state,
        loading: false,
        error: {
          error: false,
          message: null,
        },
        tweets: [...state.events, ...action.events],
      };

    case 'FETCHING_EVENTS':
      return {
        ...state,
        loading: true,
        error: {
          error: false,
          message: null,
        },
      };

    case 'FETCHING_EVENTS_FAILED':
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
  const [state, dispatch] = useReducer<Reducer<IEventContext, any>>(
    EventsReducer,
    initialEventsContext,
    undefined
  );

  const setloading = (condition: boolean) =>
    dispatch({ type: FETCHING_EVENTS, loading: condition });

  const seterror = (message: string) =>
    dispatch({
      type: FETCHING_EVENTS_FAILED,
      error: {
        message,
      },
    });

  const setEvents = React.useCallback(
    (events: Event[], type?: typeof FETCH_INITIAL_EVENTS | typeof FETCH_PAGINATION_EVENTS) =>
      dispatch({
        type: type || FETCH_INITIAL_EVENTS,
        events,
      }),
    []
  );

  /**
   *
   * @param param0
   */
  const fetchEvents = React.useCallback(async (param: Partial<FetchType>) => {
    try {
      setloading(true);
      let reformUrl = null;
      const urlObject: Partial<{ tag: string; cursor: number }> = {};

      if (param?.event) urlObject.tag = param.event;
      if (param?.lastTime) urlObject.cursor = param.lastTime;

      reformUrl = `${ENDPOINT}?${qs.stringify(urlObject)}`; // stringify query params

      const result = await Axios.get(reformUrl, { cancelToken: param?.cancelToken });

      if (!result?.data?.error && result.data?.data) {
        const events = result.data?.data;

        setEvents(events, param?.lastTime ? FETCH_PAGINATION_EVENTS : FETCH_INITIAL_EVENTS);
        return Promise.resolve(events);
      } else {
        seterror(result?.data?.error);
      }
    } catch (error) {
      seterror(error?.message as string);
    }
  }, []);

  return (
    <EventContext.Provider value={{ ...state, dispatch, fetchEvents, seterror, setloading }}>
      {children}
    </EventContext.Provider>
  );
};

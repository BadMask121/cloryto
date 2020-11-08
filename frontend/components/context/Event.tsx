import Axios, { CancelToken } from 'axios';
import { orderBy, uniqBy } from 'lodash';
import qs from 'query-string';
import React, { Reducer, useReducer } from 'react';

import { CLEventGroup } from '../../../@types/events';
import { ENDPOINT } from '../../constants';

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
      const events = orderBy(action.events, ['timestamp'], 'desc');
      return {
        ...state,
        loading: false,
        error: {
          error: false,
          message: null,
        },
        events,
      };

    case 'FETCH_PAGINATION_EVENTS':
      const mergedEvents = [...state.events, ...action.events]; //merge current pagination data to old state
      let uniqueEvents = uniqBy(mergedEvents, 'id'); //remove duplicates

      return {
        ...state,
        loading: false,
        error: {
          error: false,
          message: null,
        },
        events: uniqueEvents,
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
export const EventsProvider = ({ children }) => {
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
      // set loading to true
      setloading(true);

      let reformUrl = null;

      const urlObject: Partial<{ event: string; lastTime: number }> = {};

      // add query parameters when need for the request
      if (param?.event) urlObject.event = param.event;
      if (param?.lastTime) urlObject.lastTime = param.lastTime;

      reformUrl = `${ENDPOINT}?${qs.stringify(urlObject)}`; // stringify query params

      const result = await Axios.get(reformUrl, { cancelToken: param?.cancelToken });

      if (Array.isArray(result.data?.data)) {
        const events = result.data?.data;

        setloading(false);
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

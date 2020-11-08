import 'pure-react-carousel/dist/react-carousel.es.css';

import { ChakraProvider, Switch, Text } from '@chakra-ui/core';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';

import { TweetProvider, useTweetContext } from '../components/context/Tweet';
import { MediaContainer } from '../components/media';
import ToggleSwitch from '../components/switch/switch';
import Tags from '../components/tags/tags';
import { GlobalStyles } from '../theme/global';
import { darkTheme, lightTheme } from '../theme/theme';
import { useRouter } from 'next/dist/client/router';

const TagName = [
  {
    id: 1,
    name: 'EndSars',
  },
  {
    id: 2,
    name: 'EndSarsProtest',
  },
  {
    id: 3,
    name: 'EndSarsNow',
  },
  {
    id: 4,
    name: 'EndSarsProtests',
  },
  {
    id: 5,
    name: 'EndSarsImmediately',
  },
  {
    id: 6,
    name: 'EndSARS',
  },
  {
    id: 7,
    name: 'EndPoliceBrutality',
  },
];

const TagWrapper = () => {
  const { fetchTweets } = useTweetContext();
  const { replace, pathname } = useRouter();
  return (
    <div className='container-tagWrapper'>
      {TagName.map(({ id, name }) => {
        return (
          <Tags
            key={id}
            tagName={name}
            onClick={() => {
              replace(`/${name}`);
              fetchTweets({ tag: name.replace('#', '') });
            }}
          />
        );
      })}
    </div>
  );
};
export default function Home() {
  const [theme, setTheme] = useState('light');

  const setMode = (mode: string) => {
    window.localStorage.setItem('theme', mode);
    setTheme(mode);
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setMode('dark');
    } else {
      setMode('light');
    }
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme');
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !localTheme
      ? setMode('dark')
      : localTheme
      ? setTheme(localTheme)
      : setMode('light');
  }, []);

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <ChakraProvider resetCSS>
        <TweetProvider>
          <GlobalStyles />

          <div className='switchWrapper'>
            <ToggleSwitch switchHandler={toggleTheme} />
          </div>

          <div className='container'>
            <Head>
              <title>End SARS Journey #ENDSARS</title>
              <link rel='icon' href='/favicon.ico' />
            </Head>
            <Text className='title'>End Sars, The Journey!!!</Text>

            <TagWrapper />
            <div className='container-mediaWrapper'>
              <MediaContainer />
            </div>
          </div>
        </TweetProvider>
      </ChakraProvider>
    </ThemeProvider>
  );
}

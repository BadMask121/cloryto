import 'pure-react-carousel/dist/react-carousel.es.css';

import { Box, ChakraProvider, Text } from '@chakra-ui/core';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';

import { TweetProvider, useEventContext } from '../components/context/Event';
import ListEvent from '../components/ListEvent';
import ToggleSwitch from '../components/switch/switch';
import Tags from '../components/tags/tags';
import { GlobalStyles } from '../theme/global';
import { darkTheme, lightTheme } from '../theme/theme';

const TagName = [
  {
    id: 1,
    label: 'Role Set',
    event: 'roleSet',
  },
  {
    id: 2,
    label: 'Initialised',
    event: 'initialised',
  },
  {
    id: 3,
    label: 'Payout Claimed',
    event: 'payments',
  },
  {
    id: 4,
    label: 'Domain Added',
    event: 'domainAdded',
  },
];

const TagWrapper = () => {
  const { fetchEvents } = useEventContext();
  const { replace } = useRouter();
  return (
    <div className='container-tagWrapper'>
      {TagName.map(({ id, label, event }) => {
        return (
          <Tags
            key={id}
            tagName={label}
            onClick={() => {
              replace(`/${event}`);
              fetchEvents({ event });
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
        <Head>
          <title>Cloryto Eth Reader</title>
          <link rel='icon' href='/favicon.ico' />
          <link
            href='https://fonts.googleapis.com/css2?family=Mulish:wght@200;300;400;500;600&display=swap'
            rel='stylesheet'
          ></link>
        </Head>
        <TweetProvider>
          <GlobalStyles />

          <Box className='switchWrapper'>
            <ToggleSwitch switchHandler={toggleTheme} />
          </Box>

          <Text
            className='title'
            textAlign='center'
            fontSize='30px'
            fontWeight={600}
            paddingBottom='20px'
          >
            Cloryto Ethe EventLoger
          </Text>
          <ListEvent />
        </TweetProvider>
      </ChakraProvider>
    </ThemeProvider>
  );
}

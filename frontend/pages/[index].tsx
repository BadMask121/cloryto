import 'pure-react-carousel/dist/react-carousel.es.css';

import { Box, ChakraProvider } from '@chakra-ui/core';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';

import { EventsProvider } from '../components/context/Event';
import ListEvent from '../components/listevent';
import Item from '../components/listevent/Item';
import ToggleSwitch from '../components/switch/switch';
import TagWrapper from '../components/tagwrapper';
import { GlobalStyles } from '../theme/global';
import { darkTheme, lightTheme } from '../theme/theme';

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
        <EventsProvider>
          <GlobalStyles />

          <Box className='switchWrapper'>
            <ToggleSwitch switchHandler={toggleTheme} />
          </Box>

          <Box
            className='title'
            textAlign='center'
            fontSize='30px'
            fontWeight={600}
            paddingBottom='20px'
          >
            Cloryto Ethereum Transaction Logger
            <TagWrapper />
          </Box>
          <ListEvent />
        </EventsProvider>
      </ChakraProvider>
    </ThemeProvider>
  );
}

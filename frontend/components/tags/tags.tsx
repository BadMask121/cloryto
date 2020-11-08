import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/core';

interface TagProps extends ButtonProps {
  tagName: string;
}
const Tags = ({ tagName, ...props }: TagProps) => {
  return (
    <Button aria-label={tagName} as='button' className='tags' {...props}>
      {tagName}
    </Button>
  );
};

export default Tags;

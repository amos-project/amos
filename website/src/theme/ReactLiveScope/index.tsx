import React from 'react';
import * as Amos from 'amos';
import * as AmosReact from 'amos/react';

const require = (m: string) => {
  return {
    'amos': Amos,
    'amos/react': AmosReact,
  }[m]
}

// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...Amos,
  ...AmosReact,
  require,
};

export default ReactLiveScope;

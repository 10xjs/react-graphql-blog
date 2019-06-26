const color = {
  red: '#F00',
  blue: '#00F',
  black: '#000',
  white: '#FFF',
};

interface Theme {
  color: typeof color;
}

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

export const theme: Theme = {
  color,
};

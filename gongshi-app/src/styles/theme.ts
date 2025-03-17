import { DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  colors: {
    primary: '#4a89dc',
    secondary: '#f0f7ff',
    accent: '#ff9500',
    background: '#f9f9f9',
    border: '#eeeeee',
    white: '#ffffff',
    text: {
      primary: '#333333',
      secondary: '#666666',
      light: '#999999',
    },
    status: {
      success: '#4cd964',
      warning: '#ff9500',
      error: '#ff3b30',
      info: '#4a89dc',
    },
    accuracy: {
      high: '#4cd964',
      medium: '#ff9500',
      low: '#ff3b30',
    }
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
  },
  fontSizes: {
    small: '12px',
    medium: '14px',
    large: '16px',
    xlarge: '18px',
  },
  spacing: {
    xs: '5px',
    sm: '10px',
    md: '15px',
    lg: '20px',
    xl: '30px',
  },
  borderRadius: {
    small: '4px',
    medium: '6px',
    large: '8px',
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.12)',
    large: '0 8px 16px rgba(0, 0, 0, 0.14)',
  },
  mediaQueries: {
    mobile: '@media screen and (max-width: 480px)',
    tablet: '@media screen and (max-width: 768px)',
    desktop: '@media screen and (min-width: 1024px)',
  },
};

export default theme; 
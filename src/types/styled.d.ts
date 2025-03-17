import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      border: string;
      text: {
        primary: string;
        secondary: string;
      };
      status: {
        success: string;
        warning: string;
        error: string;
        info: string;
      };
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
    fontSizes: {
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  }
} 
/// <reference types="react-scripts" />

// 添加缺失模块的类型声明
declare module 'react';
declare module 'react-dom/client';
declare module 'react-router-dom';
declare module 'styled-components';
declare module '@fortawesome/react-fontawesome';
declare module '@fortawesome/free-solid-svg-icons';
declare module '@fortawesome/free-regular-svg-icons';
declare module '@fortawesome/fontawesome-svg-core';

// 声明模块
declare module 'react' {
  export interface FunctionComponent<P = {}> {
    (props: P, context?: any): React.ReactElement<any, any> | null;
  }
  export type FC<P = {}> = FunctionComponent<P>;
}

// 声明styled-components模块
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
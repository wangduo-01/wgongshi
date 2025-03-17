import { DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  colors: {
    primary: '#4a89dc',         // 主色调
    secondary: '#e8f1fc',       // 次要色调
    accent: '#ff9500',          // 强调色
    background: '#f5f6fa',      // 背景色
    border: '#e1e5eb',          // 边框颜色
    white: '#ffffff',           // 白色
    text: {
      primary: '#333333',       // 主要文本颜色
      secondary: '#666666',     // 次要文本颜色
      light: '#999999',         // 浅色文本
    },
    status: {
      success: '#4cd964',        // 成功状态颜色
      warning: '#ffcc00',        // 警告状态颜色
      error: '#ff3b30',          // 错误状态颜色
      info: '#34aadc'           // 信息状态颜色
    },
    accuracy: {
      high: '#4cd964',          // 高准确率颜色
      medium: '#ffcc00',        // 中等准确率颜色
      low: '#ff3b30',           // 低准确率颜色
    }
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px'
  },
  fontSizes: {
    small: '12px',
    medium: '14px',
    large: '16px',
    xlarge: '18px'
  },
  spacing: {
    xs: '5px',
    sm: '10px',
    md: '15px',
    lg: '20px',
    xl: '30px'
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px'
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
    large: '0 8px 16px rgba(0, 0, 0, 0.1)'
  }
};

export default theme; 
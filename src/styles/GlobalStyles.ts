import { createGlobalStyle } from 'styled-components';

// 全局样式定义
const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  }
  
  body {
    background-color: #f5f5f5;
    padding: 20px;
    min-height: 100vh;
  }
  
  /* 响应式布局断点 */
  @media (max-width: 768px) {
    body {
      padding: 10px;
    }
  }
  
  /* 为移动设备优化 */
  @media (max-width: 480px) {
    body {
      padding: 5px;
    }
  }
`;

export default GlobalStyles; 
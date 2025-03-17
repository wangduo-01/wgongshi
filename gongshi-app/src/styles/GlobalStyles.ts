import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  }
  
  body {
    background-color: #f5f6fa;
    color: ${props => props.theme.colors.text.primary};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    position: relative;
    height: 100%;
  }
  
  html {
    height: 100%;
    font-size: 16px;
  }
  
  a {
    text-decoration: none;
    color: ${props => props.theme.colors.primary};
  }
  
  button {
    background: none;
    border: none;
    font-family: inherit;
    cursor: pointer;
    outline: none;
    transition: all 0.2s;
  }
  
  input, button, textarea, select {
    font: inherit;
    color: inherit;
    outline: none;
  }
  
  #root {
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;
    min-height: 100vh;
    background-color: #fff;
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
  }
  
  .app-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
  }
  
  @media screen and (max-width: 1300px) {
    #root {
      max-width: 100%;
      box-shadow: none;
    }
  }
  
  /* 自定义滚动条样式 */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #bbb;
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #999;
  }
  
  /* 添加特定于平板的样式 */
  @media screen and (min-width: 768px) and (max-width: 1280px) {
    body {
      overflow: auto;
    }
    
    #root {
      min-height: 800px;
      height: 100vh;
    }
    
    .app-container {
      overflow-y: auto;
    }
  }
`;

export default GlobalStyles; 
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';

// 页面组件
import HomePage from './components/pages/HomePage';
import FormulaDetailPage from './components/pages/FormulaDetailPage';
import PracticePage from './components/pages/PracticePage';
import PracticeResultPage from './components/pages/PracticeResultPage';
import AnalysisPage from './components/pages/AnalysisPage';
import FavoritePage from './components/pages/FavoritePage';
import ErrorBookPage from './components/pages/ErrorBookPage';
import RecordPage from './components/pages/RecordPage';
import SearchPage from './components/pages/SearchPage';
import PrintPage from './components/pages/PrintPage';

/**
 * 应用程序主入口组件
 * 
 * 包含全局样式、主题提供者和路由配置
 */
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/formula/:id" element={<FormulaDetailPage />} />
          <Route path="/practice/:type" element={<PracticePage />} />
          <Route path="/result/:id" element={<PracticeResultPage />} />
          <Route path="/analysis/:id" element={<AnalysisPage />} />
          <Route path="/favorites" element={<FavoritePage />} />
          <Route path="/errorbook" element={<ErrorBookPage />} />
          <Route path="/records" element={<RecordPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/print" element={<PrintPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App; 
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';
import HomePage from './components/pages/HomePage';
import FormulaDetailPage from './components/pages/FormulaDetailPage';
import PracticePage from './components/pages/PracticePage';
import PracticeResultPage from './components/pages/PracticeResultPage';
import AnalysisPage from './components/pages/AnalysisPage';
import RecordPage from './components/pages/RecordPage';
import ErrorBookPage from './components/pages/ErrorBookPage';
import FavoritesPage from './components/pages/FavoritesPage';
import SearchPage from './components/pages/SearchPage';
import SearchResultsPage from './components/pages/SearchResultsPage';
import Modal from './components/common/Modal';

function App() {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };
  
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/formula/:id" element={<FormulaDetailPage />} />
            <Route path="/practice/:id" element={<PracticePage />} />
            <Route path="/practice-result/:id" element={<PracticeResultPage />} />
            <Route path="/analysis/:id" element={<AnalysisPage />} />
            <Route path="/record" element={<RecordPage />} />
            <Route path="/error-book" element={<ErrorBookPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/search-results" element={<SearchResultsPage />} />
          </Routes>
          
          <Modal isOpen={alertVisible} onClose={hideAlert} title="提示">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              {alertMessage}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button 
                style={{ 
                  backgroundColor: theme.colors.primary, 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  padding: '8px 16px', 
                  cursor: 'pointer' 
                }} 
                onClick={hideAlert}
              >
                确定
              </button>
            </div>
          </Modal>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

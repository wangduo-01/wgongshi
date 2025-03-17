import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

// 动画
const fadeIn = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const slideUp = `
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

// 样式组件
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  background-color: ${props => props.theme.colors.white};
  padding: 20px 40px;
  min-height: 100vh;
  ${fadeIn}
  animation: fadeIn 0.3s ease-in-out;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
`;

const BackButton = styled.div`
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(74, 137, 220, 0.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin: 0;
  font-weight: 600;
`;

const Content = styled.div`
  ${slideUp}
  animation: slideUp 0.4s ease-out;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 40px 20px;
`;

const NoResultsIcon = styled.div`
  font-size: 80px;
  color: #e0e6f0;
  margin-bottom: 30px;
  
  i {
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
`;

const NoResultsTitle = styled.h2`
  font-size: 28px;
  color: #4a5568;
  margin-bottom: 16px;
  font-weight: 600;
`;

const NoResultsText = styled.p`
  font-size: 16px;
  color: #718096;
  line-height: 1.6;
  margin-bottom: 30px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SuggestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  background-color: #f8fafc;
  padding: 25px;
  border-radius: 12px;
`;

const SuggestionsTitle = styled.h3`
  font-size: 18px;
  color: #4a5568;
  margin-bottom: 20px;
  font-weight: 600;
`;

const SuggestionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  max-width: 600px;
`;

const SuggestionTag = styled.div`
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  color: #4a89dc;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  &:hover {
    background-color: #f0f5ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(74, 137, 220, 0.1);
  }
`;

const ActionButton = styled.button`
  background-color: #4a89dc;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(74, 137, 220, 0.2);
  margin-top: 30px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: #3a6cad;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(74, 137, 220, 0.25);
  }
  
  i {
    font-size: 18px;
  }
`;

// 建议的搜索词 - 根据学段推荐不同的搜索词
const SUGGESTIONS = {
  '小学': ['周长公式', '圆的面积', '三角形面积', '速度公式', '密度公式'],
  '初中': ['勾股定理', '平行四边形面积', '梯形面积', '牛顿第二定律', '功公式'],
  '高中': ['一元二次方程', '余弦定理', '电磁感应定律', '质能方程', '向量']
};

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 获取搜索词
  const searchTerm = location.state?.searchTerm || '';
  // 从localStorage获取当前用户学段
  const currentGrade = localStorage.getItem('currentGrade') || '小学';
  
  // 根据当前学段获取推荐
  const suggestions = SUGGESTIONS[currentGrade as keyof typeof SUGGESTIONS] || SUGGESTIONS['小学'];
  
  const handleBack = () => {
    navigate('/search');
  };
  
  const handleSuggestionClick = (term: string) => {
    navigate('/search', { state: { suggestedTerm: term } });
  };
  
  const handleReturnHome = () => {
    navigate('/');
  };
  
  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>
          <i className="fas fa-arrow-left"></i>
        </BackButton>
        <Title>搜索结果</Title>
      </Header>
      
      <Content>
        <NoResultsIcon>
          <i className="fas fa-search"></i>
        </NoResultsIcon>
        
        <NoResultsTitle>未找到"{searchTerm}"相关结果</NoResultsTitle>
        
        <NoResultsText>
          抱歉，我们没有找到与您搜索的内容相关的公式。请尝试使用不同的关键词，或者浏览以下热门公式。
        </NoResultsText>
        
        <SuggestionsContainer>
          <SuggestionsTitle>您可能感兴趣的公式</SuggestionsTitle>
          <SuggestionsList>
            {suggestions.map((term, index) => (
              <SuggestionTag 
                key={index}
                onClick={() => handleSuggestionClick(term)}
              >
                {term}
              </SuggestionTag>
            ))}
          </SuggestionsList>
        </SuggestionsContainer>
        
        <ActionButton onClick={handleReturnHome}>
          <i className="fas fa-home"></i>
          返回首页
        </ActionButton>
      </Content>
    </Container>
  );
};

export default SearchResultsPage; 
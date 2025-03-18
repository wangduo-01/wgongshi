import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import PrintComponent from '../common/PrintComponent';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  background-color: ${props => props.theme.colors.white};
  min-height: 100vh;
  padding: 20px 30px;
`;

const PageHeader = styled.div`
  background-color: #4a89dc;
  color: white;
  padding: 15px 0;
  text-align: center;
  position: relative;
  margin: -20px -30px 20px -30px;
`;

const HeaderText = styled.div`
  font-size: 18px;
  font-weight: 500;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

const FormulaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-top: 20px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormulaCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  position: relative;
  border: 1px solid #eee;
  height: auto;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  }
`;

const FormulaTitle = styled.div`
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
`;

const FormulaContent = styled.div`
  font-size: 28px;
  color: #000;
  text-align: center;
  margin: 20px 0;
  font-family: 'Times New Roman', Times, serif;
`;

interface AccuracyBadgeProps {
  accuracy: number;
}

const AccuracyBadge = styled.div<AccuracyBadgeProps>`
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
  border-radius: 15px;
  padding: 3px 10px;
  font-size: 14px;
  background-color: ${props => {
    if (props.accuracy >= 80) return '#4cd964';
    if (props.accuracy >= 50) return '#ff9500';
    return '#ff3b30';
  }};
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 22px;
  color: #666;
  transition: color 0.2s;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #999;
  
  i {
    font-size: 60px;
    margin-bottom: 20px;
    color: #ddd;
  }
  
  div {
    font-size: 16px;
  }
`;

// 模拟收藏数据
const SAMPLE_FAVORITES = [
  {
    id: '1',
    title: '周长公式',
    content: 'C = 2πr',
    accuracy: 90,
  },
  {
    id: '2',
    title: '面积公式',
    content: 'S = πr²',
    accuracy: 65,
  },
  {
    id: '3',
    title: '体积公式',
    content: 'V = πr²h',
    accuracy: 25,
  },
  {
    id: '4',
    title: '勾股定理',
    content: 'a² + b² = c²',
    accuracy: 70,
  },
  {
    id: '5',
    title: '三角形面积',
    content: 'S = ½ah',
    accuracy: 85,
  },
  {
    id: '6',
    title: '长方形面积',
    content: 'S = ab',
    accuracy: 95,
  },
];

// 收藏页面组件
const FavoritesPage = () => {
  const navigate = useNavigate();
  
  // 处理返回按钮点击
  const handleBack = () => {
    navigate('/');
  };
  
  const handleFormulaClick = (id: string) => {
    navigate(`/formula/${id}`);
  };
  
  const handleFavoriteToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // 在实际应用中，这里应该调用取消收藏的函数
    console.log('取消收藏', id);
  };
  
  const handlePracticeClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/practice/${id}`);
  };
  
  const handlePrintClick = () => {
    navigate('/print');
  };
  
  return (
    <Container>
      <PageHeader>
        <HeaderText>我的收藏</HeaderText>
      </PageHeader>
      
      <Header 
        title="我的收藏"
        showBackButton
        onBack={handleBack}
      />
      
      <Content>
        <Title>我收藏的公式</Title>
        
        {SAMPLE_FAVORITES.length > 0 ? (
          <>
            <PrintComponent 
              type="favorite" 
              buttonStyle="large" 
              beforePrint={handlePrintClick}
            />
            
            <FormulaGrid>
              {SAMPLE_FAVORITES.map(formula => (
                <FormulaCard 
                  key={formula.id}
                  onClick={() => handleFormulaClick(formula.id)}
                >
                  <AccuracyBadge accuracy={formula.accuracy}>{formula.accuracy}%</AccuracyBadge>
                  <FormulaTitle>{formula.title}</FormulaTitle>
                  <FormulaContent>{formula.content}</FormulaContent>
                  <CardFooter>
                    <ActionButton 
                      onClick={(e) => handleFavoriteToggle(e, formula.id)}
                    >
                      <i className="fas fa-star" style={{ color: '#ff9500' }} />
                    </ActionButton>
                    <ActionButton 
                      onClick={(e) => handlePracticeClick(e, formula.id)}
                    >
                      <i className="fas fa-edit" />
                    </ActionButton>
                  </CardFooter>
                </FormulaCard>
              ))}
            </FormulaGrid>
          </>
        ) : (
          <EmptyState>
            <i className="far fa-star"></i>
            <div>暂无收藏公式</div>
          </EmptyState>
        )}
      </Content>
    </Container>
  );
};

export default FavoritesPage; 
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';

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

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
`;

interface TabProps {
  active: boolean;
}

const Tab = styled.div<TabProps>`
  padding: 12px 20px;
  font-size: 16px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  color: ${props => props.active ? props.theme.colors.primary : '#666'};
  border-bottom: ${props => props.active ? `2px solid ${props.theme.colors.primary}` : 'none'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
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

// 模拟错题本数据
const SAMPLE_ERRORS = [
  {
    id: '1',
    title: '周长公式',
    content: 'C = 2πr',
    accuracy: 45,
  },
  {
    id: '2',
    title: '面积公式',
    content: 'S = πr²',
    accuracy: 25,
  },
  {
    id: '3',
    title: '体积公式',
    content: 'V = πr²h',
    accuracy: 30,
  },
  {
    id: '4',
    title: '勾股定理',
    content: 'a² + b² = c²',
    accuracy: 40,
  },
];

// 错题本页面组件
const ErrorBookPage = () => {
  const navigate = useNavigate();
  
  // 处理返回按钮点击
  const handleBack = () => {
    navigate('/');
  };
  
  const [activeTab, setActiveTab] = React.useState<'today' | 'week' | 'month' | 'all'>('today');
  
  const handleFormulaClick = (id: string) => {
    navigate(`/formula/${id}`);
  };
  
  const handleFavoriteToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    console.log('收藏/取消收藏', id);
  };
  
  const handlePracticeClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/practice/${id}`);
  };
  
  return (
    <Container>
      <PageHeader>
        <HeaderText>错题本</HeaderText>
      </PageHeader>
      
      <Header 
        title="错题本"
        showBackButton
        onBack={handleBack}
      />
      
      <Content>
        <Title>我的错题</Title>
        
        <TabContainer>
          <Tab 
            active={activeTab === 'today'}
            onClick={() => setActiveTab('today')}
          >
            今天
          </Tab>
          <Tab 
            active={activeTab === 'week'}
            onClick={() => setActiveTab('week')}
          >
            本周
          </Tab>
          <Tab 
            active={activeTab === 'month'}
            onClick={() => setActiveTab('month')}
          >
            本月
          </Tab>
          <Tab 
            active={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
          >
            全部
          </Tab>
        </TabContainer>
        
        {SAMPLE_ERRORS.length > 0 ? (
          <FormulaGrid>
            {SAMPLE_ERRORS.map(formula => (
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
                    <i className="far fa-star" />
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
        ) : (
          <EmptyState>
            <i className="fas fa-book"></i>
            <div>暂无错题记录</div>
          </EmptyState>
        )}
      </Content>
    </Container>
  );
};

export default ErrorBookPage; 
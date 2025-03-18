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
  padding: 0;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 15px 0;
  background-color: #4a89dc;
  border-bottom: 1px solid #eee;
`;

const HeaderText = styled.h2`
  font-size: 22px;
  color: white;
  font-weight: 600;
  margin: 0;
  text-align: center;
`;

const BackButton = styled.button`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.1);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px 30px 40px; /* 增加底部内边距，避免与底部重叠 */
  overflow-y: auto;
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

const StatsContainer = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #eee;
  flex: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 15px;
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${props => props.theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  font-size: 22px;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const StatValue = styled.div`
  font-size: 32px;
  color: #333;
  font-weight: bold;
`;

const StatLabel = styled.div`
  font-size: 16px;
  color: #666;
`;

const RecordGrid = styled.div`
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

const RecordCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  position: relative;
  border: 1px solid #eee;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  }
`;

const RecordDate = styled.div`
  color: #999;
  font-size: 14px;
  margin-bottom: 15px;
`;

const RecordTitle = styled.div`
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 500;
`;

const RecordSummary = styled.div`
  margin: 15px 0;
  font-size: 16px;
  color: #555;
`;

const RecordFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
`;

const AccuracyText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface AccuracyProps {
  value: number;
}

const AccuracyDot = styled.div<AccuracyProps>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => {
    if (props.value >= 80) return '#4cd964';
    if (props.value >= 50) return '#ff9500';
    return '#ff3b30';
  }};
`;

const ViewButton = styled.div`
  padding: 8px 16px;
  background-color: #f2f2f7;
  color: #4a4a4a;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e5e5ea;
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

// 模拟练习记录数据
const SAMPLE_RECORDS = [
  {
    id: '1',
    title: '圆周率公式练习',
    date: '2023-10-15',
    questionsCount: 10,
    accuracy: 90,
    timeSpent: '10分钟',
  },
  {
    id: '2',
    title: '面积公式练习',
    date: '2023-10-12',
    questionsCount: 8,
    accuracy: 75,
    timeSpent: '8分钟',
  },
  {
    id: '3',
    title: '体积公式练习',
    date: '2023-10-10',
    questionsCount: 12,
    accuracy: 42,
    timeSpent: '15分钟',
  },
  {
    id: '4',
    title: '勾股定理练习',
    date: '2023-10-08',
    questionsCount: 5,
    accuracy: 60,
    timeSpent: '5分钟',
  },
  {
    id: '5',
    title: '多项式公式练习',
    date: '2023-10-05',
    questionsCount: 7,
    accuracy: 85,
    timeSpent: '7分钟',
  },
  {
    id: '6',
    title: '三角函数公式练习',
    date: '2023-10-03',
    questionsCount: 15,
    accuracy: 60,
    timeSpent: '20分钟',
  },
];

// 记录详情页组件
const RecordPage = () => {
  const navigate = useNavigate();
  
  // 处理返回按钮点击
  const handleBack = () => {
    navigate('/');
  };
  
  const [activeTab, setActiveTab] = React.useState<'week' | 'month' | 'year' | 'all'>('week');
  
  // 计算统计数据
  const totalPractices = SAMPLE_RECORDS.length;
  const totalQuestions = SAMPLE_RECORDS.reduce((sum, record) => sum + record.questionsCount, 0);
  const averageAccuracy = Math.round(
    SAMPLE_RECORDS.reduce((sum, record) => sum + record.accuracy, 0) / totalPractices
  );
  
  const handleRecordClick = (id: string) => {
    navigate(`/practice-result/${id}`);
  };
  
  return (
    <Container>
      <PageHeader>
        <BackButton onClick={handleBack}>
          <i className="fas fa-chevron-left"></i>
        </BackButton>
        <HeaderText>练习记录</HeaderText>
      </PageHeader>
      
      <Content>
        <Title>我的练习统计</Title>
        
        <StatsContainer>
          <StatCard>
            <StatIcon><i className="fas fa-calendar-alt"></i></StatIcon>
            <StatInfo>
              <StatValue>{totalPractices}</StatValue>
              <StatLabel>总练习次数</StatLabel>
            </StatInfo>
          </StatCard>
          
          <StatCard>
            <StatIcon><i className="fas fa-tasks"></i></StatIcon>
            <StatInfo>
              <StatValue>{totalQuestions}</StatValue>
              <StatLabel>总题目数量</StatLabel>
            </StatInfo>
          </StatCard>
          
          <StatCard>
            <StatIcon><i className="fas fa-chart-line"></i></StatIcon>
            <StatInfo>
              <StatValue>{averageAccuracy}%</StatValue>
              <StatLabel>平均正确率</StatLabel>
            </StatInfo>
          </StatCard>
        </StatsContainer>
        
        <Title>练习记录列表</Title>
        
        <TabContainer>
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
            active={activeTab === 'year'}
            onClick={() => setActiveTab('year')}
          >
            今年
          </Tab>
          <Tab 
            active={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
          >
            全部
          </Tab>
        </TabContainer>
        
        {SAMPLE_RECORDS.length > 0 ? (
          <RecordGrid>
            {SAMPLE_RECORDS.map(record => (
              <RecordCard 
                key={record.id}
                onClick={() => handleRecordClick(record.id)}
              >
                <RecordDate>{record.date}</RecordDate>
                <RecordTitle>{record.title}</RecordTitle>
                <RecordSummary>
                  完成 {record.questionsCount} 道题，用时 {record.timeSpent}
                </RecordSummary>
                <RecordFooter>
                  <AccuracyText>
                    <AccuracyDot value={record.accuracy} />
                    正确率 {record.accuracy}%
                  </AccuracyText>
                  <ViewButton>查看详情</ViewButton>
                </RecordFooter>
              </RecordCard>
            ))}
          </RecordGrid>
        ) : (
          <EmptyState>
            <i className="far fa-clipboard"></i>
            <div>暂无练习记录</div>
          </EmptyState>
        )}
      </Content>
    </Container>
  );
};

export default RecordPage; 
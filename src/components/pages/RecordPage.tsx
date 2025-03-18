import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHome, faCalendarAlt, faListAlt, faChartPie } from '@fortawesome/free-solid-svg-icons';
import Header from '../common/Header';

// 样式化组件
const RecordContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.medium};
  padding: 20px;
  min-height: 800px;
  height: calc(100vh - 40px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding-bottom: 15px;
  margin-bottom: 20px;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`;

const BackButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary}dd;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: ${props => props.theme.shadows.small};
`;

const StatIcon = styled.div`
  font-size: 20px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 10px;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: ${props => props.theme.colors.text.primary};
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
  margin-top: 5px;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 20px;
`;

const Tab = styled.div<{ active?: boolean }>`
  padding: 10px 20px;
  font-size: 14px;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text.secondary};
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const RecordListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  
  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
  }
`;

const RecordItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-radius: ${props => props.theme.borderRadius.small};
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: white;
  border: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.small};
    transform: translateY(-2px);
  }
`;

const RecordInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const RecordTitle = styled.div`
  font-size: 16px;
  color: ${props => props.theme.colors.text.primary};
  font-weight: 500;
`;

const RecordDate = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.text.light};
`;

const RecordDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const RecordStats = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
`;

interface AccuracyProps {
  value: number;
}

const RecordAccuracy = styled.div<AccuracyProps>`
  font-size: 15px;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 12px;
  background-color: ${props => {
    if (props.value >= 80) return `${props.theme.colors.accuracy.high}20`;
    if (props.value >= 50) return `${props.theme.colors.accuracy.medium}20`;
    return `${props.theme.colors.accuracy.low}20`;
  }};
  color: ${props => {
    if (props.value >= 80) return props.theme.colors.accuracy.high;
    if (props.value >= 50) return props.theme.colors.accuracy.medium;
    return props.theme.colors.accuracy.low;
  }};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 16px;
  text-align: center;
  padding: 20px;
`;

// 模拟记录数据
const PRACTICE_RECORDS = [
  {
    id: 'r1',
    title: '圆周率公式练习',
    date: '2023-10-15',
    accuracy: 90,
    questions: 10,
    duration: '10分钟',
  },
  {
    id: 'r2',
    title: '面积公式练习',
    date: '2023-10-12',
    accuracy: 75,
    questions: 8,
    duration: '8分钟',
  },
  {
    id: 'r3',
    title: '体积公式练习',
    date: '2023-10-10',
    accuracy: 42,
    questions: 12,
    duration: '15分钟',
  },
  {
    id: 'r4',
    title: '勾股定理练习',
    date: '2023-10-08',
    accuracy: 60,
    questions: 5,
    duration: '5分钟',
  },
  {
    id: 'r5',
    title: '多项式公式练习',
    date: '2023-10-05',
    accuracy: 86,
    questions: 7,
    duration: '7分钟',
  },
  {
    id: 'r6',
    title: '三角函数公式练习',
    date: '2023-10-03',
    accuracy: 65,
    questions: 15,
    duration: '20分钟',
  },
];

/**
 * RecordPage组件 - 做题记录页面
 * 
 * 功能：
 * - 展示用户的做题记录列表
 * - 支持点击查看详细记录
 * - 支持返回首页
 * - 显示练习统计信息
 */
const RecordPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 计算统计数据
  const totalPractices = PRACTICE_RECORDS.length;
  const totalQuestions = PRACTICE_RECORDS.reduce((sum, record) => sum + record.questions, 0);
  const averageAccuracy = Math.round(PRACTICE_RECORDS.reduce((sum, record) => sum + record.accuracy, 0) / totalPractices);
  
  // 处理记录点击
  const handleRecordClick = (recordId: string) => {
    // 在实际应用中，应该根据记录ID导航到详细信息页面
    navigate(`/analysis/${recordId}`);
  };
  
  // 处理返回按钮点击
  const handleBackClick = () => {
    navigate('/'); // 直接返回首页
  };
  
  // 选择当前活跃的标签
  const [activeTab, setActiveTab] = React.useState('week');
  
  return (
    <RecordContainer>
      <HeaderContainer>
        <PageTitle>练习记录</PageTitle>
        <BackButton onClick={handleBackClick}>
          <FontAwesomeIcon icon={faHome} /> 返回首页
        </BackButton>
      </HeaderContainer>
      
      <StatsContainer>
        <StatCard>
          <StatIcon>
            <FontAwesomeIcon icon={faCalendarAlt} />
          </StatIcon>
          <StatValue>{totalPractices}</StatValue>
          <StatLabel>总练习次数</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FontAwesomeIcon icon={faListAlt} />
          </StatIcon>
          <StatValue>{totalQuestions}</StatValue>
          <StatLabel>总题目数量</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FontAwesomeIcon icon={faChartPie} />
          </StatIcon>
          <StatValue>{averageAccuracy}%</StatValue>
          <StatLabel>平均正确率</StatLabel>
        </StatCard>
      </StatsContainer>
      
      <TabsContainer>
        <Tab active={activeTab === 'week'} onClick={() => setActiveTab('week')}>本周</Tab>
        <Tab active={activeTab === 'month'} onClick={() => setActiveTab('month')}>本月</Tab>
        <Tab active={activeTab === 'year'} onClick={() => setActiveTab('year')}>今年</Tab>
        <Tab active={activeTab === 'all'} onClick={() => setActiveTab('all')}>全部</Tab>
      </TabsContainer>
      
      <RecordListContainer>
        {PRACTICE_RECORDS.length > 0 ? (
          PRACTICE_RECORDS.map(record => (
            <RecordItem key={record.id} onClick={() => handleRecordClick(record.id)}>
              <RecordInfo>
                <RecordTitle>{record.title}</RecordTitle>
                <RecordDate>{record.date}</RecordDate>
              </RecordInfo>
              <RecordDetails>
                <RecordStats>
                  完成 {record.questions} 道题，用时 {record.duration}
                </RecordStats>
                <RecordAccuracy value={record.accuracy}>正确率 {record.accuracy}%</RecordAccuracy>
              </RecordDetails>
            </RecordItem>
          ))
        ) : (
          <EmptyState>
            <p>您还没有做题记录</p>
            <p>去练习一下，提高公式掌握度吧</p>
          </EmptyState>
        )}
      </RecordListContainer>
    </RecordContainer>
  );
};

export default RecordPage; 
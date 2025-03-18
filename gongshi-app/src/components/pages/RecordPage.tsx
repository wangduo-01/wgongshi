import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: #e5e5ea;
  }
  
  i {
    font-size: 12px;
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

// 模态框样式
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  margin: 0;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #999;
  
  &:hover {
    color: #333;
  }
`;

const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const DetailItem = styled.div`
  padding: 15px;
  border-radius: 8px;
  background-color: #f8f8f8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f2f2f2;
  }
`;

const DetailInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const DetailDate = styled.div`
  font-size: 14px;
  color: #999;
`;

const DetailAccuracy = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
`;

const ArrowIcon = styled.div`
  color: #ccc;
  font-size: 16px;
`;

interface PracticeRecord {
  id: string;
  formulaId: string;
  formulaTitle: string;
  date: string;
  questionsCount: number;
  accuracy: number;
  timeSpent: string;
  subject: 'math' | 'physics' | 'chemistry'; // 添加科目分类
}

interface AggregatedRecord {
  formulaId: string;
  formulaTitle: string;
  lastPracticeDate: string;
  totalPractices: number;
  avgAccuracy: number;
  lastAccuracy: number; // 添加最近一次练习的正确率
  subject: 'math' | 'physics' | 'chemistry';
  records: PracticeRecord[]; // 所有相关的练习记录
}

// 模拟练习记录数据，添加科目分类
const SAMPLE_RECORDS: PracticeRecord[] = [
  {
    id: '1',
    formulaId: 'f1',
    formulaTitle: '圆周率公式',
    date: '2023-10-15',
    questionsCount: 10,
    accuracy: 90,
    timeSpent: '10分钟',
    subject: 'math'
  },
  {
    id: '2',
    formulaId: 'f2',
    formulaTitle: '面积公式',
    date: '2023-10-12',
    questionsCount: 8,
    accuracy: 75,
    timeSpent: '8分钟',
    subject: 'math'
  },
  {
    id: '3',
    formulaId: 'f3',
    formulaTitle: '体积公式',
    date: '2023-10-10',
    questionsCount: 12,
    accuracy: 42,
    timeSpent: '15分钟',
    subject: 'math'
  },
  {
    id: '4',
    formulaId: 'f4',
    formulaTitle: '勾股定理',
    date: '2023-10-08',
    questionsCount: 5,
    accuracy: 60,
    timeSpent: '5分钟',
    subject: 'math'
  },
  {
    id: '5',
    formulaId: 'f1',
    formulaTitle: '圆周率公式',
    date: '2023-10-05',
    questionsCount: 7,
    accuracy: 85,
    timeSpent: '7分钟',
    subject: 'math'
  },
  {
    id: '6',
    formulaId: 'f4',
    formulaTitle: '勾股定理',
    date: '2023-10-03',
    questionsCount: 15,
    accuracy: 70,
    timeSpent: '20分钟',
    subject: 'math'
  },
  {
    id: '7',
    formulaId: 'p1',
    formulaTitle: '牛顿第二定律',
    date: '2023-10-14',
    questionsCount: 8,
    accuracy: 65,
    timeSpent: '12分钟',
    subject: 'physics'
  },
  {
    id: '8',
    formulaId: 'p2',
    formulaTitle: '动能定理',
    date: '2023-10-11',
    questionsCount: 6,
    accuracy: 80,
    timeSpent: '9分钟',
    subject: 'physics'
  },
  {
    id: '9',
    formulaId: 'c1',
    formulaTitle: '质量守恒定律',
    date: '2023-10-09',
    questionsCount: 10,
    accuracy: 75,
    timeSpent: '15分钟',
    subject: 'chemistry'
  }
];

// 聚合记录数据，将同一公式的多次练习聚合在一起
const aggregateRecords = (records: PracticeRecord[]): AggregatedRecord[] => {
  const formulaMap = new Map<string, PracticeRecord[]>();
  
  // 按公式ID分组记录
  records.forEach(record => {
    if (!formulaMap.has(record.formulaId)) {
      formulaMap.set(record.formulaId, []);
    }
    formulaMap.get(record.formulaId)!.push(record);
  });
  
  // 将分组数据转换为聚合记录
  const aggregated: AggregatedRecord[] = [];
  
  formulaMap.forEach((practiceRecords, formulaId) => {
    // 按日期降序排序
    const sortedRecords = [...practiceRecords].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const totalPractices = sortedRecords.length;
    const avgAccuracy = Math.round(
      sortedRecords.reduce((sum, r) => sum + r.accuracy, 0) / totalPractices
    );
    // 获取最近一次练习的正确率
    const lastAccuracy = sortedRecords[0].accuracy;
    
    aggregated.push({
      formulaId,
      formulaTitle: sortedRecords[0].formulaTitle,
      lastPracticeDate: sortedRecords[0].date,
      totalPractices,
      avgAccuracy,
      lastAccuracy,
      subject: sortedRecords[0].subject,
      records: sortedRecords
    });
  });
  
  // 按最近练习日期降序排序
  return aggregated.sort(
    (a, b) => new Date(b.lastPracticeDate).getTime() - new Date(a.lastPracticeDate).getTime()
  );
};

// 记录详情页组件
const RecordPage = () => {
  const navigate = useNavigate();
  
  // 处理返回按钮点击
  const handleBack = () => {
    navigate('/');
  };
  
  // 科目分类标签
  type SubjectTab = 'all' | 'math' | 'physics' | 'chemistry';
  const [activeTab, setActiveTab] = useState<SubjectTab>('all');
  
  // 聚合记录状态
  const aggregatedRecords = aggregateRecords(SAMPLE_RECORDS);
  
  // 模态框状态
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AggregatedRecord | null>(null);
  
  // 根据选择的标签过滤记录
  const filteredRecords = activeTab === 'all' 
    ? aggregatedRecords 
    : aggregatedRecords.filter(record => record.subject === activeTab);
  
  // 计算统计数据
  const totalPractices = SAMPLE_RECORDS.length;
  const totalFormulas = aggregatedRecords.length;
  const averageAccuracy = Math.round(
    SAMPLE_RECORDS.reduce((sum, record) => sum + record.accuracy, 0) / totalPractices
  );
  
  // 处理记录点击，显示详情模态框
  const handleRecordClick = (record: AggregatedRecord) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };
  
  // 处理详情记录点击，跳转到练习报告页面
  const handleDetailClick = (id: string) => {
    navigate(`/practice-result/${id}`);
    setShowDetailModal(false);
  };
  
  // 科目名称映射
  const getSubjectName = (subject: SubjectTab): string => {
    switch(subject) {
      case 'math': return '数学';
      case 'physics': return '物理';
      case 'chemistry': return '化学';
      default: return '全部';
    }
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
            <StatIcon><i className="fas fa-book"></i></StatIcon>
            <StatInfo>
              <StatValue>{totalFormulas}</StatValue>
              <StatLabel>练习公式数</StatLabel>
            </StatInfo>
          </StatCard>
          
          <StatCard>
            <StatIcon><i className="fas fa-chart-line"></i></StatIcon>
            <StatInfo>
              <StatValue>{averageAccuracy}%</StatValue>
              <StatLabel>总体正确率</StatLabel>
            </StatInfo>
          </StatCard>
        </StatsContainer>
        
        <Title>练习记录列表</Title>
        
        <TabContainer>
          <Tab 
            active={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
          >
            全部
          </Tab>
          <Tab 
            active={activeTab === 'math'}
            onClick={() => setActiveTab('math')}
          >
            数学
          </Tab>
          <Tab 
            active={activeTab === 'physics'}
            onClick={() => setActiveTab('physics')}
          >
            物理
          </Tab>
          <Tab 
            active={activeTab === 'chemistry'}
            onClick={() => setActiveTab('chemistry')}
          >
            化学
          </Tab>
        </TabContainer>
        
        {filteredRecords.length > 0 ? (
          <RecordGrid>
            {filteredRecords.map(record => (
              <RecordCard 
                key={record.formulaId}
                onClick={() => handleRecordClick(record)}
              >
                <RecordDate>{record.lastPracticeDate}</RecordDate>
                <RecordTitle>{record.formulaTitle}</RecordTitle>
                <RecordSummary>
                  练习了 {record.totalPractices} 次
                </RecordSummary>
                <RecordFooter>
                  <AccuracyText>
                    <AccuracyDot value={record.lastAccuracy} />
                    {record.lastAccuracy}% 上次练习
                  </AccuracyText>
                  <ViewButton>
                    查看详情
                    <i className="fas fa-chevron-right"></i>
                  </ViewButton>
                </RecordFooter>
              </RecordCard>
            ))}
          </RecordGrid>
        ) : (
          <EmptyState>
            <i className="far fa-clipboard"></i>
            <div>暂无{getSubjectName(activeTab)}练习记录</div>
          </EmptyState>
        )}
      </Content>
      
      {/* 详情模态框 */}
      {showDetailModal && selectedRecord && (
        <ModalOverlay onClick={() => setShowDetailModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{selectedRecord.formulaTitle} - 练习记录</ModalTitle>
              <CloseButton onClick={() => setShowDetailModal(false)}>
                <i className="fas fa-times"></i>
              </CloseButton>
            </ModalHeader>
            
            <DetailsList>
              {selectedRecord.records.map(record => (
                <DetailItem 
                  key={record.id}
                  onClick={() => handleDetailClick(record.id)}
                >
                  <DetailInfo>
                    <DetailDate>{record.date}</DetailDate>
                    <DetailAccuracy>
                      <AccuracyDot value={record.accuracy} />
                      {record.accuracy}% 上次练习
                    </DetailAccuracy>
                  </DetailInfo>
                  <ArrowIcon>
                    <i className="fas fa-chevron-right"></i>
                  </ArrowIcon>
                </DetailItem>
              ))}
            </DetailsList>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default RecordPage; 
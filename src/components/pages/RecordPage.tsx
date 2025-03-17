import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';

// 样式化组件
const RecordContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.medium};
  padding: 15px;
  min-height: 800px;
  height: calc(100vh - 40px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const RecordListContainer = styled.div`
  margin-top: 15px;
  height: calc(100% - 70px);
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
  padding: 15px 10px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
`;

const RecordInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const RecordTitle = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.primary};
  font-weight: 500;
`;

const RecordDate = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.text.light};
`;

interface AccuracyProps {
  value: number;
}

const RecordAccuracy = styled.div<AccuracyProps>`
  font-size: 14px;
  font-weight: bold;
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
    title: '体积公式 - 练习',
    date: '2023-06-15 14:30',
    accuracy: 67,
  },
  {
    id: 'r2',
    title: '面积公式 - 练习',
    date: '2023-06-14 16:45',
    accuracy: 100,
  },
  {
    id: 'r3',
    title: '勾股定理 - 练习',
    date: '2023-06-13 09:20',
    accuracy: 50,
  },
  {
    id: 'r4',
    title: '周长公式 - 练习',
    date: '2023-06-12 10:15',
    accuracy: 33,
  },
  {
    id: 'r5',
    title: '三角形面积 - 练习',
    date: '2023-06-10 15:30',
    accuracy: 83,
  },
];

/**
 * RecordPage组件 - 做题记录页面
 * 
 * 功能：
 * - 展示用户的做题记录列表
 * - 支持点击查看详细记录
 */
const RecordPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 处理记录点击
  const handleRecordClick = (recordId: string) => {
    // 在实际应用中，应该根据记录ID导航到详细信息页面
    navigate(`/analysis`, { state: { recordId } });
  };
  
  return (
    <RecordContainer>
      <Header
        title="做题记录"
        showBackButton
      />
      
      <RecordListContainer>
        {PRACTICE_RECORDS.length > 0 ? (
          PRACTICE_RECORDS.map(record => (
            <RecordItem key={record.id} onClick={() => handleRecordClick(record.id)}>
              <RecordInfo>
                <RecordTitle>{record.title}</RecordTitle>
                <RecordDate>{record.date}</RecordDate>
              </RecordInfo>
              <RecordAccuracy value={record.accuracy}>{record.accuracy}%</RecordAccuracy>
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
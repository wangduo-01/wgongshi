import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faRedo, faPrint } from '@fortawesome/free-solid-svg-icons';
import Header from '../common/Header';

// 样式化组件
const ErrorBookContainer = styled.div`
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

const ErrorListContainer = styled.div`
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

const ErrorItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 10px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ErrorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
`;

const ErrorTitle = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.primary};
  font-weight: 500;
`;

const ErrorDate = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.text.light};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const ActionButton = styled.div`
  cursor: pointer;
  color: ${props => props.color || props.theme.colors.text.secondary};
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
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

// 模拟错题数据
const ERROR_QUESTIONS = [
  {
    id: 'e1',
    title: '体积公式：一个圆柱形容器，底面半径为3厘米...',
    date: '2023-06-15 14:30',
    formulaId: '3',
  },
  {
    id: 'e2',
    title: '勾股定理：在直角三角形中，已知两直角边长...',
    date: '2023-06-13 09:20',
    formulaId: '5',
  },
  {
    id: 'e3',
    title: '周长公式：一个圆的直径为10厘米，求这个圆的周长...',
    date: '2023-06-12 10:15',
    formulaId: '1',
  },
];

/**
 * ErrorBookPage组件 - 错题本页面
 * 
 * 功能：
 * - 展示用户的错题列表
 * - 支持查看错题解析
 * - 支持重新练习
 * - 支持打印错题
 */
const ErrorBookPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 处理查看错题解析
  const handleViewAnalysis = (errorId: string) => {
    navigate('/analysis', { state: { errorId } });
  };
  
  // 处理重新练习
  const handleRetryPractice = (formulaId: string) => {
    navigate(`/practice/${formulaId}`);
  };
  
  // 处理打印错题
  const handlePrintErrors = () => {
    navigate('/print', { state: { type: 'errors' } });
  };
  
  // 右侧操作按钮
  const rightIcons = [
    { 
      icon: faPrint, 
      color: '#666',
      action: handlePrintErrors 
    },
  ];
  
  return (
    <ErrorBookContainer>
      <Header
        title="我的错题本"
        showBackButton
        showRightActions
        rightIcons={rightIcons}
      />
      
      <ErrorListContainer>
        {ERROR_QUESTIONS.length > 0 ? (
          ERROR_QUESTIONS.map(error => (
            <ErrorItem key={error.id}>
              <ErrorInfo>
                <ErrorTitle>{error.title}</ErrorTitle>
                <ErrorDate>{error.date}</ErrorDate>
              </ErrorInfo>
              <ActionButtons>
                <ActionButton 
                  color={`${props => props.theme.colors.primary}`}
                  onClick={() => handleViewAnalysis(error.id)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </ActionButton>
                <ActionButton 
                  color="#ff9500"
                  onClick={() => handleRetryPractice(error.formulaId)}
                >
                  <FontAwesomeIcon icon={faRedo} />
                </ActionButton>
              </ActionButtons>
            </ErrorItem>
          ))
        ) : (
          <EmptyState>
            <p>您的错题本还是空的</p>
            <p>这说明您的掌握度很高，继续加油！</p>
          </EmptyState>
        )}
      </ErrorListContainer>
    </ErrorBookContainer>
  );
};

export default ErrorBookPage; 
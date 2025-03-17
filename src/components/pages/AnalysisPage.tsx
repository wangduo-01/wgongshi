import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../common/Header';

// 样式化组件
const AnalysisContainer = styled.div`
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

const AnalysisContent = styled.div`
  padding: 15px;
  height: calc(100% - 60px);
  margin-top: 15px;
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

const AnalysisItem = styled.div`
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const AnalysisQuestion = styled.div`
  font-size: 16px;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 15px;
  line-height: 1.5;
  
  strong {
    font-weight: 600;
  }
`;

const AnalysisDetail = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
  background-color: ${props => props.theme.colors.card};
  padding: 15px;
  border-radius: ${props => props.theme.borderRadius.medium};
  line-height: 1.6;
  
  p {
    margin-bottom: 8px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

// 练习结果页面的传入数据接口
interface PracticeResultState {
  formulaId: string;
  answersCount: number;
  correctCount: number;
  accuracy: number;
  userAnswers: Record<string, string>;
}

// 模拟练习题数据
const PRACTICE_QUESTIONS = [
  {
    id: 'q1',
    content: '一个圆柱形容器，底面半径为3厘米，高为5厘米，求这个容器的体积。',
    options: [
      { id: 'a', text: '141.3立方厘米' },
      { id: 'b', text: '141.3立方厘米' },
      { id: 'c', text: '150.72立方厘米' },
      { id: 'd', text: '94.2立方厘米' },
    ],
    correctAnswer: 'a',
    analysis: '根据圆柱体积公式 V = πr²h\n代入数据：r = 3厘米，h = 5厘米\nV = 3.14 × 3² × 5 = 3.14 × 9 × 5 = 141.3(立方厘米)',
  },
  {
    id: 'q2',
    content: '一个圆柱形水塔，底面直径为6米，高为8米，求这个水塔的容积。',
    options: [
      { id: 'a', text: '180.96立方米' },
      { id: 'b', text: '113.04立方米' },
      { id: 'c', text: '226.08立方米' },
      { id: 'd', text: '452.16立方米' },
    ],
    correctAnswer: 'c',
    analysis: '根据圆柱体积公式 V = πr²h\n直径为6米，则半径r = 3米，h = 8米\nV = 3.14 × 3² × 8 = 3.14 × 9 × 8 = 226.08(立方米)',
  },
  {
    id: 'q3',
    content: '一个圆柱形铅笔筒，底面半径为4厘米，高为10厘米，求这个铅笔筒的容积。',
    options: [
      { id: 'a', text: '502.4立方厘米' },
      { id: 'b', text: '251.2立方厘米' },
      { id: 'c', text: '125.6立方厘米' },
      { id: 'd', text: '1004.8立方厘米' },
    ],
    correctAnswer: 'a',
    analysis: '根据圆柱体积公式 V = πr²h\n代入数据：r = 4厘米，h = 10厘米\nV = 3.14 × 4² × 10 = 3.14 × 16 × 10 = 502.4(立方厘米)',
  },
];

/**
 * AnalysisPage组件 - 练习题解析页面
 * 
 * 功能：
 * - 显示练习题目
 * - 显示正确答案
 * - 显示解析说明
 * - 标记用户是否答对
 */
const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PracticeResultState;
  
  // 如果没有结果数据，返回首页
  if (!state) {
    navigate('/');
    return null;
  }
  
  const { userAnswers } = state;
  
  // 检查用户答案是否正确
  const isAnswerCorrect = (questionId: string) => {
    const question = PRACTICE_QUESTIONS.find(q => q.id === questionId);
    return question?.correctAnswer === userAnswers[questionId];
  };
  
  // 获取选项文本
  const getOptionText = (questionId: string, optionId: string) => {
    const question = PRACTICE_QUESTIONS.find(q => q.id === questionId);
    return question?.options.find(o => o.id === optionId)?.text || '';
  };
  
  return (
    <AnalysisContainer>
      <Header
        title="体积公式 - 练习解析"
        showBackButton
      />
      
      <AnalysisContent>
        {PRACTICE_QUESTIONS.map(question => (
          <AnalysisItem key={question.id}>
            <AnalysisQuestion>
              <strong>第{question.id.replace('q', '')}题：</strong>{question.content}
            </AnalysisQuestion>
            <AnalysisDetail>
              <p>
                <strong>正确答案：</strong>
                {question.correctAnswer.toUpperCase()}. {getOptionText(question.id, question.correctAnswer)}
              </p>
              <p>
                <strong>你的答案：</strong>
                {userAnswers[question.id] 
                  ? `${userAnswers[question.id].toUpperCase()}. ${getOptionText(question.id, userAnswers[question.id])}` 
                  : '未作答'} 
                {userAnswers[question.id] && (
                  <span style={{ 
                    color: isAnswerCorrect(question.id) 
                      ? '#4cd964' // 正确颜色
                      : '#ff3b30', // 错误颜色
                    marginLeft: '10px',
                    fontWeight: 'bold'
                  }}>
                    {isAnswerCorrect(question.id) ? '✓ 正确' : '✗ 错误'}
                  </span>
                )}
              </p>
              <p>
                <strong>解析：</strong>
              </p>
              {question.analysis.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </AnalysisDetail>
          </AnalysisItem>
        ))}
      </AnalysisContent>
    </AnalysisContainer>
  );
};

export default AnalysisPage; 
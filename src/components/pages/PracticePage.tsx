import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Header from '../common/Header';

// 样式化组件
const PracticeContainer = styled.div`
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

const QuestionContainer = styled.div`
  height: 100%;
  margin-top: 15px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const QuestionNumber = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 10px;
`;

const QuestionContent = styled.div`
  font-size: 16px;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 20px;
  line-height: 1.5;
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

interface OptionProps {
  selected: boolean;
}

const Option = styled.div<OptionProps>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: ${props => props.theme.borderRadius.small};
  border: 1px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.border};
  background-color: ${props => props.selected ? props.theme.colors.secondary : 'transparent'};
  font-size: 14px;
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.selected ? props.theme.colors.secondary : 'rgba(74, 137, 220, 0.05)'};
  }
`;

const QuestionNav = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
`;

const NavButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${props => props.disabled ? props.theme.colors.text.light : props.theme.colors.primary};
  background: none;
  border: none;
  font-size: 14px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  padding: 8px 12px;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.secondary};
    border-radius: ${props => props.theme.borderRadius.small};
  }
`;

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
  },
];

/**
 * PracticePage组件 - 公式练习测试页面
 * 
 * 功能：
 * - 展示练习题目和选项
 * - 支持选择答案
 * - 提供上一题/下一题导航
 * - 完成后计算得分并显示结果
 */
const PracticePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  // 获取当前问题
  const currentQuestion = PRACTICE_QUESTIONS[currentQuestionIndex];
  
  // 选择答案
  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: optionId,
    });
  };
  
  // 上一题
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // 下一题或提交
  const handleNextQuestion = () => {
    if (currentQuestionIndex < PRACTICE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 计算结果并导航到结果页面
      const correctCount = Object.entries(selectedAnswers).reduce((count, [questionId, answer]) => {
        const question = PRACTICE_QUESTIONS.find(q => q.id === questionId);
        return question?.correctAnswer === answer ? count + 1 : count;
      }, 0);
      
      const accuracy = Math.round((correctCount / PRACTICE_QUESTIONS.length) * 100);
      
      navigate('/practice-result', { 
        state: { 
          formulaId: id,
          answersCount: PRACTICE_QUESTIONS.length,
          correctCount,
          accuracy,
          userAnswers: selectedAnswers
        } 
      });
    }
  };
  
  return (
    <PracticeContainer>
      <Header
        title="体积公式 - 练习"
        showBackButton
      />
      
      <QuestionContainer>
        <QuestionNumber>第{currentQuestionIndex + 1}题 / 共{PRACTICE_QUESTIONS.length}题</QuestionNumber>
        <QuestionContent>{currentQuestion.content}</QuestionContent>
        
        <Options>
          {currentQuestion.options.map(option => (
            <Option
              key={option.id}
              selected={selectedAnswers[currentQuestion.id] === option.id}
              onClick={() => handleSelectOption(option.id)}
            >
              {option.id.toUpperCase()}. {option.text}
            </Option>
          ))}
        </Options>
        
        <QuestionNav>
          <NavButton 
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <FontAwesomeIcon icon={faChevronLeft} /> 上一题
          </NavButton>
          <NavButton onClick={handleNextQuestion}>
            {currentQuestionIndex === PRACTICE_QUESTIONS.length - 1 ? '提交' : '下一题'} 
            {currentQuestionIndex !== PRACTICE_QUESTIONS.length - 1 && <FontAwesomeIcon icon={faChevronRight} />}
          </NavButton>
        </QuestionNav>
      </QuestionContainer>
    </PracticeContainer>
  );
};

export default PracticePage; 
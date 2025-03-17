import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';

// 样式部分
const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  background-color: #f5f6fa;
  padding: 20px;
  min-height: 100vh;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #4a89dc;
  font-size: 16px;
  cursor: pointer;
  padding: 10px 0;
  margin-bottom: 20px;
  font-weight: 500;
  
  &:hover {
    color: #2e5ca8;
  }
  
  i {
    font-size: 18px;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  max-width: 800px;
  height: 6px;
  background-color: #e0e7f3;
  border-radius: 6px;
  margin: 0 auto 30px;
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => props.progress}%;
  background-color: #4a89dc;
  border-radius: 6px;
  transition: width 0.3s ease;
`;

const QuizCard = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const QuizHeader = styled.div`
  padding: 24px 30px;
  background-color: #4a89dc;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const QuizTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const QuestionCounter = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
`;

const QuestionContent = styled.div`
  padding: 30px 30px 20px;
  font-size: 18px;
  line-height: 1.6;
  color: #333;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 30px;
    right: 30px;
    height: 1px;
    background-color: #f0f3f8;
  }
`;

const OptionsContainer = styled.div`
  padding: 20px 30px 30px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

interface OptionProps {
  isSelected: boolean;
}

const OptionItem = styled.div<OptionProps>`
  padding: 16px 20px;
  border-radius: 12px;
  border: 2px solid ${props => props.isSelected ? '#4a89dc' : '#eef2f7'};
  background-color: ${props => props.isSelected ? '#f0f7ff' : 'white'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  
  &:hover {
    border-color: ${props => props.isSelected ? '#4a89dc' : '#d5e0f2'};
    background-color: ${props => props.isSelected ? '#f0f7ff' : '#f9fafc'};
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  }
`;

const OptionLetter = styled.div<OptionProps>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.isSelected ? '#4a89dc' : '#f0f3f8'};
  color: ${props => props.isSelected ? 'white' : '#7a8599'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 15px;
  flex-shrink: 0;
  font-size: 16px;
`;

const OptionText = styled.div`
  font-size: 16px;
  color: #3a4255;
  line-height: 1.4;
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background-color: #fafbfd;
  border-top: 1px solid #eef2f7;
`;

const NavButton = styled.button<{ isPrimary?: boolean, disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  
  ${props => props.isPrimary ? `
    background-color: #4a89dc;
    color: white;
    border: none;
    
    &:hover {
      background-color: #3a6cad;
    }
    
    &:disabled {
      background-color: #c5d6ef;
      color: #ffffff;
    }
  ` : `
    background-color: white;
    color: #666;
    border: 1px solid #ddd;
    
    &:hover {
      background-color: #f5f6fa;
      border-color: #ccc;
    }
    
    &:disabled {
      background-color: #f5f6fa;
      color: #ccc;
      border-color: #eee;
    }
  `}
`;

const ProgressText = styled.div`
  color: #7a8599;
  font-size: 14px;
`;

// 模拟题目数据
interface Question {
  id: number;
  content: string;
  options: string[];
  correctAnswer?: number;
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1,
    content: '一个圆柱形容器，底面半径为3厘米，高为5厘米，求这个容器的体积。',
    options: [
      '141.3立方厘米',
      '141.3立方厘米',
      '150.72立方厘米',
      '94.2立方厘米'
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    content: '一个圆柱形水塔，底面直径为6米，高为8米，求这个水塔的容积。',
    options: [
      '226.08立方米',
      '113.04立方米',
      '226.08立方米',
      '452.16立方米'
    ],
    correctAnswer: 2
  },
  {
    id: 3,
    content: '一个圆柱形铅笔筒，底面半径为4厘米，高为10厘米，求这个铅笔筒的容积。',
    options: [
      '502.4立方厘米',
      '251.2立方厘米',
      '125.6立方厘米',
      '50.24立方厘米'
    ],
    correctAnswer: 0
  }
];

// 练习页面组件
const PracticePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(SAMPLE_QUESTIONS.length).fill(-1));
  const [formulaTitle, setFormulaTitle] = useState<string>("体积公式");
  
  useEffect(() => {
    // 可以根据id从API获取公式信息和练习题
    // 这里简化处理，只设置一个标题
    if (id === "3") {
      setFormulaTitle("圆柱体积公式");
    }
  }, [id]);
  
  const totalQuestions = SAMPLE_QUESTIONS.length;
  const question = SAMPLE_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  
  // 处理返回按钮点击 - 返回公式详情页
  const handleBackClick = () => {
    navigate(`/formula/${id}`);
  };
  
  // 处理选择答案
  const handleSelectAnswer = (index: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = index;
    setSelectedAnswers(newAnswers);
  };
  
  // 处理下一题
  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // 所有题目已完成，跳转到结果页
      navigate(`/result/${id}`);
    }
  };
  
  // 处理上一题
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
  
  // 处理完成按钮点击
  const handleFinish = () => {
    // 计算正确率
    const correctCount = selectedAnswers.reduce((count, answer, index) => {
      if (answer === SAMPLE_QUESTIONS[index].correctAnswer) {
        return count + 1;
      }
      return count;
    }, 0);
    
    const score = Math.round((correctCount / totalQuestions) * 100);
    
    // 导航到结果页，并传递分数
    navigate(`/result/${id}?score=${score}`);
  };
  
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const hasSelectedCurrentAnswer = selectedAnswers[currentQuestion] !== -1;
  
  return (
    <Container>
      <BackButton onClick={handleBackClick}>
        <i className="fas fa-arrow-left"></i> {formulaTitle}
      </BackButton>
      
      <ProgressBar>
        <ProgressFill progress={progress} />
      </ProgressBar>
      
      <QuizCard>
        <QuizHeader>
          <QuizTitle>{formulaTitle} - 练习</QuizTitle>
          <QuestionCounter>第 {currentQuestion + 1} 题 / 共 {totalQuestions} 题</QuestionCounter>
        </QuizHeader>
        
        <QuestionContent>
          {question.content}
        </QuestionContent>
        
        <OptionsContainer>
          {question.options.map((option, index) => {
            const letterOptions = ['A', 'B', 'C', 'D', 'E', 'F'];
            const isSelected = selectedAnswers[currentQuestion] === index;
            
            return (
              <OptionItem 
                key={index}
                isSelected={isSelected}
                onClick={() => handleSelectAnswer(index)}
              >
                <OptionLetter isSelected={isSelected}>
                  {letterOptions[index]}
                </OptionLetter>
                <OptionText>{option}</OptionText>
              </OptionItem>
            );
          })}
        </OptionsContainer>
        
        <NavigationContainer>
          <NavButton
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
          >
            <i className="fas fa-chevron-left"></i> 上一题
          </NavButton>
          
          <ProgressText>{currentQuestion + 1} / {totalQuestions}</ProgressText>
          
          {isLastQuestion ? (
            <NavButton 
              isPrimary 
              onClick={handleFinish}
              disabled={!hasSelectedCurrentAnswer}
            >
              完成测试 <i className="fas fa-check"></i>
            </NavButton>
          ) : (
            <NavButton 
              isPrimary 
              onClick={handleNextQuestion}
              disabled={!hasSelectedCurrentAnswer}
            >
              下一题 <i className="fas fa-chevron-right"></i>
            </NavButton>
          )}
        </NavigationContainer>
      </QuizCard>
    </Container>
  );
};

export default PracticePage; 
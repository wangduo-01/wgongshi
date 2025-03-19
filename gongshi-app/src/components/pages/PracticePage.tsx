import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

// 样式部分
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #f5f6fa;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  background-color: #4a89dc;
  color: white;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const BackButton = styled.button`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  text-align: center;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow-y: auto;
`;

const QuestionContent = styled.div`
  padding: 30px 20px;
  font-size: 18px;
  line-height: 1.6;
  color: #333;
  background-color: white;
  margin-bottom: 1px;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  flex: 1;
  padding: 10px 20px 30px;
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
  margin-bottom: 15px;
  
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

const FooterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: white;
  border-top: 1px solid #eef2f7;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
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
  font-weight: 500;
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
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(SAMPLE_QUESTIONS.length).fill(-1));
  const [formulaTitle, setFormulaTitle] = useState<string>("体积公式");
  const [fromPage, setFromPage] = useState<string>('home');
  
  useEffect(() => {
    // 获取和处理来源页面参数
    const params = new URLSearchParams(location.search);
    const from = params.get('from');
    if (from) {
      console.log("检测到来源页面参数:", from);
      setFromPage(from);
    } else {
      console.log("未检测到来源参数，使用默认值: home");
      setFromPage('home');
    }
    
    // 可以根据id从API获取公式信息和练习题
    // 这里简化处理，只设置一个标题
    if (id === "3") {
      setFormulaTitle("圆柱体积公式");
    }
  }, [id, location.search]);
  
  const totalQuestions = SAMPLE_QUESTIONS.length;
  const question = SAMPLE_QUESTIONS[currentQuestion];
  
  // 处理返回按钮点击 - 根据来源决定返回路径
  const handleBackClick = () => {
    console.log("练习页返回按钮点击，来源页面:", fromPage);
    
    // 根据来源页面决定返回地址
    if (fromPage === 'formula') {
      // 如果是从公式详情页来的，返回公式详情页
      console.log("返回公式详情页");
      navigate(`/formula/${id}`);
    } else if (fromPage === 'favorites') {
      // 如果是从收藏弹窗来的，返回首页并设置标记打开收藏弹窗
      console.log("返回收藏弹窗");
      sessionStorage.setItem('openFavoritesModalDirectly', 'true');
      navigate('/'); 
    } else {
      // 默认返回首页
      console.log("返回首页");
      navigate('/');
    }
  };
  
  // 处理选择答案
  const handleSelectAnswer = (index: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = index;
    setSelectedAnswers(newAnswers);
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
    
    // 导航到结果页时传递分数和来源参数
    console.log(`完成练习，导航到结果页并保留来源: ${fromPage}`);
    navigate(`/practice-result/${id}?score=${score}&from=${fromPage}`);
  };
  
  // 处理下一题
  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // 所有题目已完成，跳转到结果页并传递来源参数
      const correctCount = selectedAnswers.reduce((count, answer, index) => {
        if (answer === SAMPLE_QUESTIONS[index].correctAnswer) {
          return count + 1;
        }
        return count;
      }, 0);
      
      const score = Math.round((correctCount / totalQuestions) * 100);
      console.log(`所有题目已完成，导航到结果页并保留来源: ${fromPage}`);
      navigate(`/practice-result/${id}?score=${score}&from=${fromPage}`);
    }
  };
  
  // 处理上一题
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
  
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const hasSelectedCurrentAnswer = selectedAnswers[currentQuestion] !== -1;
  
  return (
    <Container>
      <Header>
        <BackButton onClick={handleBackClick}>
          <i className="fas fa-arrow-left"></i>
        </BackButton>
        <HeaderTitle>{formulaTitle} - 练习</HeaderTitle>
      </Header>
      
      <ContentContainer>
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
      </ContentContainer>
      
      <FooterContainer>
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
            完成 <i className="fas fa-check"></i>
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
      </FooterContainer>
    </Container>
  );
};

export default PracticePage; 
import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../common/Header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1280px;
  margin: 0 auto;
  background-color: ${props => props.theme.colors.white};
  padding: 15px;
  min-height: 100vh;
`;

const Content = styled.div`
  padding: 15px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 20px;
`;

interface TabProps {
  active: boolean;
}

const Tab = styled.div<TabProps>`
  padding: 10px 15px;
  font-size: 14px;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text.secondary};
  border-bottom: ${props => props.active ? `2px solid ${props.theme.colors.primary}` : 'none'};
  cursor: pointer;
`;

const QuestionContainer = styled.div`
  margin-bottom: 20px;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const QuestionTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

const QuestionContent = styled.div`
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 1.5;
`;

interface StatusProps {
  isCorrect: boolean;
}

const Status = styled.div<StatusProps>`
  font-size: 12px;
  color: ${props => props.isCorrect ? props.theme.colors.status.success : props.theme.colors.status.error};
`;

const AnswerSection = styled.div`
  margin-bottom: 15px;
  padding: 10px 15px;
  background-color: #f9f9f9;
  border-radius: 5px;
`;

const AnswerTitle = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 5px;
`;

const AnswerContent = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.primary};
`;

const AnalysisSection = styled.div`
  margin-bottom: 15px;
`;

const AnalysisTitle = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 5px;
`;

const AnalysisContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: ${props => props.theme.colors.text.primary};
`;

const StepsList = styled.div`
  margin-top: 10px;
`;

const Step = styled.div`
  margin-bottom: 8px;
  padding-left: 15px;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${props => props.theme.colors.primary};
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const NavButton = styled.button<{ primary?: boolean }>`
  padding: 8px 15px;
  border-radius: 5px;
  background-color: ${props => props.primary ? props.theme.colors.primary : 'white'};
  color: ${props => props.primary ? 'white' : props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

// 样本数据
const SAMPLE_ANALYSIS = [
  {
    id: 1,
    content: '一个圆柱形容器，底面半径为3厘米，高为5厘米，求这个容器的体积。',
    isCorrect: true,
    userAnswer: 'A. 141.3立方厘米',
    correctAnswer: 'A. 141.3立方厘米',
    analysis: '圆柱体积计算公式为 V = πr²h，其中 r 是底面半径，h 是高。\n\n将数据代入公式：V = 3.14 × 3² × 5 = 3.14 × 9 × 5 = 141.3立方厘米。',
    steps: [
      '确定使用圆柱体积公式：V = πr²h',
      '代入已知数据：r = 3厘米，h = 5厘米',
      '计算结果：V = 3.14 × 3² × 5 = 3.14 × 9 × 5 = 141.3立方厘米'
    ]
  },
  {
    id: 2,
    content: '一个圆柱形水塔，底面直径为6米，高为8米，求这个水塔的容积。',
    isCorrect: true,
    userAnswer: 'C. 226.08立方米',
    correctAnswer: 'C. 226.08立方米',
    analysis: '圆柱体积计算公式为 V = πr²h，其中 r 是底面半径，h 是高。\n\n注意题目给出的是直径，需要将直径除以2得到半径。半径 r = 6 ÷ 2 = 3米。\n\n将数据代入公式：V = 3.14 × 3² × 8 = 3.14 × 9 × 8 = 226.08立方米。',
    steps: [
      '确定使用圆柱体积公式：V = πr²h',
      '计算半径：r = 直径 ÷ 2 = 6 ÷ 2 = 3米',
      '代入已知数据：r = 3米，h = 8米',
      '计算结果：V = 3.14 × 3² × 8 = 3.14 × 9 × 8 = 226.08立方米'
    ]
  },
  {
    id: 3,
    content: '一个圆柱形铅笔筒，底面半径为4厘米，高为10厘米，求这个铅笔筒的容积。',
    isCorrect: false,
    userAnswer: 'B. 251.2立方厘米',
    correctAnswer: 'A. 502.4立方厘米',
    analysis: '圆柱体积计算公式为 V = πr²h，其中 r 是底面半径，h 是高。\n\n将数据代入公式：V = 3.14 × 4² × 10 = 3.14 × 16 × 10 = 502.4立方厘米。\n\n错误分析：可能是在计算 r² 时出错，或者忘记了平方运算。',
    steps: [
      '确定使用圆柱体积公式：V = πr²h',
      '代入已知数据：r = 4厘米，h = 10厘米',
      '计算结果：V = 3.14 × 4² × 10 = 3.14 × 16 × 10 = 502.4立方厘米',
      '错误原因分析：可能将 r² 计算为 4 × 2 = 8，而非 4² = 16'
    ]
  },
  {
    id: 4,
    content: '圆柱的体积公式是什么？',
    isCorrect: true,
    userAnswer: 'B. V = πr²h',
    correctAnswer: 'B. V = πr²h',
    analysis: '圆柱体积的计算公式确实是 V = πr²h，其中 r 是底面半径，h 是高。\n\n这个公式可以理解为：圆柱的体积等于底面积（πr²）乘以高（h）。',
    steps: [
      '圆柱体积公式：V = πr²h',
      '公式中，r 表示底面半径，h 表示高',
      '底面积为 πr²，体积为底面积乘以高'
    ]
  },
  {
    id: 5,
    content: '当圆柱的底面半径增加一倍，高不变时，体积会怎样变化？',
    isCorrect: true,
    userAnswer: 'C. 增加为原来的4倍',
    correctAnswer: 'C. 增加为原来的4倍',
    analysis: '圆柱体积公式为 V = πr²h。\n\n当半径 r 增加一倍变为 2r 时，新的体积为 V\' = π(2r)²h = π × 4r² × h = 4πr²h = 4V。\n\n因此，当半径增加一倍，而高不变时，体积增加为原来的4倍。这是因为在体积公式中，半径的平方项导致体积与半径的平方成正比。',
    steps: [
      '原体积：V = πr²h',
      '半径增加一倍后：r\' = 2r',
      '新体积：V\' = πr\'²h = π(2r)²h = π × 4r² × h = 4πr²h = 4V',
      '所以体积增加为原来的4倍'
    ]
  }
];

const AnalysisPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  // 过滤出需要显示的题目
  const filteredQuestions = activeTab === 'all' 
    ? SAMPLE_ANALYSIS 
    : activeTab === 'wrong' 
      ? SAMPLE_ANALYSIS.filter(q => !q.isCorrect) 
      : SAMPLE_ANALYSIS.filter(q => q.isCorrect);
  
  const question = filteredQuestions[currentQuestion] || SAMPLE_ANALYSIS[0];
  
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 如果是最后一题，可以返回结果页
      navigate(`/result/${id}`);
    }
  };
  
  return (
    <Container>
      <Header 
        title="解析详情"
        showBackButton
      />
      
      <Content>
        <Title>解题分析</Title>
        
        <TabContainer>
          <Tab 
            active={activeTab === 'all'} 
            onClick={() => {
              setActiveTab('all');
              setCurrentQuestion(0);
            }}
          >
            全部题目
          </Tab>
          <Tab 
            active={activeTab === 'wrong'} 
            onClick={() => {
              setActiveTab('wrong');
              setCurrentQuestion(0);
            }}
          >
            错题
          </Tab>
          <Tab 
            active={activeTab === 'correct'} 
            onClick={() => {
              setActiveTab('correct');
              setCurrentQuestion(0);
            }}
          >
            正确题目
          </Tab>
        </TabContainer>
        
        <QuestionContainer>
          <QuestionHeader>
            <QuestionTitle>第 {question.id} 题</QuestionTitle>
            <Status isCorrect={question.isCorrect}>
              {question.isCorrect ? '答对了' : '答错了'}
            </Status>
          </QuestionHeader>
          
          <QuestionContent>{question.content}</QuestionContent>
          
          <AnswerSection>
            <AnswerTitle>您的答案</AnswerTitle>
            <AnswerContent>{question.userAnswer}</AnswerContent>
          </AnswerSection>
          
          {!question.isCorrect && (
            <AnswerSection>
              <AnswerTitle>正确答案</AnswerTitle>
              <AnswerContent>{question.correctAnswer}</AnswerContent>
            </AnswerSection>
          )}
          
          <AnalysisSection>
            <AnalysisTitle>解析</AnalysisTitle>
            <AnalysisContent>
              {question.analysis.split('\n\n').map((paragraph, index) => (
                <p key={index} style={{ marginBottom: '10px' }}>{paragraph}</p>
              ))}
            </AnalysisContent>
          </AnalysisSection>
          
          <AnalysisSection>
            <AnalysisTitle>解题步骤</AnalysisTitle>
            <StepsList>
              {question.steps.map((step, index) => (
                <Step key={index}>{step}</Step>
              ))}
            </StepsList>
          </AnalysisSection>
        </QuestionContainer>
        
        <NavigationButtons>
          <NavButton 
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
          >
            <i className="fas fa-chevron-left"></i> 上一题
          </NavButton>
          
          <NavButton primary onClick={handleNextQuestion}>
            {currentQuestion < filteredQuestions.length - 1 ? '下一题' : '返回结果'} <i className="fas fa-chevron-right"></i>
          </NavButton>
        </NavigationButtons>
      </Content>
    </Container>
  );
};

export default AnalysisPage; 
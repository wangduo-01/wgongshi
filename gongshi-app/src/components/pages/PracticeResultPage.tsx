import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../common/Header';

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

const ResultCard = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

const ResultHeader = styled.div`
  background-color: #4a89dc;
  padding: 30px;
  color: white;
  text-align: center;
`;

const ResultTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 5px 0;
`;

const ScoreSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
`;

const ScoreCircle = styled.div<{ score: number }>`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: ${props => {
    // 根据得分返回不同的渐变色
    if (props.score >= 80) return 'linear-gradient(135deg, #43cea2 0%, #3f93cf 100%)';
    if (props.score >= 60) return 'linear-gradient(135deg, #ffb347 0%, #ffcc33 100%)';
    return 'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)';
  }};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    z-index: 1;
  }
`;

const ScoreValue = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: white;
  z-index: 2;
`;

const ScoreLabel = styled.div`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  z-index: 2;
`;

const ResultMessage = styled.div<{ score: number }>`
  font-size: 20px;
  font-weight: 600;
  margin: 25px 0 10px;
  color: ${props => {
    if (props.score >= 80) return '#43cea2';
    if (props.score >= 60) return '#ffb347';
    return '#ff512f';
  }};
`;

const ResultDescription = styled.p`
  color: #7a8599;
  font-size: 16px;
  text-align: center;
  max-width: 80%;
  margin: 0 auto;
  line-height: 1.6;
`;

const StatsSection = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: #fafbfd;
  border-top: 1px solid #eef2f7;
  border-bottom: 1px solid #eef2f7;
`;

const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 30px;
  position: relative;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 25%;
    height: 50%;
    width: 1px;
    background-color: #eef2f7;
  }
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #3a4255;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #7a8599;
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 30px;
`;

const ActionButton = styled.button<{ primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${props => props.primary ? '14px 30px' : '12px 25px'};
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.primary ? `
    background-color: #4a89dc;
    color: white;
    border: none;
    box-shadow: 0 5px 15px rgba(74, 137, 220, 0.2);
    
    &:hover {
      background-color: #3a6cad;
      transform: translateY(-2px);
      box-shadow: 0 7px 18px rgba(74, 137, 220, 0.25);
    }
  ` : `
    background-color: white;
    color: #4a89dc;
    border: 2px solid #d0e0ff;
    
    &:hover {
      border-color: #4a89dc;
      transform: translateY(-2px);
      box-shadow: 0 5px 12px rgba(0, 0, 0, 0.05);
    }
  `}
  
  i {
    font-size: 18px;
  }
`;

const ConfettiContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999;
`;

// 练习结果页面组件
const PracticeResultPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [score, setScore] = useState(0);
  const [formulaTitle, setFormulaTitle] = useState("体积公式");

  // 从URL参数中获取分数
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const scoreParam = searchParams.get('score');
    if (scoreParam) {
      setScore(parseInt(scoreParam, 10));
    }

    // 可以根据id从API获取公式信息
    // 这里简化处理，只设置一个标题
    if (id === "3") {
      setFormulaTitle("圆柱体积公式");
    }
  }, [location.search, id]);
  
  // 根据分数获取消息
  const getResultMessage = () => {
    if (score >= 80) return "太棒了！";
    if (score >= 60) return "做得不错！";
    return "继续努力！";
  };
  
  // 根据分数获取描述
  const getResultDescription = () => {
    if (score >= 80) {
      return "你对这个公式的理解非常好，继续保持这种学习状态！";
    }
    if (score >= 60) {
      return "你已经掌握了这个公式的基本应用，再多练习几次就能完全掌握了！";
    }
    return "不要灰心，公式的掌握需要反复练习，再尝试一次吧！";
  };
  
  // 计算其他统计数据
  const totalQuestions = 3; // 根据练习题实际数量修改
  const correctAnswers = Math.round((score / 100) * totalQuestions);
  const wrongAnswers = totalQuestions - correctAnswers;
  
  // 处理返回公式页面
  const handleBackToFormula = () => {
    navigate(`/formula/${id}`);
  };
  
  // 处理再次练习
  const handlePracticeAgain = () => {
    navigate(`/practice/${id}`);
  };
  
  // 处理查看解析（如果有）
  const handleViewAnalysis = () => {
    navigate(`/analysis/${id}`);
  };
  
  // 显示一些庆祝效果（高分时）
  const renderConfetti = () => {
    if (score >= 80) {
      return (
        <ConfettiContainer>
          {/* 这里可以添加confetti效果的实现，例如使用react-confetti库 */}
        </ConfettiContainer>
      );
    }
    return null;
  };
  
  return (
    <Container>
      {renderConfetti()}
      
      <BackButton onClick={handleBackToFormula}>
        <i className="fas fa-arrow-left"></i> {formulaTitle}
      </BackButton>
      
      <ResultCard>
        <ResultHeader>
          <ResultTitle>练习结果</ResultTitle>
          <div>看看你对{formulaTitle}的掌握程度</div>
        </ResultHeader>
        
        <ScoreSection>
          <ScoreCircle score={score}>
            <ScoreValue>{score}</ScoreValue>
            <ScoreLabel>分数</ScoreLabel>
          </ScoreCircle>
          
          <ResultMessage score={score}>
            {getResultMessage()}
          </ResultMessage>
          
          <ResultDescription>
            {getResultDescription()}
          </ResultDescription>
        </ScoreSection>
        
        <StatsSection>
          <StatCard>
            <StatValue>{totalQuestions}</StatValue>
            <StatLabel>总题数</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{correctAnswers}</StatValue>
            <StatLabel>正确</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{wrongAnswers}</StatValue>
            <StatLabel>错误</StatLabel>
          </StatCard>
        </StatsSection>
        
        <ButtonSection>
          <ActionButton onClick={handlePracticeAgain}>
            <i className="fas fa-redo-alt"></i> 再次练习
          </ActionButton>
          
          <ActionButton primary onClick={handleBackToFormula}>
            <i className="fas fa-book"></i> 返回学习
          </ActionButton>
        </ButtonSection>
      </ResultCard>
    </Container>
  );
};

export default PracticeResultPage; 
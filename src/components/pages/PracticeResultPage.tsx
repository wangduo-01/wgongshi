import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../common/Header';
import Button from '../common/Button';

// 样式化组件
const ResultContainer = styled.div`
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

const ResultContent = styled.div`
  text-align: center;
  padding: 20px;
  height: 100%;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ResultTitle = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 30px;
`;

const AccuracyCircleContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 30px;
`;

interface AccuracyCircleProps {
  percentage: number;
}

// 计算环形进度条的周长和偏移
const calculateCircleValues = (percentage: number) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return { radius, circumference, offset };
};

const AccuracyCircle = styled.div<AccuracyCircleProps>`
  position: relative;
  width: 150px;
  height: 150px;
  
  svg {
    transform: rotate(-90deg);
  }
  
  circle {
    stroke-width: 10;
    fill: transparent;
  }
  
  .background {
    stroke: ${props => props.theme.colors.background};
  }
  
  .progress {
    stroke: ${props => {
      const { percentage } = props;
      if (percentage >= 80) return props.theme.colors.accuracy.high;
      if (percentage >= 50) return props.theme.colors.accuracy.medium;
      return props.theme.colors.accuracy.low;
    }};
    stroke-dasharray: ${props => {
      const { circumference } = calculateCircleValues(props.percentage);
      return `${circumference} ${circumference}`;
    }};
    stroke-dashoffset: ${props => {
      const { offset } = calculateCircleValues(props.percentage);
      return offset;
    }};
    transition: stroke-dashoffset 0.5s ease;
  }
`;

const AccuracyText = styled.div<{ accuracy: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
  font-weight: bold;
  color: ${props => {
    const { accuracy } = props;
    if (accuracy >= 80) return props.theme.colors.accuracy.high;
    if (accuracy >= 50) return props.theme.colors.accuracy.medium;
    return props.theme.colors.accuracy.low;
  }};
`;

const ResultSummary = styled.div`
  font-size: 16px;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 40px;
`;

const ResultActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
`;

// 练习结果页面的传入数据接口
interface PracticeResultState {
  formulaId: string;
  answersCount: number;
  correctCount: number;
  accuracy: number;
  userAnswers: Record<string, string>;
}

/**
 * PracticeResultPage组件 - 显示练习完成后的结果
 * 
 * 功能：
 * - 显示正确率
 * - 显示答对/答错题目数量
 * - 提供继续练习和查看解析选项
 */
const PracticeResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PracticeResultState;
  
  // 如果没有结果数据，返回首页
  if (!state) {
    navigate('/');
    return null;
  }
  
  const { formulaId, answersCount, correctCount, accuracy } = state;
  
  // 处理继续练习
  const handleContinuePractice = () => {
    navigate(`/practice/${formulaId}`);
  };
  
  // 处理查看解析
  const handleViewAnalysis = () => {
    navigate('/analysis', { state });
  };
  
  // 使用SVG创建环形进度条
  const { radius } = calculateCircleValues(accuracy);
  
  return (
    <ResultContainer>
      <Header
        title="体积公式 - 练习结果"
        showBackButton
      />
      
      <ResultContent>
        <ResultTitle>本次练习完成！</ResultTitle>
        
        <AccuracyCircleContainer>
          <AccuracyCircle percentage={accuracy}>
            <svg width="150" height="150" viewBox="0 0 150 150">
              <circle className="background" cx="75" cy="75" r={radius} />
              <circle className="progress" cx="75" cy="75" r={radius} />
            </svg>
            <AccuracyText accuracy={accuracy}>{accuracy}%</AccuracyText>
          </AccuracyCircle>
        </AccuracyCircleContainer>
        
        <ResultSummary>
          共{answersCount}题，答对{correctCount}题，答错{answersCount - correctCount}题
        </ResultSummary>
        
        <ResultActions>
          <Button variant="secondary" onClick={handleContinuePractice}>
            继续练习
          </Button>
          <Button variant="primary" onClick={handleViewAnalysis}>
            查看解析
          </Button>
        </ResultActions>
      </ResultContent>
    </ResultContainer>
  );
};

export default PracticeResultPage; 
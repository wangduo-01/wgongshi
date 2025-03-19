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
  padding: 20px;
  overflow-y: auto;
  align-items: center;
`;

const ResultCard = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  margin-bottom: 20px;
`;

const ResultHeader = styled.div`
  background-color: #4a89dc;
  padding: 30px;
  color: white;
  text-align: center;
`;

const ResultTitle = styled.h2`
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
  const [fromPage, setFromPage] = useState<string>('home');

  // 从URL参数和location.state中获取分数和来源页面
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const scoreParam = searchParams.get('score');
    if (scoreParam) {
      setScore(parseInt(scoreParam, 10));
    }
    
    // 优先从location.state获取来源页面信息
    if (location.state && (location.state as any).fromPage) {
      console.log("从state中检测到来源页面:", (location.state as any).fromPage);
      setFromPage((location.state as any).fromPage);
    } else {
      // 如果state中没有，再从URL参数中获取
      const from = searchParams.get('from');
      if (from) {
        console.log("从URL参数中检测到来源页面:", from);
        setFromPage(from);
      } else {
        console.log("未检测到来源参数，使用默认值: home");
        setFromPage('home');
      }
    }

    // 可以根据id从API获取公式信息
    // 这里简化处理，只设置一个标题
    if (id === "3") {
      setFormulaTitle("圆柱体积公式");
    } else if (id === "4") {
      setFormulaTitle("勾股定理");
    }
    
    // 更新公式的lastPracticed属性和accuracy值
    if (id) {
      console.log(`更新公式ID:${id}的练习记录，准确率:${scoreParam}%`);
      
      // 在实际项目中，这里应该调用API更新服务器上的数据
      // 这里仅在本地存储中更新
      
      // 1. 为当前公式设置lastPracticed为当前时间
      const formulaLastPracticedKey = `formula_lastPracticed_${id}`;
      localStorage.setItem(formulaLastPracticedKey, new Date().toISOString());
      
      // 2. 更新公式准确率
      if (scoreParam) {
        const formulaAccuracyKey = `formula_accuracy_${id}`;
        localStorage.setItem(formulaAccuracyKey, scoreParam);
      }
      
      // 3. 尝试更新ALL_FORMULAS数组中的对应公式（在下次回到首页时会被读取）
      try {
        // 获取公式元数据
        const formulaMetadata = {
          id,
          lastPracticed: new Date(),
          accuracy: parseInt(scoreParam || "0", 10)
        };
        
        // 保存到localStorage，以便HomePage可以读取
        localStorage.setItem('lastPracticedFormulaData', JSON.stringify(formulaMetadata));
        
        console.log(`已保存公式练习记录:`, formulaMetadata);
      } catch (error) {
        console.error('保存公式练习记录时出错:', error);
      }
    }
  }, [location.search, location.state, id]);
  
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
  
  // 处理返回公式页面，根据来源决定行为
  const handleBackToFormula = () => {
    console.log("结果页返回按钮点击，来源页面:", fromPage);
    
    if (fromPage === 'formula') {
      // 如果是从公式详情页来的，返回公式详情页
      console.log("从公式详情页来，返回到公式详情页");
      navigate(`/formula/${id}?from=${fromPage}`);
    } else if (fromPage === 'favorites') {
      // 如果是从收藏弹窗来的，返回首页并设置标记打开收藏弹窗
      console.log("从收藏弹窗来，返回首页并设置标记");
      sessionStorage.setItem('openFavoritesModalDirectly', 'true');
      navigate('/');
    } else if (fromPage === 'record') {
      // 如果是从记录页面来的，返回记录页面
      console.log("从记录页面来，返回到记录页面");
      navigate('/record');
    } else {
      // 默认返回首页
      console.log("从其他页面来，返回首页");
      navigate('/');
    }
  };
  
  // 处理再次练习，保留来源页面信息
  const handlePracticeAgain = () => {
    console.log("点击再次练习按钮，保留来源:", fromPage);
    navigate(`/practice/${id}?from=${fromPage}`);
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
      
      <Header>
        <BackButton onClick={handleBackToFormula}>
          <i className="fas fa-arrow-left"></i>
        </BackButton>
        <HeaderTitle>{formulaTitle} - 练习结果</HeaderTitle>
      </Header>
      
      <ContentContainer>
        <ResultCard>
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
      </ContentContainer>
    </Container>
  );
};

export default PracticeResultPage; 
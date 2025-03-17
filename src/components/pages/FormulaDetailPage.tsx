import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPrint, faChevronLeft, faChevronRight, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import Header from '../common/Header';
import Button from '../common/Button';

// 样式化组件
const DetailContainer = styled.div`
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
  
  ${props => props.theme.mediaQueries.tablet} {
    height: auto;
  }
`;

const DetailContent = styled.div`
  display: flex;
  height: calc(100% - 70px);
  margin-top: 15px;
  
  ${props => props.theme.mediaQueries.mobile} {
    flex-direction: column;
    height: auto;
  }
`;

const FormulaDetail = styled.div`
  flex: 1;
  padding: 15px;
  border-right: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  
  ${props => props.theme.mediaQueries.mobile} {
    border-right: none;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    padding-bottom: 20px;
  }
`;

const ExampleDetail = styled.div`
  flex: 1;
  padding: 15px;
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

const NavButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const NavButton = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${props => props.theme.colors.primary};
  font-size: 14px;
  cursor: pointer;
  
  &:disabled {
    color: ${props => props.theme.colors.text.light};
    cursor: not-allowed;
  }
`;

const FormulaTitle = styled.div`
  font-size: 16px;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 10px;
`;

const FormulaContent = styled.div`
  font-size: 24px;
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
  margin: 30px 0;
  font-weight: 500;
`;

const RelatedFormulas = styled.div`
  margin-top: 15px;
`;

const RelatedTitle = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 5px;
`;

const RelatedList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const RelatedItem = styled.div`
  background-color: ${props => props.theme.colors.card};
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 12px;
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const ExampleItem = styled.div`
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ExampleTitle = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 5px;
`;

const ExampleContent = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.primary};
  line-height: 1.5;
`;

const RightActionButton = styled.div`
  cursor: pointer;
  color: ${props => props.color || props.theme.colors.text.secondary};
`;

// 模拟公式数据
const FORMULA_DATA = {
  id: '3',
  title: '圆柱体积公式',
  content: 'V = πr²h',
  accuracy: 25,
  isFavorite: true,
  lowerFormulas: [{ id: 'l1', title: '圆的面积' }],
  higherFormulas: [
    { id: 'h1', title: '圆锥体积' },
    { id: 'h2', title: '球体积' },
  ],
  examples: [
    {
      id: 'e1',
      title: '例题1',
      content: '一个圆柱形水箱，底面半径为2米，高为3米，求这个水箱的容积。',
    },
    {
      id: 'e2',
      title: '解析',
      content: '根据圆柱体积公式 V = πr²h\n代入数据：r = 2米，h = 3米\nV = 3.14 × 2² × 3 = 3.14 × 4 × 3 = 37.68(立方米)',
    },
  ],
};

/**
 * FormulaDetailPage组件 - 显示公式的详细信息
 * 
 * 功能：
 * - 展示公式名称和内容
 * - 显示相关公式（低阶和高阶）
 * - 展示例题和解析
 * - 支持收藏功能
 * - 支持打印功能
 * - 支持前后导航
 * - 提供练习入口
 */
const FormulaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formula, setFormula] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // 在实际应用中，这里应该从API获取数据
  useEffect(() => {
    // 模拟API请求
    setTimeout(() => {
      setFormula(FORMULA_DATA);
      setIsFavorite(FORMULA_DATA.isFavorite);
    }, 100);
  }, [id]);

  // 处理收藏点击
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    // 在实际应用中，这里应该调用API保存收藏状态
  };

  // 处理打印点击
  const handlePrintClick = () => {
    navigate('/print', { state: { formulaId: id } });
  };

  // 处理练习点击
  const handlePracticeClick = () => {
    navigate(`/practice/${id}`);
  };

  // 处理上一个/下一个导航
  const handlePrevious = () => {
    // 在实际应用中，这里应该导航到上一个公式
    console.log('Navigate to previous formula');
  };

  const handleNext = () => {
    // 在实际应用中，这里应该导航到下一个公式
    console.log('Navigate to next formula');
  };

  // 处理相关公式点击
  const handleRelatedFormulaClick = (relatedId: string) => {
    navigate(`/formula/${relatedId}`);
  };

  // 如果公式数据尚未加载，显示加载中...
  if (!formula) {
    return (
      <DetailContainer>
        <Header
          title="加载中..."
          showBackButton
          showRightActions
        />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          加载中...
        </div>
      </DetailContainer>
    );
  }

  // 右侧操作按钮
  const rightIcons = [
    { 
      icon: isFavorite ? faStar : faStarRegular, 
      color: isFavorite ? '#ff9500' : '#666',
      action: handleFavoriteToggle 
    },
    { 
      icon: faPrint, 
      color: '#666',
      action: handlePrintClick 
    },
  ];

  return (
    <DetailContainer>
      <Header
        title={formula.title}
        showBackButton
        showRightActions
        rightIcons={rightIcons}
      />
      
      <DetailContent>
        <FormulaDetail>
          <NavButtons>
            <NavButton onClick={handlePrevious}>
              <FontAwesomeIcon icon={faChevronLeft} /> 上一个
            </NavButton>
            <NavButton onClick={handleNext}>
              下一个 <FontAwesomeIcon icon={faChevronRight} />
            </NavButton>
          </NavButtons>
          
          <FormulaTitle>{formula.title}</FormulaTitle>
          <FormulaContent>{formula.content}</FormulaContent>
          
          {formula.lowerFormulas && formula.lowerFormulas.length > 0 && (
            <RelatedFormulas>
              <RelatedTitle>低阶公式</RelatedTitle>
              <RelatedList>
                {formula.lowerFormulas.map((related: any) => (
                  <RelatedItem key={related.id} onClick={() => handleRelatedFormulaClick(related.id)}>
                    {related.title}
                  </RelatedItem>
                ))}
              </RelatedList>
            </RelatedFormulas>
          )}
          
          {formula.higherFormulas && formula.higherFormulas.length > 0 && (
            <RelatedFormulas>
              <RelatedTitle>高阶公式</RelatedTitle>
              <RelatedList>
                {formula.higherFormulas.map((related: any) => (
                  <RelatedItem key={related.id} onClick={() => handleRelatedFormulaClick(related.id)}>
                    {related.title}
                  </RelatedItem>
                ))}
              </RelatedList>
            </RelatedFormulas>
          )}
        </FormulaDetail>
        
        <ExampleDetail>
          {formula.examples && formula.examples.map((example: any) => (
            <ExampleItem key={example.id}>
              <ExampleTitle>{example.title}</ExampleTitle>
              <ExampleContent>
                {example.content.split('\n').map((line: string, index: number) => (
                  <div key={index}>{line}</div>
                ))}
              </ExampleContent>
            </ExampleItem>
          ))}
          
          <Button 
            icon={faPencilAlt}
            onClick={handlePracticeClick}
          >
            练一练
          </Button>
        </ExampleDetail>
      </DetailContent>
    </DetailContainer>
  );
};

export default FormulaDetailPage; 
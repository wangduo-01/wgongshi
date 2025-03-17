import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import Header from '../common/Header';
import FormulaCard from '../common/FormulaCard';

// 样式化组件
const FavoriteContainer = styled.div`
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

const FormulaGridContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
  margin-top: 15px;
  
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

const FormulaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  
  ${props => props.theme.mediaQueries.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
  
  ${props => props.theme.mediaQueries.mobile} {
    grid-template-columns: 1fr;
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

// 模拟收藏的公式数据
const FAVORITE_FORMULAS = [
  {
    id: '1',
    title: '周长公式',
    content: 'C = 2πr',
    accuracy: 90,
    isFavorite: true,
  },
  {
    id: '2',
    title: '面积公式',
    content: 'S = πr²',
    accuracy: 65,
    isFavorite: true,
  },
  {
    id: '3',
    title: '体积公式',
    content: 'V = πr²h',
    accuracy: 25,
    isFavorite: true,
  },
  {
    id: '5',
    title: '勾股定理',
    content: 'a² + b² = c²',
    accuracy: 70,
    isFavorite: true,
  },
];

/**
 * FavoritePage组件 - 显示用户收藏的公式
 * 
 * 功能：
 * - 展示收藏的公式列表
 * - 支持取消收藏
 * - 支持进入公式详情
 * - 支持打印收藏的公式
 */
const FavoritePage: React.FC = () => {
  const navigate = useNavigate();
  const [favoriteFormulas, setFavoriteFormulas] = useState<any[]>([]);
  
  // 在实际应用中，这里应该从API获取数据
  useEffect(() => {
    // 模拟API请求
    setTimeout(() => {
      setFavoriteFormulas(FAVORITE_FORMULAS);
    }, 100);
  }, []);
  
  // 处理公式卡片点击
  const handleFormulaClick = (formula: any) => {
    navigate(`/formula/${formula.id}`);
  };
  
  // 处理收藏切换
  const handleFavoriteToggle = (id: string) => {
    setFavoriteFormulas(favoriteFormulas.filter(f => f.id !== id));
    // 在实际应用中，这里应该调用API保存收藏状态
  };
  
  // 处理练习点击
  const handlePracticeClick = (formula: any) => {
    navigate(`/practice/${formula.id}`);
  };
  
  // 处理打印点击
  const handlePrintClick = () => {
    navigate('/print', { state: { type: 'favorites' } });
  };
  
  // 右侧操作按钮
  const rightIcons = [
    { 
      icon: faPrint, 
      color: '#666',
      action: handlePrintClick 
    },
  ];
  
  return (
    <FavoriteContainer>
      <Header
        title="我的收藏"
        showBackButton
        showRightActions
        rightIcons={rightIcons}
      />
      
      <FormulaGridContainer>
        {favoriteFormulas.length > 0 ? (
          <FormulaGrid>
            {favoriteFormulas.map(formula => (
              <FormulaCard
                key={formula.id}
                title={formula.title}
                content={formula.content}
                accuracy={formula.accuracy}
                isFavorite={formula.isFavorite}
                onFavoriteToggle={() => handleFavoriteToggle(formula.id)}
                onPracticeClick={() => handlePracticeClick(formula)}
                onClick={() => handleFormulaClick(formula)}
              />
            ))}
          </FormulaGrid>
        ) : (
          <EmptyState>
            <p>您还没有收藏任何公式</p>
            <p>浏览公式时，点击星标可将公式添加到收藏</p>
          </EmptyState>
        )}
      </FormulaGridContainer>
    </FavoriteContainer>
  );
};

export default FavoritePage; 
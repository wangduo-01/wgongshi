import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FormulaCard from './FormulaCard';
import PrintComponent from './PrintComponent';

// 弹窗相关样式
const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, ${({ isOpen }) => (isOpen ? '0.6' : '0')});
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(${({ isOpen }) => (isOpen ? '3px' : '0px')});
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
`;

const ModalContainer = styled.div<{ isOpen: boolean }>`
  background-color: white;
  border-radius: 16px;
  padding: 0;
  width: 90%;
  max-width: 90vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  transform: ${({ isOpen }) => isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)'};
  opacity: ${({ isOpen }) => isOpen ? '1' : '0'};
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), 
              opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 15px 0;
  background-color: #4a89dc;
  border-radius: 16px 16px 0 0;
  flex-shrink: 0;
`;

const ModalTitle = styled.h2`
  font-size: 22px;
  color: white;
  font-weight: 600;
  margin: 0;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 25px;
  color: white;
  cursor: pointer;
  
  &:hover {
    color: #e6e6e6;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 24px 24px;
  
  /* 添加自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #c1c1c1;
  }
`;

// 添加一个新的容器组件，用于将标签和打印按钮放在同一行
const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 24px;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid #eee;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Tab = styled.div<{ active: boolean }>`
  padding: 15px 25px;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  font-size: 18px;
  color: ${props => props.active ? '#4a89dc' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${props => props.active ? '#4a89dc' : 'transparent'};
    transition: background-color 0.2s;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
  min-height: 300px;
  margin: 40px 0;
  text-align: center;
  
  i {
    font-size: 60px;
    margin-bottom: 20px;
    color: #ddd;
  }
  
  div {
    font-size: 18px;
    line-height: 1.6;
  }
`;

const FormulaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 15px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

// 将Formula接口保留下来，但在最后我们会在FavoritesModalProps里添加searchQuery属性
interface Formula {
  id: string;
  title: string;
  content: string;
  accuracy: number;
  isFavorite: boolean;
  subject: string;
  level: string;
  lastPracticed?: Date;
  favoriteTimestamp?: number;
}

// 定义接收的props
interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteFormulas: Formula[];
  onFavoriteToggle: (id: string) => void;
  onPracticeClick: (formula: Formula) => void;
  onFormulaClick: (formula: Formula) => void;
  onPrintClick: () => void;
  searchQuery?: string; // 添加搜索关键字属性
}

const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favoriteFormulas,
  onFavoriteToggle,
  onPracticeClick,
  onFormulaClick,
  onPrintClick,
  searchQuery
}) => {
  // 分类标签状态
  const [activeFilter, setActiveFilter] = React.useState('all');
  
  // 点击公式时的处理函数
  const handleFormulaClick = (formula: Formula) => {
    // 设置标记，表示是从收藏弹窗进入公式详情页
    sessionStorage.setItem('fromFavoritesModal', 'true');
    
    // 调用父组件传递的回调函数
    onFormulaClick(formula);
  };
  
  // 根据分类过滤公式
  const filteredFormulas = React.useMemo(() => {
    // 首先按照收藏时间戳倒序排序
    const sortedFormulas = [...favoriteFormulas].sort((a, b) => {
      // 如果两个公式都有收藏时间戳，按时间倒序排序（最新的在前面）
      if (a.favoriteTimestamp && b.favoriteTimestamp) {
        return b.favoriteTimestamp - a.favoriteTimestamp;
      }
      // 如果只有a有时间戳，a排在前面
      if (a.favoriteTimestamp) return -1;
      // 如果只有b有时间戳，b排在前面
      if (b.favoriteTimestamp) return 1;
      // 如果都没有时间戳，按照id排序
      return Number(a.id) - Number(b.id);
    });
    
    // 然后按照分类过滤
    if (activeFilter === 'all') {
      return sortedFormulas;
    }
    return sortedFormulas.filter(formula => formula.subject === activeFilter);
  }, [favoriteFormulas, activeFilter]);

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer isOpen={isOpen} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>我的收藏</ModalTitle>
          <CloseButton onClick={onClose}>
            <i className="fas fa-times"></i>
          </CloseButton>
        </ModalHeader>
        
        <ContentArea>
          {/* 将标签和打印按钮放在同一行 */}
          <ActionRow>
            <TabsContainer>
              <Tab 
                active={activeFilter === 'all'} 
                onClick={() => setActiveFilter('all')}
              >
                全部 ({favoriteFormulas.length})
              </Tab>
              <Tab 
                active={activeFilter === 'math'} 
                onClick={() => setActiveFilter('math')}
              >
                数学 ({favoriteFormulas.filter(f => f.subject === 'math').length})
              </Tab>
              <Tab 
                active={activeFilter === 'physics'} 
                onClick={() => setActiveFilter('physics')}
              >
                物理 ({favoriteFormulas.filter(f => f.subject === 'physics').length})
              </Tab>
              <Tab 
                active={activeFilter === 'chemistry'} 
                onClick={() => setActiveFilter('chemistry')}
              >
                化学 ({favoriteFormulas.filter(f => f.subject === 'chemistry').length})
              </Tab>
            </TabsContainer>
            
            {filteredFormulas.length > 0 && (
              <PrintComponent 
                type="favorite" 
                beforePrint={onPrintClick}
              />
            )}
          </ActionRow>
          
          {filteredFormulas.length === 0 ? (
            <EmptyState>
              <i className="far fa-star"></i>
              <div>
                {activeFilter === 'all' && '暂无收藏的公式，快去收藏喜欢的公式吧！'}
                {activeFilter === 'math' && '暂无收藏的数学公式，快去收藏喜欢的数学公式吧！'}
                {activeFilter === 'physics' && '暂无收藏的物理公式，快去收藏喜欢的物理公式吧！'}
                {activeFilter === 'chemistry' && '暂无收藏的化学公式，快去收藏喜欢的化学公式吧！'}
              </div>
            </EmptyState>
          ) : (
            <FormulaGrid>
              {filteredFormulas.map(formula => (
                <FormulaCard
                  key={formula.id}
                  title={formula.title}
                  content={formula.content}
                  accuracy={formula.accuracy}
                  isFavorite={formula.isFavorite}
                  onFavoriteToggle={() => onFavoriteToggle(formula.id)}
                  onPracticeClick={() => onPracticeClick(formula)}
                  onClick={() => handleFormulaClick(formula)}
                  searchQuery={searchQuery}
                />
              ))}
            </FormulaGrid>
          )}
        </ContentArea>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default FavoritesModal; 
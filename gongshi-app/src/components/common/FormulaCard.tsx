import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import FormulaVisualization from './FormulaVisualization';

interface FormulaCardProps {
  title: string;
  content: string;
  accuracy: number;
  isFavorite: boolean;
  isLastPracticed?: boolean;
  searchQuery?: string;
  onClick: () => void;
  onFavoriteToggle: () => void;
  onPracticeClick: () => void;
}

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 10px 15px;
  box-shadow: 0 0 35px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  height: 180px;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.09);
  }
`;

// 使内容在背景之上显示
const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  flex-wrap: nowrap;
  overflow: hidden;
`;

const Title = styled.div`
  font-size: 20px;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
`;

const Content = styled.div`
  font-size: 30px;
  color: #000;
  text-align: center;
  padding: 20px 0;
  font-family: 'Times New Roman', Times, serif;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
`;

const MultiLineContent = styled.div`
  font-size: 24px;
  color: #000;
  text-align: center;
  padding: 0;
  font-family: 'Times New Roman', Times, serif;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  max-width: 100%;
  margin: 0 auto;
  
  & > div {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
    max-height: 85px;
    text-align: center;
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 5px;
  padding-top: 5px;
  height: 30px;
  position: relative;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  font-size: 24px;
  padding: 3px 10px;
  transition: all 0.2s;
  border-radius: 8px;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background-color: #f9f9f9;
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const StarButton = styled(ActionButton) <{ active: boolean }>`
  color: ${props => props.active ? '#ff9500' : '#ccc'};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  position: relative;
  
  &:hover {
    color: #ff9500;
    background-color: #f9f9f9;
  }
  
  i {
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

// 上次练习标签组件
const LastPracticedBadge = styled.div`
  font-size: 13px;
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  background-color: #4a89dc;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 4px rgba(74, 137, 220, 0.3);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 2px 4px rgba(74, 137, 220, 0.3);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 3px 6px rgba(74, 137, 220, 0.4);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 2px 4px rgba(74, 137, 220, 0.3);
    }
  }

  &::before {
    content: '⏱';
    font-size: 14px;
    margin-right: 2px;
  }
`;

// 恢复AccuracyBadgeProps接口
interface AccuracyBadgeProps {
  accuracy: number;
}

// 重新添加练习正确率标签组件，但移到公式标题旁
const AccuracyBadge = styled.span<AccuracyBadgeProps>`
  font-size: 12px;
  font-weight: 400;
  padding: 2px 8px;
  border-radius: 6px;
  white-space: nowrap;
  flex-shrink: 0;
  background-color: ${props => {
    if (props.accuracy >= 80) return 'rgba(76, 217, 100, 0.15)';
    if (props.accuracy >= 50) return 'rgba(255, 149, 0, 0.15)';
    return 'rgba(255, 59, 48, 0.15)';
  }};
  color: ${props => {
    if (props.accuracy >= 80) return '#388e3c';
    if (props.accuracy >= 50) return '#cb7200';
    return '#c41e25';
  }};
  border: 1px solid ${props => {
    if (props.accuracy >= 80) return 'rgba(76, 217, 100, 0.2)';
    if (props.accuracy >= 50) return 'rgba(255, 149, 0, 0.2)';
    return 'rgba(255, 59, 48, 0.2)';
  }};
`;

// 添加高亮文本的样式组件
const HighlightedText = styled.span`
  color: #e53935;
  font-weight: 500;
`;

// 为FormulaVisualization添加样式
const StyledFormulaVisualization = styled(FormulaVisualization)`
  position: absolute;
  top: 10px;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.6;
  transition: opacity 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.85) 0%,
      rgba(255, 255, 255, 0.75) 25%,
      rgba(255, 255, 255, 0.65) 50%,
      rgba(255, 255, 255, 0.75) 75%,
      rgba(255, 255, 255, 0.85) 100%
    );
    pointer-events: none;
  }
  
  ${Card}:hover & {
    opacity: 0.7;
  }
`;

const FormulaCard: React.FC<FormulaCardProps> = ({
  title,
  content,
  accuracy,
  isFavorite,
  isLastPracticed,
  searchQuery,
  onClick,
  onFavoriteToggle,
  onPracticeClick
}) => {
  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('button')) {
      onClick && onClick();
    }
  };

  // 高亮显示搜索关键字的函数
  const highlightSearchQuery = (text: string): React.ReactNode => {
    if (!searchQuery || searchQuery.trim() === '') {
      return text;
    }

    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, index) => {
      if (part.toLowerCase() === searchQuery.toLowerCase()) {
        return <HighlightedText key={index}>{part}</HighlightedText>;
      }
      return part;
    });
  };

  // 根据可用空间动态截断标题
  const getTruncatedTitle = (text: string): string => {
    // 计算标题最大长度
    let maxLength = 8; // 默认情况下的最大长度
    
    // 根据标签数量调整标题长度
    if (accuracy > 0 && isLastPracticed) {
      // 如果同时有正确率和上次练习标签，标题长度最多5个字
      maxLength = 5;
    } else if (accuracy > 0 || isLastPracticed) {
      // 如果只有一个标签，标题长度最多6个字
      maxLength = 6;
    }
    
    // 检查标题是否需要截断
    if (text.length <= maxLength) {
      return text; // 标题足够短，不需要截断
    }
    
    // 需要截断
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card onClick={handleCardClick} className="formula-card">
      <StyledFormulaVisualization formulaTitle={title} />
      
      <ContentWrapper>
        <TitleContainer>
          <TitleGroup>
            <Title title={title}>
              {highlightSearchQuery(getTruncatedTitle(title))}
            </Title>
            {isLastPracticed && (
              <LastPracticedBadge>上次练习</LastPracticedBadge>
            )}
            {accuracy > 0 && (
              <AccuracyBadge accuracy={accuracy}>正确率：{accuracy}%</AccuracyBadge>
            )}
          </TitleGroup>
          <StarButton
            active={isFavorite}
            onClick={(e) => handleActionClick(e, onFavoriteToggle)}
          >
            <i className={isFavorite ? 'fas fa-star' : 'far fa-star'} />
          </StarButton>
        </TitleContainer>
        
        <MultiLineContent title={content}>
          <div>{highlightSearchQuery(content)}</div>
        </MultiLineContent>
        
        <CardFooter>
          <ActionButton onClick={(e) => handleActionClick(e, onPracticeClick)}>
            <span style={{ color: '#4a89dc', fontSize: '16px' }}>练一练</span>
          </ActionButton>
        </CardFooter>
      </ContentWrapper>
    </Card>
  );
};

export default FormulaCard; 
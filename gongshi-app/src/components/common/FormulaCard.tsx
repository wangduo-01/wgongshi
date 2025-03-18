import React from 'react';
import styled from 'styled-components';

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
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.09);
  }
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
`;

const Title = styled.div`
  font-size: 20px;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
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
  font-size: 26px;
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
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
  background-color: rgba(74, 137, 220, 0.15);
  color: #4a89dc;
  border: 1px solid rgba(74, 137, 220, 0.2);
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

  return (
    <Card onClick={handleCardClick}>
      <TitleContainer>
        <TitleGroup>
          <Title>
            {highlightSearchQuery(title)}
            {accuracy > 0 && (
              <AccuracyBadge accuracy={accuracy}>正确率：{accuracy}%</AccuracyBadge>
            )}
          </Title>
          {isLastPracticed && (
            <LastPracticedBadge>上次练习</LastPracticedBadge>
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
    </Card>
  );
};

export default FormulaCard; 
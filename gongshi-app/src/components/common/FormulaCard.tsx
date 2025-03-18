import React from 'react';
import styled from 'styled-components';

interface FormulaCardProps {
  title: string;
  content: string;
  accuracy: number;
  isFavorite: boolean;
  onClick: () => void;
  onFavoriteToggle: () => void;
  onPracticeClick: () => void;
}

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 10px 15px;
  box-shadow: 0 0 35px rgba(0, 0, 0, 0.05);
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
`;

const Title = styled.div`
  font-size: 20px;
  color: #333;
  font-weight: 500;
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
    max-height: 90px;
    text-align: center;
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  margin-top: 0;
  padding-top: 0;
  height: 30px;
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

interface AccuracyBadgeProps {
  accuracy: number;
}

const AccuracyBadge = styled.div<AccuracyBadgeProps>`
  color: white;
  font-size: 14px;
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: ${props => {
    if (props.accuracy >= 80) return '#4cd964';
    if (props.accuracy >= 50) return '#ff9500';
    return '#ff3b30';
  }};
`;

const FormulaCard: React.FC<FormulaCardProps> = ({
  title,
  content,
  accuracy,
  isFavorite,
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

  return (
    <Card onClick={handleCardClick}>
      <TitleContainer>
        <TitleGroup>
          <Title>{title}</Title>
          {accuracy > 0 && (
            <AccuracyBadge accuracy={accuracy}>{accuracy}%</AccuracyBadge>
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
        <div>{content}</div>
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
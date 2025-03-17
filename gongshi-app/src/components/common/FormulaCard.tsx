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
  padding: 25px 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.09);
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
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
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: end;
  margin-top: 15px;
  padding-top: 10px;
  // border-top: 1px solid #f5f5f5;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  font-size: 24px;
  padding: 5px 10px;
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
  margin-left: 10px;
  flex: 1;
  text-align: left;
  &:hover {
    color: #ff9500;
  }
`;

interface AccuracyBadgeProps {
  accuracy: number;
}

const AccuracyBadge = styled.div<AccuracyBadgeProps>`
  position: absolute;
  top: 12px;
  right: 12px;
  color: white;
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 20px;
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
      <AccuracyBadge accuracy={accuracy}>{accuracy}%</AccuracyBadge>
      
      <TitleContainer>
        <Title>{title}</Title>
        <StarButton
          active={isFavorite}
          onClick={(e) => handleActionClick(e, onFavoriteToggle)}
        >
          <i className={isFavorite ? 'fas fa-star' : 'far fa-star'} />
        </StarButton>
      </TitleContainer>
      
      <Content>{content}</Content>
      <CardFooter>
        <ActionButton onClick={(e) => handleActionClick(e, onPracticeClick)}>
          <span style={{ color: '#4a89dc' }}>练一练</span>
        </ActionButton>
      </CardFooter>
    </Card>
  );
};

export default FormulaCard; 
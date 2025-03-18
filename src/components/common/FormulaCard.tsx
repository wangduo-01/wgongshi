import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarRegular, faPencilAlt as faPencilAltRegular } from '@fortawesome/free-regular-svg-icons';
import { faStar, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

// FormulaCard组件的属性接口
interface FormulaCardProps {
  title: string;
  content: string;
  accuracy: number;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onPracticeClick?: () => void;
  onClick?: () => void;
}

// 样式化组件
const CardContainer = styled.div`
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 16px;
  position: relative;
  border: 1px solid ${props => props.theme.colors.border};
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: ${props => props.theme.shadows.small};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

interface AccuracyBadgeProps {
  level: 'high' | 'medium' | 'low';
}

const getAccuracyLevel = (accuracy: number): 'high' | 'medium' | 'low' => {
  if (accuracy >= 80) return 'high';
  if (accuracy >= 50) return 'medium';
  return 'low';
};

const AccuracyBadge = styled.div<AccuracyBadgeProps>`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${props => {
    switch (props.level) {
      case 'high': return props.theme.colors.accuracy.high;
      case 'medium': return props.theme.colors.accuracy.medium;
      case 'low': return props.theme.colors.accuracy.low;
      default: return props.theme.colors.accuracy.medium;
    }
  }};
  color: white;
  border-radius: 12px;
  padding: 3px 8px;
  font-size: 12px;
  font-weight: 500;
`;

const FormulaTitle = styled.div`
  font-size: 15px;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 5px;
  font-weight: 500;
  padding-right: 50px; /* 为准确率徽章留出空间 */
`;

const FormulaContent = styled.div`
  font-size: 22px;
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
  margin: 15px 0;
  font-weight: 500;
  padding: 12px 8px;
  background-color: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.small};
  box-shadow: ${props => props.theme.shadows.small} inset;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const IconButton = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 5px;
  border-radius: 50%;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.secondary};
  }
`;

/**
 * FormulaCard组件 - 展示公式卡片
 * 
 * 功能:
 * - 显示公式标题和内容
 * - 显示掌握程度(准确率)
 * - 支持收藏功能
 * - 支持练习功能
 * - 点击进入详情
 */
const FormulaCard: React.FC<FormulaCardProps> = ({
  title,
  content,
  accuracy,
  isFavorite = false,
  onFavoriteToggle,
  onPracticeClick,
  onClick,
}) => {
  // 确定准确率级别（高、中、低）
  const accuracyLevel = getAccuracyLevel(accuracy);
  
  // 阻止事件冒泡，以便图标按钮的点击不会触发卡片的onClick
  const handleActionClick = (e: React.MouseEvent, callback?: () => void) => {
    e.stopPropagation();
    if (callback) callback();
  };
  
  return (
    <CardContainer onClick={onClick}>
      <AccuracyBadge level={accuracyLevel}>{accuracy}%</AccuracyBadge>
      <FormulaTitle>{title}</FormulaTitle>
      <FormulaContent>{content}</FormulaContent>
      <CardActions>
        <IconButton onClick={(e) => handleActionClick(e, onFavoriteToggle)}>
          <FontAwesomeIcon icon={isFavorite ? faStar : faStarRegular} style={{ color: isFavorite ? '#ff9500' : 'inherit' }} />
        </IconButton>
        <IconButton onClick={(e) => handleActionClick(e, onPracticeClick)}>
          <FontAwesomeIcon icon={faPencilAlt} />
        </IconButton>
      </CardActions>
    </CardContainer>
  );
};

export default FormulaCard; 
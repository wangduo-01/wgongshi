import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChevronDown, faSearch, faStar, faBook, faUser, faPrint } from '@fortawesome/free-solid-svg-icons';

// Header 组件的属性接口
interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showGradeSelector?: boolean;
  showRightActions?: boolean;
  rightIcons?: Array<{
    icon: any;
    color: string;
    action?: () => void;
  }>;
  onBackClick?: () => void;
}

// 样式化组件
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  margin-top: 15px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  width: 100%;
`;

const BackButton = styled.div`
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.colors.text.primary};
`;

const RightActions = styled.div`
  display: flex;
  gap: 15px;
`;

const IconButton = styled.div`
  cursor: pointer;
`;

const GradeSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 20px;
`;

const GradeText = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
`;

const GradeValue = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.text.primary};
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

/**
 * Header组件 - 应用顶部导航栏
 * 
 * 支持以下功能:
 * - 显示标题
 * - 返回按钮
 * - 学段选择器
 * - 右侧操作图标 (搜索、收藏、错题本、用户等)
 */
const Header = ({
  title,
  showBackButton = false,
  showGradeSelector = false,
  showRightActions = false,
  rightIcons = [],
  onBackClick
}: HeaderProps) => {
  const navigate = useNavigate();

  // 返回按钮点击处理
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1); // 默认返回上一页
    }
  };

  // 默认右侧图标配置
  const defaultRightIcons = [
    { icon: faSearch, color: '#666', action: () => {} },
    { icon: faStar, color: '#ff9500', action: () => {} },
    { icon: faBook, color: '#4a89dc', action: () => {} },
    { icon: faUser, color: '#666', action: () => {} }
  ];

  // 实际使用的图标，如果未提供则使用默认图标
  const iconsToShow = rightIcons.length > 0 ? rightIcons : defaultRightIcons;

  return (
    <HeaderContainer>
      {showBackButton ? (
        <BackButton onClick={handleBackClick}>
          <FontAwesomeIcon icon={faArrowLeft} /> 返回
        </BackButton>
      ) : (
        <Title>{title}</Title>
      )}

      {!showBackButton && showGradeSelector && (
        <GradeSelector>
          <GradeText>当前学段：</GradeText>
          <GradeValue>
            小学 <FontAwesomeIcon icon={faChevronDown} />
          </GradeValue>
        </GradeSelector>
      )}

      {!showBackButton && !showGradeSelector && <Title>{title}</Title>}

      {showRightActions && (
        <RightActions>
          {iconsToShow.map((item, index) => (
            <IconButton key={index} onClick={item.action}>
              <FontAwesomeIcon icon={item.icon} style={{ color: item.color }} />
            </IconButton>
          ))}
        </RightActions>
      )}
    </HeaderContainer>
  );
};

export default Header; 
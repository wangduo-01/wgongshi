import React from 'react';
import styled from 'styled-components';

// 接口定义
export interface HeaderProps {
  title: string;
  gradeText?: string;
  showBackButton?: boolean;
  showGradeSelector?: boolean;
  showRightActions?: boolean;
  onBack?: () => void;
  onGradeSelectorClick?: () => void;
  onSearchClick?: () => void;
  onFavoritesClick?: () => void;
  onErrorBookClick?: () => void;
  onRecordsClick?: () => void;
}

// 样式化组件
const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
  margin-bottom: 0;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  padding: 8px 15px;
  border-radius: 8px;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  color: white;
`;

const GradeSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  margin-left: 15px;
`;

const ChevronIcon = styled.i`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 22px;
  color: white;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const BackButton = styled(ActionButton)`
  font-size: 18px;
  margin-right: 5px;
`;

/**
 * Header组件 - 应用顶部导航栏
 * 
 * 功能：
 * - 显示标题
 * - 支持返回按钮
 * - 支持学段/年级选择器
 * - 支持搜索、收藏、错题本和记录按钮
 */
const Header: React.FC<HeaderProps> = ({
  title,
  gradeText,
  showBackButton = false,
  showGradeSelector = false,
  showRightActions = false,
  onBack,
  onGradeSelectorClick,
  onSearchClick,
  onFavoritesClick,
  onErrorBookClick,
  onRecordsClick
}) => {
  // 从title中提取学段信息
  const extractGradeFromTitle = (title: string): string => {
    const gradeMatch = title.match(/^(小学|初中|高中)/);
    return gradeMatch ? gradeMatch[0] : '小学';
  };
  
  const currentGrade = gradeText || extractGradeFromTitle(title);
  
  return (
    <HeaderContainer>
      <LeftSection>
        {showBackButton && (
          <BackButton onClick={onBack}>
            <i className="fas fa-arrow-left"></i>
          </BackButton>
        )}
        
        <Title>{title}</Title>
        
        {showGradeSelector && (
          <GradeSelector onClick={onGradeSelectorClick}>
            当前学段:
            <span style={{ fontWeight: 500, color: 'white', marginLeft: '5px' }}>
              {currentGrade}
            </span>
            <ChevronIcon className="fas fa-chevron-down" />
          </GradeSelector>
        )}
      </LeftSection>
      
      {/* 不再显示右侧按钮区域 */}
    </HeaderContainer>
  );
};

export default Header; 
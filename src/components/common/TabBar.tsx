import React from 'react';
import styled from 'styled-components';

// TabBar组件的属性接口
interface TabBarProps {
  tabs: Array<{
    id: string;
    label: string;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

// 样式化组件
const TabBarContainer = styled.div`
  display: flex;
  margin: 15px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  overflow-x: auto;
  
  /* 适配移动端滚动 */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }
`;

interface TabItemProps {
  active: boolean;
}

const TabItem = styled.div<TabItemProps>`
  padding: 8px 15px;
  font-size: 16px;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text.secondary};
  cursor: pointer;
  white-space: nowrap;
  border-bottom: ${props => props.active ? `2px solid ${props.theme.colors.primary}` : 'none'};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  ${props => props.theme.mediaQueries.mobile} {
    padding: 8px 12px;
    font-size: 14px;
  }
`;

/**
 * TabBar组件 - 提供页面内的标签导航
 * 
 * 功能:
 * - 水平展示多个标签
 * - 高亮当前选中标签
 * - 移动端支持横向滚动
 */
const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <TabBarContainer>
      {tabs.map(tab => (
        <TabItem
          key={tab.id}
          active={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </TabItem>
      ))}
    </TabBarContainer>
  );
};

export default TabBar; 
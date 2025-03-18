import React from 'react';
import styled from 'styled-components';

// 接口定义
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
  border-bottom: 1px solid #eee;
  // margin-bottom: 20px;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

interface TabProps {
  isActive: boolean;
}

const Tab = styled.div<TabProps>`
  padding: 25px 25px;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  font-size: 18px;
  color: ${props => props.isActive ? props.theme.colors.primary : '#666'};
  font-weight: ${props => props.isActive ? '600' : '400'};
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${props => props.isActive ? props.theme.colors.primary : 'transparent'};
    transition: background-color 0.2s;
  }
`;

/**
 * TabBar组件 - 标签栏
 * 
 * 功能：
 * - 显示多个可点击的标签
 * - 支持切换激活状态
 * - 支持水平滚动
 */
const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <TabBarContainer>
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          isActive={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </Tab>
      ))}
    </TabBarContainer>
  );
};

export default TabBar; 
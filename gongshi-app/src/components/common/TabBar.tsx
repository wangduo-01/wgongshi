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
  position: relative;
  overflow-x: auto;
  padding-bottom: 2px;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #eaedf2;
  }
`;

interface TabProps {
  isActive: boolean;
}

const Tab = styled.div<TabProps>`
  padding: 18px 25px;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  font-size: 16px;
  color: ${props => props.isActive ? '#4a89dc' : '#666'};
  font-weight: ${props => props.isActive ? '600' : '500'};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.isActive ? '#4a89dc' : '#444'};
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${props => props.isActive ? '70%' : '0'};
    height: 3px;
    border-radius: 3px;
    background-color: ${props => props.isActive ? '#4a89dc' : 'transparent'};
    transition: all 0.25s ease;
  }
  
  &:hover:after {
    width: ${props => props.isActive ? '80%' : '0'};
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
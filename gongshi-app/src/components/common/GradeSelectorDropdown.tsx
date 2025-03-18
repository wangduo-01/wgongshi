import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

// 接口定义
export interface GradeSelectorDropdownProps {
  onSelect: (grade: string) => void;
  currentGrade: string;
}

// 样式化组件
const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  margin-left: 15px;
  cursor: pointer;
  user-select: none;
`;

const ChevronIcon = styled.i`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  transition: transform 0.2s ease;
  
  &.open {
    transform: rotate(180deg);
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 50%;
  margin-top: 10px;
  min-width: 120px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const DropdownItem = styled.div<{ isSelected: boolean }>`
  padding: 12px 16px;
  background-color: ${props => props.isSelected ? props.theme.colors.accent : 'white'};
  color: ${props => props.isSelected ? 'white' : props.theme.colors.text};
  font-size: 15px;
  font-weight: ${props => props.isSelected ? '600' : '400'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.isSelected ? props.theme.colors.accent : '#f9f9f9'};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const CheckIcon = styled.i`
  color: white;
  font-size: 14px;
`;

/**
 * GradeSelectorDropdown组件 - 下拉式年级/学段选择器
 * 
 * 功能：
 * - 显示下拉式年级/学段选项列表
 * - 支持选择年级/学段
 * - 高亮显示当前选中的年级/学段
 * - 点击外部区域关闭下拉菜单
 */
const GradeSelectorDropdown: React.FC<GradeSelectorDropdownProps> = ({
  onSelect,
  currentGrade
}) => {
  // 下拉菜单状态
  const [isOpen, setIsOpen] = useState(false);
  
  // 可选择的年级/学段列表
  const grades = ['小学', '初中', '高中'];
  
  // 创建ref用于检测点击区域
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 处理点击外部区域关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 处理下拉菜单切换
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // 处理选择年级/学段
  const handleSelect = (grade: string) => {
    onSelect(grade);
    setIsOpen(false);
  };
  
  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton onClick={toggleDropdown}>
        当前学段:
        <span style={{ fontWeight: 500, color: 'white', marginLeft: '5px' }}>
          {currentGrade}
        </span>
        <ChevronIcon className={`fas fa-chevron-down ${isOpen ? 'open' : ''}`} />
      </DropdownButton>
      
      <DropdownMenu isOpen={isOpen}>
        {grades.map((grade) => (
          <DropdownItem
            key={grade}
            isSelected={grade === currentGrade}
            onClick={() => handleSelect(grade)}
          >
            {grade}
            {grade === currentGrade && (
              <CheckIcon className="fas fa-check" />
            )}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </DropdownContainer>
  );
};

export default GradeSelectorDropdown; 
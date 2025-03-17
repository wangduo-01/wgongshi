import React, { useEffect } from 'react';
import styled from 'styled-components';

// 接口定义
export interface GradeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (grade: string) => void;
  currentGrade: string;
}

// 样式化组件
const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 85%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  margin: 0 0 20px 0;
  font-size: 20px;
  text-align: center;
  color: ${props => props.theme.colors.primary};
`;

const GradeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GradeOption = styled.div<{ isSelected: boolean }>`
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${props => props.isSelected ? props.theme.colors.accent : props.theme.colors.background};
  color: ${props => props.isSelected ? 'white' : props.theme.colors.text};
  font-size: 16px;
  font-weight: ${props => props.isSelected ? '600' : '400'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.isSelected ? props.theme.colors.accent : '#f0f0f0'};
  }
`;

const CheckIcon = styled.i`
  color: white;
  font-size: 18px;
`;

/**
 * GradeSelectorModal组件 - 年级/学段选择器
 * 
 * 功能：
 * - 显示年级/学段选项列表
 * - 支持选择年级/学段
 * - 高亮显示当前选中的年级/学段
 * - 支持键盘ESC关闭
 */
const GradeSelectorModal: React.FC<GradeSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentGrade
}) => {
  // 可选择的年级/学段列表
  const grades = ['小学', '初中', '高中'];
  
  // 添加Esc键监听以关闭弹窗
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);

    // 在弹窗打开时防止背景滚动
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // 处理选择年级/学段
  const handleSelect = (grade: string) => {
    onSelect(grade);
    onClose();
  };

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalTitle>选择学段</ModalTitle>
        
        <GradeList>
          {grades.map((grade) => (
            <GradeOption
              key={grade}
              isSelected={grade === currentGrade}
              onClick={() => handleSelect(grade)}
            >
              {grade}
              {grade === currentGrade && (
                <CheckIcon className="fas fa-check" />
              )}
            </GradeOption>
          ))}
        </GradeList>
      </ModalContainer>
    </Overlay>
  );
};

export default GradeSelectorModal; 
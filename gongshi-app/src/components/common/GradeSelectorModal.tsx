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
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  transition: opacity 0.3s ease;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s cubic-bezier(0.3, 0, 0.2, 1.2) forwards;
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalTitle = styled.h2`
  margin: 0 0 24px 0;
  font-size: 22px;
  text-align: center;
  color: #4a89dc;
  font-weight: 600;
`;

const GradeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const GradeOption = styled.div<{ isSelected: boolean }>`
  padding: 16px 20px;
  border-radius: 12px;
  background-color: ${props => props.isSelected ? '#4a89dc' : '#f5f8ff'};
  color: ${props => props.isSelected ? 'white' : '#333'};
  font-size: 16px;
  font-weight: ${props => props.isSelected ? '600' : '500'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  box-shadow: ${props => props.isSelected ? '0 5px 15px rgba(74, 137, 220, 0.2)' : 'none'};
  
  &:hover {
    background-color: ${props => props.isSelected ? '#3a6cad' : '#e8f0fe'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const CheckIcon = styled.i`
  color: white;
  font-size: 16px;
  opacity: 0.95;
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
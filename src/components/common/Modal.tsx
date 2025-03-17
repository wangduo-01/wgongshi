import React, { useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

// Modal组件的属性接口
interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

// 样式化组件
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  
  &.open {
    opacity: 1;
    visibility: visible;
  }
`;

interface ModalContentProps {
  width?: string;
}

const ModalContent = styled.div<ModalContentProps>`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 20px;
  width: ${props => props.width || '90%'};
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: ${props => props.theme.shadows.large};
  transform: translateY(20px);
  transition: transform 0.3s ease;
  
  .open & {
    transform: translateY(0);
  }
  
  ${props => props.theme.mediaQueries.mobile} {
    width: 95%;
    padding: 15px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.colors.text.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.light};
  cursor: pointer;
  font-size: 16px;
  padding: 5px;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

/**
 * Modal组件 - 可重用的弹窗组件
 * 
 * 功能:
 * - 显示覆盖整个页面的弹窗
 * - 支持标题和关闭按钮
 * - 支持点击遮罩层关闭
 * - 支持自定义宽度
 * - 添加动画效果
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  width,
  showCloseButton = true,
  closeOnOverlayClick = true,
}) => {
  // 当Modal打开时禁止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // 组件卸载时恢复
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // 处理点击遮罩层
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };
  
  // 如果未打开，不渲染任何内容
  if (!isOpen) return null;
  
  return (
    <ModalOverlay className={isOpen ? 'open' : ''} onClick={handleOverlayClick}>
      <ModalContent width={width}>
        {(title || showCloseButton) && (
          <ModalHeader>
            {title && <ModalTitle>{title}</ModalTitle>}
            {showCloseButton && (
              <CloseButton onClick={onClose}>
                <FontAwesomeIcon icon={faTimes} />
              </CloseButton>
            )}
          </ModalHeader>
        )}
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal; 
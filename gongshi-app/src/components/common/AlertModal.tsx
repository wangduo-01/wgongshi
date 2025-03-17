import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// 接口定义
export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  primaryAction?: {
    text: string;
    onClick: () => void;
  };
  secondaryAction?: {
    text: string;
    onClick: () => void;
  };
  icon?: {
    name: string;
    color: string;
  };
}

// 定义动画
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translate(-50%, -45%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
`;

// 样式化组件
const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
  backdrop-filter: blur(3px);
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 16px;
  padding: 24px 20px;
  width: 85%;
  max-width: 340px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.35s ease-out;
  
  /* 添加精致的边框效果 */
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  
  i {
    font-size: 24px;
    color: #4a89dc;
  }
`;

const DefaultIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f2f7ff;
  margin-right: 10px;
  
  i {
    font-size: 16px;
    color: #4a89dc;
  }
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2a2f45;
`;

const ModalContent = styled.div`
  margin-bottom: 28px;
  line-height: 1.8;
  color: #5a6379;
  font-size: 15px;
  text-align: center;
  padding: 0 12px;
  
  /* 处理内容中可能的段落 */
  p {
    margin: 0 0 12px 0;
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  /* 为公式名添加强调 */
  strong, b {
    color: #4a5568;
    font-weight: 600;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 10px;
`;

const PrimaryButton = styled.button`
  padding: 10px 20px;
  border-radius: 12px;
  background-color: #4a89dc;
  color: white;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  min-width: 100px;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(74, 137, 220, 0.3);
  
  &:hover {
    background-color: #3a6cad;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(74, 137, 220, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled.button`
  padding: 10px 20px;
  border-radius: 12px;
  background-color: #f5f7fa;
  color: #5a6379;
  border: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  min-width: 100px;
  transition: all 0.2s;
  
  &:hover {
    background-color: #ebeef2;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

/**
 * AlertModal组件 - 通用的提示/警告弹窗
 * 
 * 功能：
 * - 显示警告/提示信息
 * - 支持自定义标题和内容
 * - 支持主要和次要按钮操作
 * - 支持自定义图标
 * - 支持键盘ESC关闭
 */
const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  primaryAction,
  secondaryAction,
  icon
}) => {
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

  // 处理内容，添加引号和强调
  const formattedContent = React.useMemo(() => {
    if (!content) return '';
    
    // 将公式名称用引号括起来并加粗
    return content.replace(/"([^"]+)"/g, '<strong>"$1"</strong>');
  }, [content]);

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <TitleContainer>
          {icon ? (
            <IconWrapper>
              <i className={icon.name} style={{ color: icon.color }}></i>
            </IconWrapper>
          ) : (
            <DefaultIconWrapper>
              <i className="fas fa-exclamation-circle"></i>
            </DefaultIconWrapper>
          )}
          <ModalTitle>{title}</ModalTitle>
        </TitleContainer>
        
        <ModalContent dangerouslySetInnerHTML={{ __html: formattedContent }} />
        
        <ButtonContainer>
          {secondaryAction && (
            <SecondaryButton onClick={secondaryAction.onClick}>
              {secondaryAction.text}
            </SecondaryButton>
          )}
          
          {primaryAction && (
            <PrimaryButton onClick={primaryAction.onClick}>
              {primaryAction.text}
            </PrimaryButton>
          )}
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
  );
};

export default AlertModal; 
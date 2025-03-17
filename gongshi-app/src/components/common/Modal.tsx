import React, { useEffect } from 'react';
import styled from 'styled-components';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Overlay = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 80%;
  max-width: 400px;
`;

const ModalTitle = styled.div`
  font-size: 16px;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
`;

const ModalBody = styled.div`
  margin-bottom: 20px;
`;

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // 处理Esc键关闭弹窗
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    // 阻止背景滚动
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  // 阻止点击内容区域的事件冒泡
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={handleContentClick}>
        <ModalTitle>{title}</ModalTitle>
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContainer>
    </Overlay>
  );
};

export default Modal; 
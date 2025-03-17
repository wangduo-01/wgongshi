import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: string, description: string) => void;
}

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.div`
  font-size: 18px;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
`;

const SectionTitle = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 10px;
`;

const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

interface OptionProps {
  isSelected: boolean;
}

const Option = styled.div<OptionProps>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid ${props => props.isSelected ? props.theme.colors.primary : '#ddd'};
  border-radius: 5px;
  background-color: ${props => props.isSelected ? props.theme.colors.secondary : 'white'};
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const RadioInput = styled.input`
  cursor: pointer;
`;

const OptionLabel = styled.label`
  font-size: 14px;
  cursor: pointer;
`;

const TextAreaContainer = styled.div`
  margin-bottom: 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  resize: none;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
`;

const Button = styled.button<{ isPrimary?: boolean }>`
  padding: 8px 20px;
  border-radius: 5px;
  background-color: ${props => props.isPrimary ? props.theme.colors.primary : 'white'};
  color: ${props => props.isPrimary ? 'white' : props.theme.colors.primary};
  border: 1px solid ${props => props.isPrimary ? 'transparent' : props.theme.colors.primary};
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.isPrimary ? `${props.theme.colors.primary}dd` : props.theme.colors.secondary};
  }
`;

// 反馈类型
const FEEDBACK_TYPES = [
  { id: 'formula-error', label: '公式错误' },
  { id: 'example-error', label: '例题错误' },
  { id: 'explanation-unclear', label: '讲解不清楚' },
  { id: 'other-issue', label: '其他问题' }
];

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [selectedType, setSelectedType] = useState(FEEDBACK_TYPES[0].id);
  const [description, setDescription] = useState('');
  
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
  
  // 重置表单
  useEffect(() => {
    if (isOpen) {
      setSelectedType(FEEDBACK_TYPES[0].id);
      setDescription('');
    }
  }, [isOpen]);
  
  // 阻止点击内容区域的事件冒泡
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // 处理提交
  const handleSubmit = () => {
    onSubmit(selectedType, description);
    onClose();
  };
  
  // 处理取消
  const handleCancel = () => {
    onClose();
  };
  
  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={handleContentClick}>
        <ModalTitle>反馈问题</ModalTitle>
        
        <SectionTitle>请选择问题类型：</SectionTitle>
        <OptionList>
          {FEEDBACK_TYPES.map(type => (
            <Option 
              key={type.id}
              isSelected={selectedType === type.id}
              onClick={() => setSelectedType(type.id)}
            >
              <RadioInput 
                type="radio" 
                name="feedback-type" 
                id={type.id}
                checked={selectedType === type.id}
                onChange={() => setSelectedType(type.id)}
              />
              <OptionLabel htmlFor={type.id}>{type.label}</OptionLabel>
            </Option>
          ))}
        </OptionList>
        
        <SectionTitle>详细描述：</SectionTitle>
        <TextAreaContainer>
          <TextArea 
            placeholder="请详细描述您发现的问题..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </TextAreaContainer>
        
        <ButtonContainer>
          <Button onClick={handleCancel}>
            取消
          </Button>
          <Button 
            isPrimary 
            onClick={handleSubmit}
            disabled={!description.trim()}
          >
            提交反馈
          </Button>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
  );
};

export default FeedbackModal; 
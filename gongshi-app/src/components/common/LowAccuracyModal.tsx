import React from 'react';
import styled from 'styled-components';
import Modal from './Modal';

interface LowAccuracyModalProps {
  isOpen: boolean;
  onClose: () => void;
  formula: {
    id: string;
    title: string;
    accuracy: number;
  } | null;
  onPractice: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WarningIcon = styled.i`
  color: ${props => props.theme.colors.status.warning};
  font-size: 24px;
  margin-bottom: 15px;
`;

const MessageText = styled.p`
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.5;
  font-size: 14px;
  color: ${props => props.theme.colors.text.primary};
`;

const AccuracyText = styled.span`
  color: ${props => props.theme.colors.status.error};
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 8px 20px;
  border-radius: 5px;
  background-color: ${props => props.primary ? props.theme.colors.primary : 'white'};
  color: ${props => props.primary ? 'white' : props.theme.colors.primary};
  border: 1px solid ${props => props.primary ? 'transparent' : props.theme.colors.primary};
  font-size: 14px;
  cursor: pointer;
`;

const LowAccuracyModal: React.FC<LowAccuracyModalProps> = ({ 
  isOpen, 
  onClose, 
  formula, 
  onPractice 
}) => {
  if (!formula) return null;
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="需要巩固的公式"
    >
      <Container>
        <WarningIcon className="fas fa-exclamation-circle" />
        
        <MessageText>
          发现您对"{formula.title}"的掌握度较低（<AccuracyText>{formula.accuracy}%</AccuracyText>），
          建议进行针对性练习以提高掌握度。
        </MessageText>
        
        <ButtonContainer>
          <Button onClick={onClose}>
            稍后再说
          </Button>
          <Button primary onClick={onPractice}>
            立即练习
          </Button>
        </ButtonContainer>
      </Container>
    </Modal>
  );
};

export default LowAccuracyModal; 
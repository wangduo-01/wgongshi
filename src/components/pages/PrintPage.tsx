import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import Header from '../common/Header';
import Button from '../common/Button';

// 样式化组件
const PrintContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.medium};
  padding: 15px;
  min-height: 800px;
  height: calc(100vh - 40px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const PrintContent = styled.div`
  padding: 15px;
  flex: 1;
`;

const OptionTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
  color: ${props => props.theme.colors.text.primary};
`;

const PrintOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
`;

interface PrintOptionProps {
  selected: boolean;
}

const PrintOption = styled.div<PrintOptionProps>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border: 1px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.selected ? props.theme.colors.secondary : props.theme.colors.white};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const OptionInput = styled.input`
  margin: 0;
`;

const OptionLabel = styled.label`
  font-size: 14px;
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
`;

const PrintActions = styled.div`
  margin-top: 30px;
  text-align: center;
`;

/**
 * PrintPage组件 - 打印配置页面
 * 
 * 功能：
 * - 选择打印内容（全部公式、收藏公式、当前公式）
 * - 开始打印功能
 */
const PrintPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [printOption, setPrintOption] = useState<string>('all');
  
  // 处理打印选项变更
  const handleOptionChange = (option: string) => {
    setPrintOption(option);
  };
  
  // 处理开始打印
  const handlePrint = () => {
    // 在实际应用中，这里应该实现打印功能
    window.print();
  };
  
  return (
    <PrintContainer>
      <Header
        title="打印"
        showBackButton
      />
      
      <PrintContent>
        <OptionTitle>选择打印内容：</OptionTitle>
        
        <PrintOptions>
          <PrintOption selected={printOption === 'all'} onClick={() => handleOptionChange('all')}>
            <OptionInput 
              type="radio" 
              name="print-option" 
              id="print-all" 
              checked={printOption === 'all'} 
              onChange={() => handleOptionChange('all')} 
            />
            <OptionLabel htmlFor="print-all">全部公式</OptionLabel>
          </PrintOption>
          
          <PrintOption selected={printOption === 'favorites'} onClick={() => handleOptionChange('favorites')}>
            <OptionInput 
              type="radio" 
              name="print-option" 
              id="print-favorites" 
              checked={printOption === 'favorites'} 
              onChange={() => handleOptionChange('favorites')} 
            />
            <OptionLabel htmlFor="print-favorites">我的收藏</OptionLabel>
          </PrintOption>
          
          <PrintOption selected={printOption === 'current'} onClick={() => handleOptionChange('current')}>
            <OptionInput 
              type="radio" 
              name="print-option" 
              id="print-current" 
              checked={printOption === 'current'} 
              onChange={() => handleOptionChange('current')} 
            />
            <OptionLabel htmlFor="print-current">当前公式</OptionLabel>
          </PrintOption>
        </PrintOptions>
        
        <PrintActions>
          <Button icon={faPrint} onClick={handlePrint}>开始打印</Button>
        </PrintActions>
      </PrintContent>
    </PrintContainer>
  );
};

export default PrintPage; 
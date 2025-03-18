import React from 'react';
import styled from 'styled-components';

// 定义按钮样式
const PrintButtonLarge = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #4a89dc;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #3a6cad;
  }
  
  i {
    font-size: 18px;
  }
`;

const PrintActionButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  i {
    font-size: 24px;
    color: #4a89dc;
    margin-bottom: 6px;
  }
  
  span {
    font-size: 14px;
    color: #555;
  }
`;

type PrintComponentProps = {
  // 打印类型：'favorite' 或 'all'
  type?: 'favorite' | 'all';
  // 自定义打印标签文本
  label?: string;
  // 按钮风格：'large' 或 'action'
  buttonStyle?: 'large' | 'action';
  // 打印前的自定义回调
  beforePrint?: () => void;
  // 打印后的自定义回调
  afterPrint?: () => void;
};

/**
 * 打印组件
 * 
 * 这个组件封装了打印功能，可以用不同的样式显示打印按钮
 * 
 * @param {string} type - 打印类型，可选 'favorite' 或 'all'
 * @param {string} label - 自定义打印按钮标签
 * @param {string} buttonStyle - 按钮样式，可选 'large' 或 'action'
 * @param {Function} beforePrint - 打印前的回调函数
 * @param {Function} afterPrint - 打印后的回调函数
 */
const PrintComponent: React.FC<PrintComponentProps> = ({
  type = 'all',
  label,
  buttonStyle = 'large',
  beforePrint,
  afterPrint
}) => {
  // 根据type设置默认标签
  const defaultLabel = type === 'favorite' ? '打印收藏公式' : '打印';
  const buttonLabel = label || defaultLabel;
  
  // 处理打印按钮点击
  const handlePrintClick = () => {
    // 打印前回调
    if (beforePrint) {
      beforePrint();
    }
    
    // 执行打印
    window.print();
    
    // 打印后回调
    if (afterPrint) {
      afterPrint();
    }
  };
  
  // 根据样式返回不同的按钮
  if (buttonStyle === 'large') {
    return (
      <PrintButtonLarge onClick={handlePrintClick}>
        <i className="fas fa-print"></i> {buttonLabel}
      </PrintButtonLarge>
    );
  }
  
  return (
    <PrintActionButton onClick={handlePrintClick}>
      <i className="fas fa-print"></i>
      <span>{buttonLabel}</span>
    </PrintActionButton>
  );
};

export default PrintComponent; 
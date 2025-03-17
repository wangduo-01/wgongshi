import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// 按钮组件属性接口
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: IconDefinition;
  fullWidth?: boolean;
  disabled?: boolean;
}

// 根据大小获取填充和字体大小
const getPadding = (size: string) => {
  switch(size) {
    case 'small': return '5px 10px';
    case 'large': return '12px 24px';
    default: return '8px 16px';
  }
};

const getFontSize = (size: string) => {
  switch(size) {
    case 'small': return '12px';
    case 'large': return '16px';
    default: return '14px';
  }
};

// 根据变体获取按钮样式
const getButtonStyles = (variant: string, theme: any) => {
  switch(variant) {
    case 'secondary':
      return `
        background-color: ${theme.colors.secondary};
        color: ${theme.colors.primary};
        border: 1px solid ${theme.colors.secondary};
        &:hover {
          background-color: ${theme.colors.secondary};
          opacity: 0.9;
        }
      `;
    case 'outline':
      return `
        background-color: transparent;
        color: ${theme.colors.primary};
        border: 1px solid ${theme.colors.primary};
        &:hover {
          background-color: ${theme.colors.secondary};
        }
      `;
    default:
      return `
        background-color: ${theme.colors.primary};
        color: #fff;
        border: 1px solid ${theme.colors.primary};
        &:hover {
          background-color: ${theme.colors.primary};
          opacity: 0.9;
        }
      `;
  }
};

// 样式化按钮组件
const StyledButton = styled.button<{
  size: string;
  variant: string;
  fullWidth: boolean;
}>`
  ${props => getButtonStyles(props.variant, props.theme)}
  padding: ${props => getPadding(props.size)};
  font-size: ${props => getFontSize(props.size)};
  border-radius: ${props => props.theme.borderRadius.small};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  font-weight: 500;
  box-shadow: ${props => props.variant === 'primary' ? props.theme.shadows.small : 'none'};
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.colors.secondary};
  }
`;

/**
 * 按钮组件
 * 
 * 支持三种变体：primary（主要）、secondary（次要）、outline（轮廓）
 * 支持三种尺寸：small（小）、medium（中）、large（大）
 * 可选的图标和全宽设置
 */
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  size = 'medium',
  variant = 'primary',
  icon,
  fullWidth = false,
  disabled = false
}) => {
  return (
    <StyledButton
      onClick={onClick}
      size={size}
      variant={variant}
      fullWidth={fullWidth}
      disabled={disabled}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </StyledButton>
  );
};

export default Button; 
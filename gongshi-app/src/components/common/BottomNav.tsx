import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const NavContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: white;
  height: 68px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.05);
  z-index: 100;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 0 12px;
`;

const NavItem = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  color: ${props => props.isActive ? '#4a89dc' : '#8a94a6'};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  padding: 8px 0;
  
  &:hover {
    color: ${props => props.isActive ? '#3a6cad' : '#64748b'};
  }
  
  &:before {
    content: '';
    position: absolute;
    bottom: 8px;
    height: 4px;
    width: ${props => props.isActive ? '25px' : '0'};
    background-color: ${props => props.isActive ? '#4a89dc' : 'transparent'};
    border-radius: 2px;
    transition: all 0.3s ease;
    opacity: ${props => props.isActive ? '1' : '0'};
    transform: translateY(12px);
  }
`;

const IconContainer = styled.div`
  font-size: 22px;
  margin-bottom: 6px;
  transition: all 0.2s ease;
  
  ${NavItem}:hover & {
    transform: translateY(-2px);
  }
`;

const Label = styled.div`
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
`;

export interface BottomNavProps {
  onTabChange?: (tab: string) => void;
}

// 底部导航栏组件
const BottomNav: React.FC<BottomNavProps> = ({ onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path === '/records' && currentPath === '/records') return true;
    if (path === '/errorbook' && currentPath === '/errorbook') return true;
    return false;
  };
  
  const handleTabClick = (path: string) => {
    navigate(path);
    if (onTabChange) {
      onTabChange(path);
    }
  };
  
  return (
    <NavContainer>
      <NavItem 
        isActive={isActive('/')}
        onClick={() => handleTabClick('/')}
      >
        <IconContainer>
          <i className="fas fa-home"></i>
        </IconContainer>
        <Label>首页</Label>
      </NavItem>
      
      <NavItem 
        isActive={isActive('/records')}
        onClick={() => handleTabClick('/records')}
      >
        <IconContainer>
          <i className="fas fa-history"></i>
        </IconContainer>
        <Label>练习记录</Label>
      </NavItem>
      
      <NavItem 
        isActive={isActive('/errorbook')}
        onClick={() => handleTabClick('/errorbook')}
      >
        <IconContainer>
          <i className="fas fa-bookmark"></i>
        </IconContainer>
        <Label>错题本</Label>
      </NavItem>
    </NavContainer>
  );
};

export default BottomNav; 
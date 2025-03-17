import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const NavContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: white;
  height: 60px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const NavItem = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.text.secondary};
  transition: color 0.2s;
  cursor: pointer;
`;

const IconContainer = styled.div`
  font-size: 22px;
  margin-bottom: 4px;
`;

const Label = styled.div`
  font-size: 12px;
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
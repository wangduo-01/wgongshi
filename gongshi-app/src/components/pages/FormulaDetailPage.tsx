import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

// 添加Formula接口定义
interface Formula {
  id: string;
  title: string;
  content: string;
  description?: string;
  accuracy: number;
  isFavorite: boolean;
  subject: string; // 'math', 'physics', 'chemistry'
  level: string; // '小学', '初中', '高中'
  relatedLower: Array<{ id: string, title: string }>;
  relatedHigher: Array<{ id: string, title: string }>;
  examples: Array<{ id: string, title: string, content: string }>;
  lastPracticed?: Date; // 添加最近练习时间属性，用于排序
  favoriteTimestamp?: number; // 添加收藏时间戳
}

// 样式部分
const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(2px);
  opacity: 1;
  visibility: visible;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.closing {
    opacity: 0;
    backdrop-filter: blur(0px);
    background-color: rgba(0, 0, 0, 0);
  }
`;

const BackButton = styled.button`
  display: none;
`;

const FormulaCard = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  width: 95%;
  max-width: 1000px;
  height: 90vh;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: modalAppear 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0) scale(1);
  opacity: 1;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
              opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  .closing & {
    transform: translateY(20px) scale(0.97);
    opacity: 0;
  }
  
  @keyframes modalAppear {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const CardHeader = styled.div`
  background-color: #4a89dc;
  color: white;
  padding: 10px 30px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 25px;
  font-weight: 600;
  margin: 0;
  text-align: center;
`;

const SubTitle = styled.div`
  font-size: 16px;
  opacity: 0.8;
  margin-top: 8px;
`;

// 导航按钮移到卡片顶部两侧
const NavButtonHeader = styled.button<{ direction: 'prev' | 'next' }>`
  background: none;
  border: none;
  color: white;
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  z-index: 2; /* 确保导航按钮位于标题之上 */
  
  &:hover {
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    
    &:hover {
      background-color: transparent;
    }
  }
  
  i {
    font-size: 22px;
    margin: ${props => props.direction === 'prev' ? '0 8px 0 0' : '0 0 0 8px'};
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftColumn = styled.div`
  flex: 1;
  padding: 30px;
  border-right: 1px solid #eef2f7;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid #eef2f7;
    padding: 25px 20px;
    max-height: 50%;
  }
  
  /* 添加自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #c1c1c1;
  }
`;

const RightColumn = styled.div`
  flex: 1;
  padding: 15px;
  padding-bottom: 10px; /* 减小底部padding，由ButtonContainer来占据空间 */
  background-color: #fafbfd;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative; /* 为固定定位的按钮提供定位上下文 */
  
  @media (max-width: 768px) {
    padding: 25px 20px;
    padding-bottom: 20px; /* 减小底部padding，由ButtonContainer来占据空间 */
    max-height: 50%;
  }
  
  /* 添加自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #c1c1c1;
  }
`;

const FormulaSection = styled.div`
  padding-bottom: 30px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
`;

const Formula = styled.div`
  font-size: 42px;
  color: #2a2f45;
  text-align: center;
  margin: 30px 0;
  font-family: 'Times New Roman', Times, serif;
  padding: 30px 0;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormulaDescription = styled.div`
  color: #5a6379;
  font-size: 16px;
  text-align: center;
  line-height: 1.6;
  max-width: 85%;
  margin: 0 auto;
`;

// 修改FavoriteButton组件，添加isFavorite属性来控制颜色
const FavoriteButton = styled.button<{ isFavorite?: boolean }>`
  position: absolute;
  top: -20px;
  right: -20px;
  background: none;
  border: none;
  color: ${props => props.isFavorite ? '#ff9500' : '#ccc'};
  font-size: 24px;
  cursor: pointer;
  opacity: 0.9;
  z-index: 10;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    opacity: 1;
    background-color: ${props => props.isFavorite ? 'rgba(255, 149, 0, 0.1)' : 'rgba(204, 204, 204, 0.1)'};
  }
`;

const RelatedSection = styled.div`
  margin-bottom: 0px;
  border-top: 1px solid #eef2f7;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 150px;
  padding-top: 20px; /* 增加分割线与内容的间距 */
`;

const RelatedCategory = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #3a4255;
  margin: 0 0 10px 0; /* 将bottom margin改为10px */
  position: relative;
  padding-left: 15px;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 18px;
    background-color: #4a89dc;
    border-radius: 2px;
  }
`;

const RelatedList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 15px;
`;

const RelatedItem = styled.button`
  background-color: #f0f5ff;
  border: 1px solid #d0e0ff;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  color: #4a89dc;
  cursor: pointer;
  transition: all 0.2s;
  position: relative; /* 添加相对定位，用于放置学段标签 */
  
  &:hover {
    background-color: #e0ecff;
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(74, 137, 220, 0.15);
  }
`;

// 添加学段标签组件
const LevelTag = styled.span<{ level?: string }>`
  position: absolute;
  top: -6px;
  left: -6px;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: ${props => {
    switch (props.level) {
      case '小学': return '#4cd964'; // 绿色
      case '初中': return '#ffcc00'; // 黄色
      case '高中': return '#ff9500'; // 橙色
      default: return '#aaaaaa'; // 灰色
    }
  }};
  color: ${props => props.level === '小学' ? '#fff' : '#333'};
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ExampleSection = styled.div`
  margin-bottom: 30px;
  flex: 1;
`;

const ExampleItem = styled.div`
  margin-bottom: 10px;
  padding-bottom: 0px;
  border-bottom: 1px solid #eef2f7;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const ExampleTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #4a89dc;
  margin: 0 0 10px 0;
`;

const ExampleContent = styled.div`
  font-size: 16px;
  color: #5a6379;
  line-height: 1.8;
  white-space: pre-line;
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #eef2f7;
`;

// 添加一个固定在底部的容器
const ButtonContainer = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0;
  background-color: transparent;
  box-shadow: none;
  z-index: 10;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const PracticeButton = styled.button`
  background-color: #4a89dc;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 16px 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 350px;
  gap: 10px;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(74, 137, 220, 0.25);
  
  &:hover {
    background-color: #3a6cad;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(74, 137, 220, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  i {
    font-size: 18px;
  }
`;

// 移动到顶部的导航控制，隐藏不使用
const NavigationButtons = styled.div`
  display: none;
`;

const NavButton = styled.button<{ direction: 'prev' | 'next' }>`
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  color: #555;
  flex-direction: ${props => props.direction === 'prev' ? 'row' : 'row-reverse'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  i {
    color: #4a89dc;
  }
`;

const NavTitle = styled.div<{ direction: 'prev' | 'next' }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.direction === 'prev' ? 'flex-start' : 'flex-end'};
`;

const NavLabel = styled.span`
  font-size: 14px;
  color: #888;
`;

const NavFormula = styled.span`
  font-weight: 500;
  color: #333;
`;

const Toast = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  z-index: 1500;
  opacity: ${props => props.visible ? '1' : '0'};
  transition: opacity 0.3s ease-in-out;
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  pointer-events: none;
  max-width: 80%;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  i {
    font-size: 18px;
    color: #ffcc00;
  }
`;

// 更新右下角反馈按钮样式，适应FormulaSection内的位置
const CornerFeedbackButton = styled.button`
  position: absolute;
  bottom: -20px;
  right: -25px;
  background: none;
  border: none;
  color: #4a89dc;
  font-size: 14px;
  cursor: pointer;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(74, 137, 220, 0.1);
  }
  
  i {
    font-size: 14px;
  }
`;

// 修改反馈模态框相关样式组件
const FeedbackModal = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65);
  display: ${props => props.visible ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${props => props.visible ? '1' : '0'};
  transition: opacity 0.3s ease;
  backdrop-filter: blur(2px);
`;

const ModalContent = styled.div<{ visible?: boolean }>`
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  padding: 28px 24px;
  position: relative;
  animation: ${props => props.visible ? 'modalAppear 0.3s ease' : 'none'};
  
  @keyframes modalAppear {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CloseModalButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  color: #bbb;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  
  &:hover {
    background-color: #f5f5f5;
    color: #666;
  }
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  color: #333;
  margin-top: 0;
  margin-bottom: 8px;
  text-align: center;
  font-weight: 600;
`;

const ModalSubtitle = styled.p`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: 0;
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 12px;
  font-size: 15px;
  color: #333;
  font-weight: 500;
`;

// 优化复选框容器样式
const CheckboxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 8px;
`;

// 优化复选框组样式
const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  background-color: #f7faff;
  border: 1px solid #e0e9ff;
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #edf4ff;
    border-color: #c5d9ff;
  }
`;

// 自定义复选框样式
const StyledCheckbox = styled.div<{ checked: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid ${props => props.checked ? '#4a89dc' : '#ccc'};
  background-color: ${props => props.checked ? '#4a89dc' : 'white'};
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
  
  &:after {
    content: '';
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    display: ${props => props.checked ? 'block' : 'none'};
    margin-top: -2px;
  }
`;

// 隐藏原生复选框
const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #333;
  cursor: pointer;
  user-select: none;
`;

// 文本域样式调整
const FormTextarea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #e0e9ff;
  background-color: #f7faff;
  font-size: 14px;
  color: #333;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #4a89dc;
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(74, 137, 220, 0.15);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`;

const ModalButton = styled.button<{ primary?: boolean }>`
  padding: 12px 0;
  width: 48%;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  
  background-color: ${props => props.primary ? '#4a89dc' : 'white'};
  color: ${props => props.primary ? 'white' : '#666'};
  border: ${props => props.primary ? 'none' : '1px solid #ddd'};
  
  &:hover {
    background-color: ${props => props.primary ? '#3a6cad' : '#f5f5f5'};
    transform: translateY(-2px);
    box-shadow: ${props => props.primary ? '0 4px 12px rgba(74, 137, 220, 0.25)' : '0 4px 12px rgba(0, 0, 0, 0.05)'};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// 修改关闭按钮样式，移至弹窗外部右上角
const CloseDetailButton = styled.button`
  position: absolute;
  top: 20px;
  right: 100px;
  background-color: #f2f2f2;
  border: none;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 1010; /* 确保按钮位于弹窗之上 */
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #e0e0e0;
    color: #333;
    transform: rotate(90deg);
  }
`;

// 在RelatedSection组件之前添加返回按钮样式定义
const ReturnButton = styled.button`
  position: absolute;
  top: -15px;
  left: -15px;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f8f9fa;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  color: #4a89dc;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
  
  &:hover {
    background-color: #edf2fd;
    box-shadow: 0 2px 8px rgba(74, 137, 220, 0.1);
  }
  
  i {
    font-size: 14px;
  }
`;

// 模拟所有公式数据 - 与HomePage保持一致的格式
const ALL_FORMULAS: Formula[] = [
  // 数学公式
  {
    id: '1',
    title: '周长公式',
    content: 'C = 2πr',
    description: '圆的周长等于2倍的圆周率乘以半径',
    accuracy: 90,
    isFavorite: false,
    favoriteTimestamp: undefined, // 添加收藏时间戳
    subject: 'math',
    level: '小学',
    relatedLower: [],
    relatedHigher: [
      { id: '2', title: '圆的面积公式' }
    ],
    examples: [
      {
        id: '1',
        title: '例题',
        content: '一个圆的半径为5厘米，求这个圆的周长。'
      },
      {
        id: '2',
        title: '解析',
        content: '根据圆的周长公式 C = 2πr\n代入数据：r = 5厘米\nC = 2 × 3.14 × 5 = 31.4(厘米)'
      }
    ]
  },
  {
    id: '2',
    title: '面积公式',
    content: 'S = πr²',
    description: '圆的面积等于圆周率乘以半径的平方',
    accuracy: 65,
    isFavorite: false,
    subject: 'math',
    level: '小学',
    relatedLower: [
      { id: '1', title: '周长公式' }
    ],
    relatedHigher: [],
    examples: [
      {
        id: '1',
        title: '例题',
        content: '一个圆的半径为6厘米，求这个圆的面积。'
      },
      {
        id: '2',
        title: '解析',
        content: '根据圆的面积公式 S = πr²\n代入数据：r = 6厘米\nS = 3.14 × 6² = 3.14 × 36 = 113.04(平方厘米)'
      }
    ]
  },
  {
    id: '3',
    title: '三角形面积',
    content: 'S = ½ah',
    description: '三角形的面积等于底边乘以高的积的一半',
    accuracy: 85,
    isFavorite: false,
    subject: 'math',
    level: '小学',
    relatedLower: [],
    relatedHigher: [
      { id: '4', title: '勾股定理' }
    ],
    examples: [
      {
        id: '1',
        title: '例题',
        content: '一个三角形的底边长为8厘米，高为6厘米，求面积。'
      },
      {
        id: '2',
        title: '解析',
        content: '根据三角形面积公式 S = ½ah\n代入数据：a = 8厘米，h = 6厘米\nS = ½ × 8 × 6 = 24(平方厘米)'
      }
    ]
  },
  {
    id: '4',
    title: '勾股定理',
    content: 'a² + b² = c²',
    description: '直角三角形中，两直角边的平方和等于斜边的平方',
    accuracy: 70,
    isFavorite: false,
    subject: 'math',
    level: '初中',
    relatedLower: [
      { id: '3', title: '三角形面积' }
    ],
    relatedHigher: [
      { id: '8', title: '余弦定理' }
    ],
    examples: [
      {
        id: '1',
        title: '例题',
        content: '一座观光塔高30米，在平地上距离塔底40米处有一棵树，树高5米。\n\n(1) 求塔顶到树顶的直线距离；\n\n(2) 一个人站在塔顶，从他的视角看向树顶和树底，这两条视线形成的夹角是多少？\n\n(3) 如果从塔顶沿着倾角为30°的方向架设一条直线缆车到地面，求缆车的长度和缆车终点到塔底的距离。\n\n(4) 在塔顶安装一个摄像头，要求能够监控以塔底为圆心、半径为100米的圆形区域，摄像头的视野角度至少需要是多少？'
      },
      {
        id: '2',
        title: '解析',
        content: '这个问题涉及勾股定理的多种实际应用，我们一步步来分析：\n\n【问题(1)】求塔顶到树顶的直线距离\n\n我们可以在平面直角坐标系中分析这个问题。假设塔底在原点(0,0)，则：\n- 塔顶位置：(0,30)\n- 树底位置：(40,0)\n- 树顶位置：(40,5)\n\n塔顶到树顶的直线距离可以用三维空间中两点间距离公式（勾股定理的扩展形式）计算：\nd = √[(40-0)² + (5-30)²] = √[1600 + 625] = √2225 = 47.17米\n\n我们也可以这样分析：塔顶到树顶形成一个直角三角形，其中：\n- 水平距离为40米\n- 高度差为|30-5| = 25米\n- 应用勾股定理：d² = 40² + 25² = 1600 + 625 = 2225\n- d = √2225 ≈ 47.17米\n\n【问题(2)】塔顶视角看向树顶和树底形成的夹角\n\n从塔顶(0,30)看向树底(40,0)和树顶(40,5)形成的角度，可以通过三角函数计算：\n\n首先计算塔顶到树底的距离：\nd₁ = √(40² + 30²) = √(1600 + 900) = √2500 = 50米\n\n塔顶到树顶的距离已经计算得出：d₂ = 47.17米\n\n设塔顶到树底的连线与水平线的夹角为α：\ntanα = 30/40 = 0.75\nα = arctan(0.75) ≈ 36.87°\n\n设塔顶到树顶的连线与水平线的夹角为β：\ntanβ = 25/40 = 0.625\nβ = arctan(0.625) ≈ 32.01°\n\n因此，塔顶观察树顶和树底的视线夹角为：\nθ = α - β = 36.87° - 32.01° = 4.86°\n\n【问题(3)】倾角30°的缆车长度和终点距离\n\n如果缆车从塔顶以30°角下降到地面，设缆车长度为L，终点到塔底的距离为x。\n\n根据三角函数关系：\nsin30° = 30/L\nL = 30/sin30° = 30/0.5 = 60米\n\ncos30° = x/L\nx = L·cos30° = 60·0.866 = 51.96米\n\n因此，缆车长度为60米，缆车终点距离塔底约51.96米。\n\n【问题(4)】摄像头视野角度要求\n\n设摄像头需要的视野角为2θ。\n\n摄像头安装在塔顶(0,30)，需要监控的区域是以塔底为圆心、半径为100米的圆形区域。\n\n通过三角函数关系，我们可以求出θ：\ntanθ = 100/30 = 10/3 ≈ 3.33\nθ = arctan(10/3) ≈ 73.3°\n\n因此，摄像头的视野角度至少需要：2θ ≈ 146.6°\n\n这个例题展示了勾股定理在实际问题中的多种应用。在几何学、测量学、建筑设计和工程学中，勾股定理是最基础也是最重要的定理之一。它不仅可以直接应用于计算距离，还可以与三角函数结合，解决更复杂的问题。'
      }
    ]
  },
  // 添加平行四边形面积公式
  {
    id: '5',
    title: '平行四边形面积',
    content: 'S = bh',
    description: '平行四边形的面积等于底边长乘以高',
    accuracy: 80,
    isFavorite: false,
    subject: 'math',
    level: '初中',
    relatedLower: [],
    relatedHigher: [
      { id: '6', title: '梯形面积' }
    ],
    examples: [
      {
        id: '1',
        title: '例题',
        content: '一个平行四边形的底边长为8厘米，高为5厘米，求面积。'
      },
      {
        id: '2',
        title: '解析',
        content: '根据平行四边形面积公式 S = bh\n代入数据：b = 8厘米，h = 5厘米\nS = 8 × 5 = 40(平方厘米)'
      }
    ]
  },
  // 添加梯形面积公式
  {
    id: '6',
    title: '梯形面积',
    content: 'S = ½h(a+b)',
    description: '梯形的面积等于上下底边长和乘以高的一半',
    accuracy: 25,
    isFavorite: true,
    subject: 'math',
    level: '初中',
    relatedLower: [
      { id: '5', title: '平行四边形面积' }
    ],
    relatedHigher: [],
    examples: [
      {
        id: '1',
        title: '例题',
        content: '一个梯形的上底长4厘米，下底长10厘米，高为6厘米，求面积。'
      },
      {
        id: '2',
        title: '解析',
        content: '根据梯形面积公式 S = ½h(a+b)\n代入数据：a = 4厘米，b = 10厘米，h = 6厘米\nS = ½ × 6 × (4 + 10) = 3 × 14 = 42(平方厘米)'
      }
    ]
  },
  {
    id: '7',
    title: '一元二次方程',
    content: 'x = (-b ± √(b² - 4ac)) / 2a',
    description: '求解一元二次方程ax² + bx + c = 0的根',
    accuracy: 55,
    isFavorite: false,
    subject: 'math',
    level: '高中',
    relatedLower: [],
    relatedHigher: [],
    examples: [
      {
        id: '1',
        title: '例题',
        content: '求解方程：x² - 5x + 6 = 0'
      },
      {
        id: '2',
        title: '解析',
        content: '对于方程x² - 5x + 6 = 0，我们有a = 1, b = -5, c = 6\n代入公式：x = (-b ± √(b² - 4ac)) / 2a\nx = (5 ± √(25 - 24)) / 2 = (5 ± √1) / 2 = (5 ± 1) / 2\n所以x₁ = 3, x₂ = 2'
      }
    ]
  },
  {
    id: '8',
    title: '余弦定理',
    content: 'a² = b² + c² - 2bc·cosA',
    description: '三角形中，任意一边的平方等于其他两边平方和减去它们与夹角余弦的两倍积',
    accuracy: 40,
    isFavorite: false,
    subject: 'math',
    level: '高中',
    relatedLower: [
      { id: '4', title: '勾股定理' }
    ],
    relatedHigher: [],
    examples: [
      {
        id: '1',
        title: '例题',
        content: '已知三角形两边长分别为4cm和5cm，它们的夹角为60°，求第三边长。'
      },
      {
        id: '2',
        title: '解析',
        content: '根据余弦定理 a² = b² + c² - 2bc·cosA\n代入数据：b = 4cm, c = 5cm, A = 60°\na² = 4² + 5² - 2×4×5×cos60° = 16 + 25 - 40×0.5 = 41 - 20 = 21\n所以a = √21 ≈ 4.58cm'
      }
    ]
  },

  // 物理公式
  {
    id: '9',
    title: '速度公式',
    content: 'v = s/t',
    description: '速度等于路程除以时间',
    accuracy: 95,
    isFavorite: false,
    subject: 'physics',
    level: '小学',
    relatedLower: [],
    relatedHigher: [
      { id: '11', title: '牛顿第二定律' }
    ],
    examples: [
      {
        id: '1',
        title: '例题',
        content: '一辆汽车在2小时内行驶了120千米，求汽车的平均速度。'
      },
      {
        id: '2',
        title: '解析',
        content: '根据速度公式 v = s/t\n代入数据：s = 120千米，t = 2小时\nv = 120 ÷ 2 = 60(千米/小时)'
      }
    ]
  },
  {
    id: '10',
    title: '密度公式',
    content: 'ρ = m/V',
    description: '密度等于物体的质量除以体积',
    accuracy: 85,
    isFavorite: false,
    subject: 'physics',
    level: '小学',
    relatedLower: [],
    relatedHigher: [],
    examples: [
      {
        id: '1',
        title: '例题',
        content: '一块体积为50立方厘米的金属，质量为400克，求这块金属的密度。'
      },
      {
        id: '2',
        title: '解析',
        content: '根据密度公式 ρ = m/V\n代入数据：m = 400克，V = 50立方厘米\nρ = 400 ÷ 50 = 8(克/立方厘米)'
      }
    ]
  },
  {
    id: '11',
    title: '牛顿第二定律',
    content: 'F = ma',
    description: '物体加速度的大小与作用力成正比，与质量成反比',
    accuracy: 75,
    isFavorite: false,
    subject: 'physics',
    level: '初中',
    relatedLower: [
      { id: '9', title: '速度公式' }
    ],
    relatedHigher: [],
    examples: [
      {
        id: '1',
        title: '例题',
        content: '一个质量为2千克的物体，受到10牛顿的力作用，求物体的加速度。'
      },
      {
        id: '2',
        title: '解析',
        content: '根据牛顿第二定律 F = ma\n代入数据：F = 10牛顿，m = 2千克\na = F/m = 10 ÷ 2 = 5(米/秒²)'
      }
    ]
  },
  {
    id: '12',
    title: '功公式',
    content: 'W = F·s·cosα',
    description: '力做的功等于力的大小乘以位移再乘以它们夹角的余弦值',
    accuracy: 65,
    isFavorite: false,
    subject: 'physics',
    level: '初中',
    relatedLower: [],
    relatedHigher: [],
    examples: [
      {
        id: '1',
        title: '例题',
        content: '一个物体在水平面上被一个大小为20牛顿的力拉动，力的方向与水平方向成30°角，物体移动了5米，求力做的功。'
      },
      {
        id: '2',
        title: '解析',
        content: '根据功公式 W = F·s·cosα\n代入数据：F = 20牛顿，s = 5米，α = 30°\nW = 20 × 5 × cos30° = 100 × 0.866 = 86.6(焦耳)'
      }
    ]
  },
  {
    id: '13',
    title: '电功率公式',
    content: 'P = UI',
    description: '电功率等于电压与电流的乘积',
    accuracy: 70,
    isFavorite: true,
    subject: 'physics',
    level: '初中',
    relatedLower: [],
    relatedHigher: [],
    examples: [
      {
        id: '1',
        title: '例题',
        content: '一个电器在220伏电压下，电流为2安培，求电器的功率。'
      },
      {
        id: '2',
        title: '解析',
        content: '根据电功率公式 P = UI\n代入数据：U = 220伏，I = 2安培\nP = 220 × 2 = 440(瓦)'
      }
    ]
  },
  {
    id: '14',
    title: '电磁感应定律',
    content: 'ε = -N·dΦ/dt',
    description: '闭合线圈中感应电动势的大小等于磁通量变化率的负值与线圈匝数的乘积',
    accuracy: 50,
    isFavorite: false,
    subject: 'physics',
    level: '高中',
    relatedLower: [],
    relatedHigher: [],
    examples: [
      {
        id: '1',
        title: '例题',
        content: '一个100匝的线圈中，磁通量在0.01秒内从2韦伯变为0，求线圈中的感应电动势。'
      },
      {
        id: '2',
        title: '解析',
        content: '根据电磁感应定律 ε = -N·dΦ/dt\n代入数据：N = 100，dΦ = -2韦伯，dt = 0.01秒\nε = -100 × (-2) ÷ 0.01 = 20000(伏)'
      }
    ]
  },
  {
    id: '15',
    title: '相对论质能方程',
    content: 'E = mc²',
    description: '物体的能量等于其质量与光速平方的乘积',
    accuracy: 25,
    isFavorite: false,
    subject: 'physics',
    level: '高中',
    relatedLower: [],
    relatedHigher: [],
    examples: [
      {
        id: '1',
        title: '例题',
        content: '一个质量为1千克的物体所蕴含的能量是多少？（光速c = 3×10⁸米/秒）'
      },
      {
        id: '2',
        title: '解析',
        content: '根据质能方程 E = mc²\n代入数据：m = 1千克，c = 3×10⁸米/秒\nE = 1 × (3×10⁸)² = 9×10¹⁶(焦耳)'
      }
    ]
  },

  // 化学公式
  {
    id: '16',
    title: '水的电离',
    content: 'H₂O ⇌ H⁺ + OH⁻',
    description: '水分子电离生成氢离子和氢氧根离子的过程',
    accuracy: 90,
    isFavorite: false,
    subject: 'chemistry',
    level: '初中',
    relatedLower: [],
    relatedHigher: [],
    examples: [
      {
        id: '1',
        title: '例题',
        content: '在25℃时，纯水中氢离子浓度是多少？'
      },
      {
        id: '2',
        title: '解析',
        content: '在25℃时，纯水的离子积常数Kw = 10⁻¹⁴，根据水的电离公式 H₂O ⇌ H⁺ + OH⁻\n[H⁺][OH⁻] = 10⁻¹⁴\n由于纯水中[H⁺] = [OH⁻]，因此[H⁺] = 10⁻⁷mol/L'
      }
    ]
  },
  {
    id: '17',
    title: '硫酸反应',
    content: 'H₂SO₄ + 2NaOH = Na₂SO₄ + 2H₂O',
    description: '硫酸与氢氧化钠反应生成硫酸钠和水',
    accuracy: 80,
    isFavorite: false,
    subject: 'chemistry',
    level: '初中',
    relatedLower: [],
    relatedHigher: [],
    examples: [
      {
        id: '1',
        title: '例题',
        content: '将20mL 0.1mol/L的硫酸溶液与40mL 0.1mol/L的氢氧化钠溶液混合，溶液的pH如何变化？'
      },
      {
        id: '2',
        title: '解析',
        content: '根据反应方程式 H₂SO₄ + 2NaOH = Na₂SO₄ + 2H₂O\n硫酸的物质的量：20mL × 0.1mol/L = 0.002mol\n氢氧化钠的物质的量：40mL × 0.1mol/L = 0.004mol\n根据反应方程式，1mol硫酸需要2mol氢氧化钠，0.002mol硫酸需要0.004mol氢氧化钠\n由于反应物恰好完全消耗，生成的是中性盐Na₂SO₄，所以溶液呈中性，pH=7'
      }
    ]
  },
  {
    id: '18',
    title: '摩尔质量',
    content: 'M = m/n',
    description: '摩尔质量等于物质的质量除以物质的量',
    accuracy: 75,
    isFavorite: false,
    subject: 'chemistry',
    level: '高中',
    relatedLower: [],
    relatedHigher: [],
    examples: [
      {
        id: '1',
        title: '例题',
        content: '计算氯化钠(NaCl)的摩尔质量。(Na=23, Cl=35.5)'
      },
      {
        id: '2',
        title: '解析',
        content: '氯化钠(NaCl)的摩尔质量M = 23 + 35.5 = 58.5g/mol'
      }
    ]
  },
  {
    id: '19',
    title: '气体状态方程',
    content: 'PV = nRT',
    description: '描述理想气体状态之间关系的方程',
    accuracy: 60,
    isFavorite: true,
    subject: 'chemistry',
    level: '高中',
    relatedLower: [],
    relatedHigher: [],
    examples: [
      {
        id: '1',
        title: '例题',
        content: '在标准状况下(273.15K, 101.325kPa)，1mol理想气体的体积是多少？'
      },
      {
        id: '2',
        title: '解析',
        content: '根据气体状态方程 PV = nRT\nV = nRT/P\n代入数据：n = 1mol，R = 8.314J/(mol·K)，T = 273.15K，P = 101325Pa\nV = 1 × 8.314 × 273.15 ÷ 101325 = 22.4×10⁻³m³ = 22.4L'
      }
    ]
  },
  {
    id: '20',
    title: '化学平衡常数',
    content: 'K = [C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ',
    description: '对于反应aA + bB ⇌ cC + dD，平衡常数K表示产物和反应物浓度的比值',
    accuracy: 25,
    isFavorite: false,
    subject: 'chemistry',
    level: '高中',
    relatedLower: [],
    relatedHigher: [],
    examples: [
      {
        id: '1',
        title: '例题',
        content: '对于反应N₂ + 3H₂ ⇌ 2NH₃，平衡时[N₂] = 0.1mol/L，[H₂] = 0.2mol/L，[NH₃] = 0.4mol/L，求平衡常数K。'
      },
      {
        id: '2',
        title: '解析',
        content: '根据化学平衡常数公式 K = [NH₃]²/([N₂][H₂]³)\n代入数据：[N₂] = 0.1mol/L，[H₂] = 0.2mol/L，[NH₃] = 0.4mol/L\nK = (0.4)² ÷ (0.1 × (0.2)³) = 0.16 ÷ (0.1 × 0.008) = 0.16 ÷ 0.0008 = 200'
      }
    ]
  }
];

// 确保两个页面的数据相互同步
// 实际项目中应该使用Redux或Context API来共享状态
// 这里为了简化仅展示基本逻辑

// 从localStorage获取可能的收藏状态更新
const syncFormulasWithStorage = () => {
  ALL_FORMULAS.forEach(formula => {
    const storedValue = localStorage.getItem(`formula_favorite_${formula.id}`);
    if (storedValue !== null) {
      try {
        // 尝试解析JSON格式
        const favoriteData = JSON.parse(storedValue);
        formula.isFavorite = favoriteData.isFavorite;
        formula.favoriteTimestamp = favoriteData.timestamp || undefined;
      } catch (e) {
        // 兼容旧版本格式
        formula.isFavorite = storedValue === 'true';
      }
    }
  });
};

// 公式详情页组件
const FormulaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [formula, setFormula] = useState<any>(null);
  const [prevFormula, setPrevFormula] = useState<any>(null);
  const [nextFormula, setNextFormula] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  // 添加返回上一个公式功能所需的状态
  const [previousFormula, setPreviousFormula] = useState<any>(null);

  // 修改反馈相关状态
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackTypes, setFeedbackTypes] = useState({
    errorReport: false,
    difficultExplanation: false,
    incompleteExplanation: false,
    formatIssue: false
  });
  const [feedbackContent, setFeedbackContent] = useState('');

  // 添加函数，根据公式ID获取公式完整信息
  const getFormulaById = (formulaId: string) => {
    return ALL_FORMULAS.find(f => String(f.id) === String(formulaId));
  };

  // 添加函数，获取相关公式的学段信息
  const getRelatedFormulaWithLevel = (item: { id: string, title: string }) => {
    const fullFormula = getFormulaById(item.id);
    return {
      ...item,
      level: fullFormula?.level || ''
    };
  };

  // 加载公式数据
  useEffect(() => {
    // 首先同步可能的收藏状态变化
    syncFormulasWithStorage();

    if (id) {
      console.log("Looking for formula with ID:", id);

      // 优化公式查找逻辑，更严格地比较ID
      const currentFormula = ALL_FORMULAS.find(f => {
        const formulaId = String(f.id);
        const paramId = String(id);
        return formulaId === paramId;
      });

      if (currentFormula) {
        console.log("Found formula:", currentFormula.title);
        setFormula(currentFormula);

        // 检查是否是从收藏弹窗进入
        const fromFavorites = sessionStorage.getItem('fromFavoritesModal') === 'true';
        
        if (fromFavorites) {
          // 使用收藏的公式列表进行导航
          const favoriteFormulas = ALL_FORMULAS.filter(f => f.isFavorite);
          
          // 确保按照ID的数值顺序排序
          const sortedFavoriteFormulas = [...favoriteFormulas].sort((a, b) => {
            const aNum = parseInt(String(a.id));
            const bNum = parseInt(String(b.id));
            return aNum - bNum;
          });
          
          // 找到当前公式在收藏列表中的索引
          const currentIndex = sortedFavoriteFormulas.findIndex(f => String(f.id) === String(id));
          
          console.log("Current index in favorites:", currentIndex);
          
          if (currentIndex > 0) {
            setPrevFormula(sortedFavoriteFormulas[currentIndex - 1]);
          } else {
            setPrevFormula(null);
          }
          
          if (currentIndex < sortedFavoriteFormulas.length - 1) {
            setNextFormula(sortedFavoriteFormulas[currentIndex + 1]);
          } else {
            setNextFormula(null);
          }
        } else {
          // 使用同一学科和学段内的公式进行导航（原有逻辑）
          const sameTypeFormulas = ALL_FORMULAS.filter(
            f => f.subject === currentFormula.subject && f.level === currentFormula.level
          );

          console.log("Found same type formulas:", sameTypeFormulas.length);

          // 确保按照ID的数值顺序排序
          const sortedFormulas = [...sameTypeFormulas].sort((a, b) => {
            const aNum = parseInt(String(a.id));
            const bNum = parseInt(String(b.id));
            return aNum - bNum;
          });

          // 找到当前公式在排序后数组中的索引
          const currentIndex = sortedFormulas.findIndex(f => String(f.id) === String(id));

          console.log("Current index:", currentIndex);

          if (currentIndex > 0) {
            setPrevFormula(sortedFormulas[currentIndex - 1]);
          } else {
            setPrevFormula(null);
          }

          if (currentIndex < sortedFormulas.length - 1) {
            setNextFormula(sortedFormulas[currentIndex + 1]);
          } else {
            setNextFormula(null);
          }
        }
      } else {
        // 公式不存在，可以重定向回首页
        console.log("Formula not found:", id);
        navigate('/');
      }
    }
  }, [id, navigate]);

  // 处理返回按钮点击 - 根据导航状态决定返回路径
  const handleBackClick = () => {
    navigate('/');
  };

  // 处理练习按钮点击
  const handlePracticeClick = () => {
    navigate(`/practice/${id}`);
  };

  // 显示提示消息
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);

    // 3秒后自动隐藏
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // 处理收藏按钮点击
  const handleFavoriteToggle = () => {
    if (!formula) return;

    // 更新本地状态
    const newIsFavorite = !formula.isFavorite;
    const timestamp = newIsFavorite ? new Date().getTime() : undefined; // 获取当前时间戳
    
    setFormula({
      ...formula,
      isFavorite: newIsFavorite,
      favoriteTimestamp: timestamp
    });

    // 更新ALL_FORMULAS中的状态
    const index = ALL_FORMULAS.findIndex(f => f.id === formula.id);
    if (index !== -1) {
      ALL_FORMULAS[index].isFavorite = newIsFavorite;
      ALL_FORMULAS[index].favoriteTimestamp = timestamp;
    }

    // 保存到localStorage以便在首页和详情页之间共享状态
    localStorage.setItem(
      `formula_favorite_${formula.id}`, 
      JSON.stringify({ 
        isFavorite: newIsFavorite, 
        timestamp: timestamp 
      })
    );

    // 显示提示消息
    if (newIsFavorite) {
      showToastMessage(`已将「${formula.title}」添加到您的收藏中`);
    } else {
      showToastMessage(`已将「${formula.title}」从收藏中移除`);
    }
  };

  // 处理上一个/下一个公式导航
  const handlePrevClick = () => {
    if (prevFormula) {
      const prevId = String(prevFormula.id);
      // 保留fromFavoritesModal状态，确保导航逻辑一致性
      navigate(`/formula/${prevId}`);
    }
  };

  const handleNextClick = () => {
    if (nextFormula) {
      const nextId = String(nextFormula.id);
      // 保留fromFavoritesModal状态，确保导航逻辑一致性
      navigate(`/formula/${nextId}`);
    }
  };

  // 处理相关公式点击，修改为保存当前公式以便返回
  const handleRelatedItemClick = (relatedId: string) => {
    // 保存当前公式到历史记录，以便返回
    if (formula) {
      setPreviousFormula(formula);
    }
    navigate(`/formula/${relatedId}`);
  };

  // 处理复选框变更
  const handleCheckboxChange = (field: keyof typeof feedbackTypes) => {
    setFeedbackTypes(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // 提交反馈
  const handleSubmitFeedback = () => {
    // 检查是否至少选择了一个反馈类型
    const hasSelectedType = Object.values(feedbackTypes).some(value => value);

    if (!hasSelectedType && !feedbackContent.trim()) {
      showToastMessage('请至少选择一个反馈类型或填写反馈内容');
      return;
    }

    // 在实际应用中，这里应该发送反馈数据到服务器
    console.log("提交反馈:", {
      formulaId: id,
      formulaTitle: formula?.title,
      feedbackTypes,
      content: feedbackContent
    });

    // 重置表单并关闭模态框
    setFeedbackTypes({
      errorReport: false,
      difficultExplanation: false,
      incompleteExplanation: false,
      formatIssue: false
    });
    setFeedbackContent('');
    setShowFeedbackModal(false);

    // 显示提交成功提示
    showToastMessage('感谢您的反馈，我们会尽快处理！');
  };

  // 处理反馈按钮点击
  const handleFeedbackClick = () => {
    setShowFeedbackModal(true);
  };

  // 处理关闭弹窗按钮点击
  const handleCloseModal = () => {
    // 为关闭动画添加过渡效果
    const container = document.querySelector('.formula-detail-container');
    if (container) {
      container.classList.add('closing');
      
      // 等待动画完成后再导航
      setTimeout(() => {
        // 检查是否是从收藏弹窗进入的
        const fromFavorites = sessionStorage.getItem('fromFavoritesModal') === 'true';
        
        if (fromFavorites) {
          // 直接设置一个标记，表示详情页已关闭且需要打开收藏弹窗
          sessionStorage.setItem('openFavoritesModalDirectly', 'true');
        }
        
        // 保持fromFavoritesModal标记不变，只用于导航逻辑
        navigate('/', { replace: true }); // 使用replace模式避免在历史记录中添加多余的条目
      }, 300); // 延长动画时间，提供更平滑的体验
    } else {
      // 检查是否是从收藏弹窗进入的
      const fromFavorites = sessionStorage.getItem('fromFavoritesModal') === 'true';
      
      if (fromFavorites) {
        sessionStorage.setItem('openFavoritesModalDirectly', 'true');
      }
      
      navigate('/', { replace: true });
    }
  };

  // 添加返回上一个公式的处理函数
  const handleReturnToPreviousFormula = () => {
    if (previousFormula) {
      navigate(`/formula/${previousFormula.id}`);
      // 清除历史记录，防止循环导航
      setPreviousFormula(null);
    }
  };

  // 如果公式数据尚未加载，显示加载状态
  if (!formula) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '36px', color: '#4a89dc', marginBottom: '16px' }}></i>
          <div style={{ fontSize: '18px', color: '#5a6379' }}>加载公式内容...</div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="formula-detail-container">
      <BackButton onClick={handleBackClick}>
        <i className="fas fa-arrow-left"></i> 返回公式列表
      </BackButton>

      {/* 将关闭按钮移至Container下，使其位于弹窗外部 */}
      <CloseDetailButton onClick={handleCloseModal}>
        <i className="fas fa-times"></i>
      </CloseDetailButton>

      <FormulaCard>
        <CardHeader>
          {/* 根据是否有前一个公式决定是否显示按钮 */}
          {prevFormula ? (
            <NavButtonHeader
              direction="prev"
              onClick={handlePrevClick}
            >
              <i className="fas fa-chevron-left"></i>
              <span>{prevFormula.title}</span>
            </NavButtonHeader>
          ) : (
            <div></div> /* 占位元素，保持布局 */
          )}

          <TitleSection>
            <Title>{formula.title}</Title>
          </TitleSection>

          {/* 根据是否有下一个公式决定是否显示按钮 */}
          {nextFormula ? (
            <NavButtonHeader
              direction="next"
              onClick={handleNextClick}
            >
              <span>{nextFormula.title}</span>
              <i className="fas fa-chevron-right"></i>
            </NavButtonHeader>
          ) : (
            <div></div> /* 占位元素，保持布局 */
          )}
        </CardHeader>

        <ContentContainer>
          <LeftColumn>
            <FormulaSection>
              <FavoriteButton onClick={handleFavoriteToggle} isFavorite={formula.isFavorite}>
                <i className={formula.isFavorite ? 'fas fa-star' : 'far fa-star'} />
              </FavoriteButton>
              
              {/* 添加返回按钮，仅当有历史记录时显示 */}
              {previousFormula && (
                <ReturnButton onClick={handleReturnToPreviousFormula}>
                  <i className="fas fa-arrow-left"></i>
                  返回「{previousFormula.title}」
                </ReturnButton>
              )}
              
              <Formula>{formula.content}</Formula>
              {formula.description && (
                <FormulaDescription>
                  {formula.description}
                </FormulaDescription>
              )}

              {/* 将反馈按钮移到公式区域(FormulaSection)的右下角 */}
              <CornerFeedbackButton onClick={handleFeedbackClick}>
                <i className="fas fa-comment-alt"></i> 反馈
              </CornerFeedbackButton>
            </FormulaSection>

            {(formula.relatedLower.length > 0 || formula.relatedHigher.length > 0) && (
              <RelatedSection>
                {formula.relatedLower.length > 0 && (
                  <RelatedCategory>
                    <SectionTitle>基础公式</SectionTitle>
                    <RelatedList>
                      {formula.relatedLower.map((item: any) => {
                        // 获取包含学段信息的完整相关公式
                        const relatedWithLevel = getRelatedFormulaWithLevel(item);
                        return (
                          <RelatedItem
                            key={relatedWithLevel.id}
                            onClick={() => handleRelatedItemClick(relatedWithLevel.id)}
                          >
                            {relatedWithLevel.title}
                            {relatedWithLevel.level && (
                              <LevelTag level={relatedWithLevel.level}>{relatedWithLevel.level}</LevelTag>
                            )}
                          </RelatedItem>
                        );
                      })}
                    </RelatedList>
                  </RelatedCategory>
                )}

                {formula.relatedHigher.length > 0 && (
                  <RelatedCategory>
                    <SectionTitle>进阶公式</SectionTitle>
                    <RelatedList>
                      {formula.relatedHigher.map((item: any) => {
                        // 获取包含学段信息的完整相关公式
                        const relatedWithLevel = getRelatedFormulaWithLevel(item);
                        return (
                          <RelatedItem
                            key={relatedWithLevel.id}
                            onClick={() => handleRelatedItemClick(relatedWithLevel.id)}
                          >
                            {relatedWithLevel.title}
                            {relatedWithLevel.level && (
                              <LevelTag level={relatedWithLevel.level}>{relatedWithLevel.level}</LevelTag>
                            )}
                          </RelatedItem>
                        );
                      })}
                    </RelatedList>
                  </RelatedCategory>
                )}
              </RelatedSection>
            )}
          </LeftColumn>

          <RightColumn>
            <ExampleSection>
              {/* <SectionTitle>例题与解析</SectionTitle> */}

              {formula.examples.map((example: any) => (
                <ExampleItem key={example.id}>
                  <ExampleTitle>{example.title}</ExampleTitle>
                  <ExampleContent>{example.content}</ExampleContent>
                </ExampleItem>
              ))}
            </ExampleSection>
            
            <ButtonContainer>
              <PracticeButton onClick={handlePracticeClick}>
                <i className="fas fa-edit"></i> 练习此公式
              </PracticeButton>
            </ButtonContainer>
          </RightColumn>
        </ContentContainer>
      </FormulaCard>

      {/* 提示消息Toast组件 */}
      <Toast visible={showToast}>
        <i className={formula?.isFavorite ? "fas fa-star" : "fas fa-check-circle"}></i>
        {toastMessage}
      </Toast>

      {/* 修改反馈模态框 */}
      <FeedbackModal visible={showFeedbackModal}>
        <ModalContent visible={showFeedbackModal}>
          <CloseModalButton onClick={() => setShowFeedbackModal(false)}>
            <i className="fas fa-times"></i>
          </CloseModalButton>

          <ModalTitle>提供反馈</ModalTitle>
          <ModalSubtitle>您的意见将帮助我们改进产品体验</ModalSubtitle>

          <FormGroup>
            <FormLabel>请选择您遇到的问题类型：</FormLabel>

            <CheckboxContainer>
              <CheckboxGroup onClick={() => handleCheckboxChange('errorReport')}>
                <HiddenCheckbox
                  type="checkbox"
                  id="errorReport"
                  checked={feedbackTypes.errorReport}
                  onChange={() => { }}
                />
                <StyledCheckbox checked={feedbackTypes.errorReport} />
                <CheckboxLabel htmlFor="errorReport">公式错误</CheckboxLabel>
              </CheckboxGroup>

              <CheckboxGroup onClick={() => handleCheckboxChange('difficultExplanation')}>
                <HiddenCheckbox
                  type="checkbox"
                  id="difficultExplanation"
                  checked={feedbackTypes.difficultExplanation}
                  onChange={() => { }}
                />
                <StyledCheckbox checked={feedbackTypes.difficultExplanation} />
                <CheckboxLabel htmlFor="difficultExplanation">例题错误</CheckboxLabel>
              </CheckboxGroup>

              <CheckboxGroup onClick={() => handleCheckboxChange('incompleteExplanation')}>
                <HiddenCheckbox
                  type="checkbox"
                  id="incompleteExplanation"
                  checked={feedbackTypes.incompleteExplanation}
                  onChange={() => { }}
                />
                <StyledCheckbox checked={feedbackTypes.incompleteExplanation} />
                <CheckboxLabel htmlFor="incompleteExplanation">解析错误</CheckboxLabel>
              </CheckboxGroup>

              <CheckboxGroup onClick={() => handleCheckboxChange('formatIssue')}>
                <HiddenCheckbox
                  type="checkbox"
                  id="formatIssue"
                  checked={feedbackTypes.formatIssue}
                  onChange={() => { }}
                />
                <StyledCheckbox checked={feedbackTypes.formatIssue} />
                <CheckboxLabel htmlFor="formatIssue">其他</CheckboxLabel>
              </CheckboxGroup>
            </CheckboxContainer>
          </FormGroup>

          <FormGroup>
            <FormLabel>补充描述（可选）：</FormLabel>
            <FormTextarea
              placeholder="详细描述您遇到的问题，我们将认真处理每一条反馈..."
              value={feedbackContent}
              onChange={(e) => setFeedbackContent(e.target.value)}
            />
          </FormGroup>

          <ModalButtons>
            <ModalButton onClick={() => setShowFeedbackModal(false)}>
              取消
            </ModalButton>
            <ModalButton
              primary
              onClick={handleSubmitFeedback}
            >
              提交反馈
            </ModalButton>
          </ModalButtons>
        </ModalContent>
      </FeedbackModal>
    </Container>
  );
};

export default FormulaDetailPage; 
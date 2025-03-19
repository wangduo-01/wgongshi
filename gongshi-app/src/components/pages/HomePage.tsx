import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../common/Header';
import TabBar from '../common/TabBar';
import FormulaCard from '../common/FormulaCard';
import GradeSelectorModal from '../common/GradeSelectorModal';
import AlertModal from '../common/AlertModal';
import FavoritesModal from '../common/FavoritesModal';
import PrintComponent from '../common/PrintComponent';
import SearchModal from '../common/SearchModal';
// 移除react-toastify相关导入
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// 样式化组件
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  background-color: ${props => props.theme.colors.white};
  min-height: 100vh;
  padding: 20px 30px 0 30px;
  position: relative;
  opacity: 1;
  animation: homePageFadeIn 0.25s ease-out;
  
  @keyframes homePageFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const PageHeader = styled.div`
  background-color: #4a89dc;
  color: white;
  padding: 3px 20px;
  position: relative;
  margin: -20px -30px 15px -30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HomeButton = styled.button`
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  font-size: 15px;
  position: absolute;
  left: 20px;
  transition: background-color 0.2s;
  width: 35px;
  height: 35px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  i {
    font-size: 16px;
  }
`;

const HeaderText = styled.div`
  font-size: 18px;
  font-weight: 500;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 4px;
  font-size: 15px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  i {
    font-size: 16px;
  }
`;

const FormulaGridContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
  margin-bottom: 0;
  padding-bottom: 30px;
  border-bottom: none;
  position: relative;
  z-index: 10;
`;

const FormulaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 3px;
  padding: 18px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 5px;
  margin-bottom: 5px;
  background-color: white;
  padding: 8px 0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const ActionButton = styled.div`
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
    color: ${props => props.theme.colors.primary};
    margin-bottom: 6px;
  }
  
  span {
    font-size: 14px;
    color: #555;
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const CardActionButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 22px;
  color: #666;
  transition: color 0.2s;
  
  &:hover {
    color: #4a89dc;
  }
`;

// 主题选项
interface SubjectTab {
  id: string;
  label: string;
}

// 模拟数据 - 在实际应用中应从API或状态管理系统获取
const ALL_SUBJECTS: SubjectTab[] = [
  { id: 'math', label: '数学' },
  { id: 'physics', label: '物理' },
  { id: 'chemistry', label: '化学' },
];

// 扩展Formula接口，添加学科和学段属性
interface Formula {
  id: string;
  title: string;
  content: string;
  accuracy: number;
  isFavorite: boolean;
  subject: string; // 'math', 'physics', 'chemistry'
  level: string; // '小学', '初中', '高中'
  lastPracticed?: Date; // 添加最近练习时间属性，用于排序
  favoriteTimestamp?: number; // 添加收藏时间戳
}

// 扩展模拟公式数据，特别是增加初中数学公式
const ALL_FORMULAS: Formula[] = [
  // 数学公式
  {
    id: '1',
    title: '周长公式',
    content: 'C = 2πr',
    accuracy: 90,
    isFavorite: false,
    subject: 'math',
    level: '小学'
  },
  {
    id: '2',
    title: '面积公式',
    content: 'S = πr²',
    accuracy: 65,
    isFavorite: false,
    subject: 'math',
    level: '小学'
  },
  {
    id: '3',
    title: '三角形面积',
    content: 'S = ½ah',
    accuracy: 85,
    isFavorite: false,
    subject: 'math',
    level: '小学'
  },
  {
    id: '4',
    title: '勾股定理',
    content: 'a² + b² = c²',
    accuracy: -1,
    isFavorite: false,
    subject: 'math',
    level: '初中'
  },
  {
    id: '5',
    title: '平行四边形面积',
    content: 'S = bh',
    accuracy: 80,
    isFavorite: false,
    subject: 'math',
    level: '初中'
  },
  {
    id: '6',
    title: '梯形面积',
    content: 'S = ½h(a+b)',
    accuracy: 25,
    isFavorite: true,
    subject: 'math',
    level: '初中',
    lastPracticed: new Date(2023, 10, 25)
  },
  {
    id: '7', 
    title: '一元二次方程',
    content: 'x = (-b ± √(b² - 4ac)) / 2a',
    accuracy: 55,
    isFavorite: false,
    subject: 'math',
    level: '高中'
  },
  {
    id: '8',
    title: '余弦定理',
    content: 'a² = b² + c² - 2bc·cosA',
    accuracy: 40,
    isFavorite: false,
    subject: 'math',
    level: '高中'
  },
  
  // 添加更多初中数学公式
  {
    id: '21',
    title: '二次函数',
    content: 'y = ax² + bx + c',
    accuracy: 65,
    isFavorite: false,
    subject: 'math',
    level: '初中'
  },
  {
    id: '22',
    title: '圆的面积',
    content: 'S = πr²',
    accuracy: 92,
    isFavorite: false,
    subject: 'math',
    level: '初中'
  },
  {
    id: '23',
    title: '圆的周长',
    content: 'C = 2πr',
    accuracy: 88,
    isFavorite: false,
    subject: 'math',
    level: '初中'
  },
  {
    id: '24',
    title: '矩形面积',
    content: 'S = ab',
    accuracy: 95,
    isFavorite: false,
    subject: 'math',
    level: '初中'
  },
  {
    id: '25',
    title: '三角形面积',
    content: 'S = ½bh',
    accuracy: 75,
    isFavorite: true,
    subject: 'math',
    level: '初中'
  },
  {
    id: '26',
    title: '圆锥体积',
    content: 'V = ⅓πr²h',
    accuracy: 45,
    isFavorite: false,
    subject: 'math',
    level: '初中'
  },
  {
    id: '27',
    title: '圆柱体积',
    content: 'V = πr²h',
    accuracy: 68,
    isFavorite: false,
    subject: 'math',
    level: '初中'
  },
  {
    id: '28',
    title: '球的表面积',
    content: 'S = 4πr²',
    accuracy: 52,
    isFavorite: false,
    subject: 'math',
    level: '初中'
  },
  {
    id: '29',
    title: '球的体积',
    content: 'V = ⅘πr³',
    accuracy: 38,
    isFavorite: false,
    subject: 'math',
    level: '初中'
  },
  {
    id: '30',
    title: '二倍角公式',
    content: 'sin2α = 2sinαcosα',
    accuracy: 30,
    isFavorite: false,
    subject: 'math',
    level: '初中'
  },
  {
    id: '31',
    title: '完全平方公式',
    content: '(a+b)² = a² + 2ab + b²',
    accuracy: 82,
    isFavorite: false,
    subject: 'math',
    level: '初中'
  },
  {
    id: '32',
    title: '平方差公式',
    content: 'a² - b² = (a+b)(a-b)',
    accuracy: 78,
    isFavorite: false,
    subject: 'math',
    level: '初中'
  },
  {
    id: '33',
    title: '立方和公式',
    content: 'a³ + b³ = (a+b)(a² - ab + b²)',
    accuracy: 35,
    isFavorite: false,
    subject: 'math',
    level: '初中'
  },
  {
    id: '34',
    title: '立方差公式',
    content: 'a³ - b³ = (a-b)(a² + ab + b²)',
    accuracy: 42,
    isFavorite: false,
    subject: 'math',
    level: '初中'
  },
  {
    id: '35',
    title: '概率公式',
    content: 'P(A) = 满足事件A的情况数 / 总情况数测试测试测试',
    accuracy: 60,
    isFavorite: false,
    subject: 'math',
    level: '初中'
  },
  {
    id: '36',
    title: '全等三角形判定',
    content: 'SSS, SAS, ASA, AAS, HL',
    accuracy: 55,
    isFavorite: false,
    subject: 'math',
    level: '初中'
  },
  {
    id: '37',
    title: '相似三角形判定',
    content: 'AA, SAS, SSS',
    accuracy: 48,
    isFavorite: false,
    subject: 'math',
    level: '初中'
  },
  {
    id: '38',
    title: '正弦定理',
    content: 'a/sinA = b/sinB = c/sinC = 2R',
    accuracy: 25,
    isFavorite: true,
    subject: 'math',
    level: '初中'
  },
  {
    id: '39',
    title: '余弦定理',
    content: 'a² = b² + c² - 2bc·cosA',
    accuracy: 32,
    isFavorite: false,
    subject: 'math',
    level: '初中'
  },
  {
    id: '40',
    title: '直线方程',
    content: 'y = kx + b',
    accuracy: 85,
    isFavorite: false,
    subject: 'math',
    level: '初中'
  },
  
  // 物理公式
  {
    id: '9',
    title: '速度公式',
    content: 'v = s/t',
    accuracy: 95,
    isFavorite: false,
    subject: 'physics',
    level: '小学'
  },
  {
    id: '10',
    title: '密度公式',
    content: 'ρ = m/V',
    accuracy: 85,
    isFavorite: false,
    subject: 'physics',
    level: '小学'
  },
  {
    id: '11',
    title: '牛顿第二定律',
    content: 'F = ma',
    accuracy: 75,
    isFavorite: false,
    subject: 'physics',
    level: '初中'
  },
  {
    id: '12',
    title: '功公式',
    content: 'W = F·s·cosα',
    accuracy: 65,
    isFavorite: false,
    subject: 'physics',
    level: '初中'
  },
  {
    id: '13',
    title: '电功率公式',
    content: 'P = UI',
    accuracy: 70,
    isFavorite: true,
    subject: 'physics',
    level: '初中'
  },
  {
    id: '14',
    title: '电磁感应定律',
    content: 'ε = -N·dΦ/dt',
    accuracy: 50,
    isFavorite: false,
    subject: 'physics',
    level: '高中'
  },
  {
    id: '15',
    title: '相对论质能方程',
    content: 'E = mc²',
    accuracy: 25,
    isFavorite: false,
    subject: 'physics',
    level: '高中',
    lastPracticed: new Date(2023, 8, 15)
  },
  
  // 添加更多初中物理公式
  {
    id: '41',
    title: '欧姆定律',
    content: 'I = U/R',
    accuracy: 88,
    isFavorite: false,
    subject: 'physics',
    level: '初中'
  },
  {
    id: '42',
    title: '焦耳定律',
    content: 'Q = I²Rt',
    accuracy: 65,
    isFavorite: false,
    subject: 'physics',
    level: '初中'
  },
  {
    id: '43',
    title: '力的合成',
    content: 'F = √(F₁² + F₂² + 2F₁F₂cosα)',
    accuracy: 58,
    isFavorite: false,
    subject: 'physics',
    level: '初中'
  },
  {
    id: '44',
    title: '压强公式',
    content: 'p = F/S',
    accuracy: 82,
    isFavorite: false,
    subject: 'physics',
    level: '初中'
  },
  {
    id: '45',
    title: '液体压强',
    content: 'p = ρgh',
    accuracy: 75,
    isFavorite: false,
    subject: 'physics',
    level: '初中'
  },
  
  // 化学公式
  {
    id: '16',
    title: '水的电离',
    content: 'H₂O ⇌ H⁺ + OH⁻',
    accuracy: 90,
    isFavorite: false,
    subject: 'chemistry',
    level: '初中'
  },
  {
    id: '17',
    title: '硫酸反应',
    content: 'H₂SO₄ + 2NaOH = Na₂SO₄ + 2H₂O',
    accuracy: 80,
    isFavorite: false,
    subject: 'chemistry',
    level: '初中'
  },
  {
    id: '18',
    title: '摩尔质量',
    content: 'M = m/n',
    accuracy: 75,
    isFavorite: false,
    subject: 'chemistry',
    level: '高中'
  },
  {
    id: '19',
    title: '气体状态方程',
    content: 'PV = nRT',
    accuracy: 60,
    isFavorite: true,
    subject: 'chemistry',
    level: '高中'
  },
  {
    id: '20',
    title: '化学平衡常数',
    content: 'K = [C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ',
    accuracy: 25,
    isFavorite: false,
    subject: 'chemistry',
    level: '高中',
    lastPracticed: new Date(2023, 9, 20)
  },
  
  // 添加更多初中化学公式
  {
    id: '46',
    title: '氢氧化钠与盐酸',
    content: 'NaOH + HCl = NaCl + H₂O',
    accuracy: 92,
    isFavorite: false,
    subject: 'chemistry',
    level: '初中'
  },
  {
    id: '47',
    title: '碳酸钙分解',
    content: 'CaCO₃ = CaO + CO₂↑',
    accuracy: 84,
    isFavorite: false,
    subject: 'chemistry',
    level: '初中'
  },
  {
    id: '48',
    title: '铁与氧气反应',
    content: '3Fe + 2O₂ = Fe₃O₄',
    accuracy: 76,
    isFavorite: false,
    subject: 'chemistry',
    level: '初中'
  },
  {
    id: '49',
    title: '铝与氧气反应',
    content: '4Al + 3O₂ = 2Al₂O₃',
    accuracy: 70,
    isFavorite: false,
    subject: 'chemistry',
    level: '初中'
  },
  {
    id: '50',
    title: '物质的量浓度',
    content: 'c = n/V',
    accuracy: 62,
    isFavorite: false,
    subject: 'chemistry',
    level: '初中'
  }
];

// 添加自定义Toast组件
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

// 修改SearchInputWrapper组件，为内部元素提供相对定位基准
const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
`;

// 修改SearchInput样式，确保内部图标有足够空间
const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  border-radius: 20px;
  border: 1px solid #eee;
  padding: 0 60px 0 15px; // 增加右侧内边距，为椭圆形搜索按钮留出空间
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #4a89dc;
  }
`;

// 修改搜索图标样式，添加蓝色背景
const SearchIcon = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  transform: translateY(0);
  color: white;
  font-size: 16px;
  cursor: pointer;
  pointer-events: auto;
  background-color: #4a89dc; // 添加蓝色背景
  width: 100px; // 增加宽度，使其成为椭圆形
  height: 40px; // 增加高度，占满输入框的高度
  border-radius: 20px; // 修改为椭圆形
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #3a79cc; // 悬停时稍微变暗
  }
`;

// 修改清除按钮样式，将其放在输入框内部
const ClearButton = styled.div`
  position: absolute;
  right: 120px; // 调整位置，避开放大镜按钮
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 16px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #666;
  }
`;

// 修改搜索框容器样式，使其具有相对定位属性
const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 10px 0;
  position: relative; // 添加相对定位
`;

const SearchResultsContainer = styled.div`
  position: absolute;
  top: 120px;
  left: 0;
  right: 0;
  background-color: white;
  z-index: 100;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  margin-top: 15px;
  margin-bottom: 20px;
`;

const SearchResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 15px 20px;
`;

const SearchResultsTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin: 0;
`;

const BackToAllButton = styled.button`
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 14px;
  color: #555;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e8e8e8;
  }
  
  i {
    font-size: 12px;
  }
`;

const SearchHeader = styled.div`
  padding: 15px 20px;
  color: #999;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 1px solid #eee;
`;

const RelatedTermItem = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

// 重新添加被覆盖掉的SearchHistoryItem组件
const SearchHistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  
  &:hover {
    background-color: #f9f9f9;
  }
`;

// 添加IconButton组件
const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  
  &:hover {
    color: #4a89dc;
  }
`;

// 添加取消按钮样式
const CancelButton = styled.button`
  background: none;
  border: none;
  color: #4a89dc;
  font-size: 16px;
  padding: 0 10px;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

// 添加无搜索结果提示组件
const NoResultsMessage = styled.div`
  grid-column: 1 / -1;
  height: 300px;
  margin: 50px 0;
  text-align: center;
  color: #999;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  i {
    font-size: 40px;
    margin-bottom: 15px;
    color: #ddd;
  }
  
  p {
    margin: 5px 0;
  }
  
  .suggestion {
    font-size: 14px;
    color: #bababa;
    margin-top: 8px;
  }
`;

// 优化筛选下拉框样式
const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  // padding-bottom: 15px;
  padding-right: 16px;
  position: relative;
  z-index: 1000;
`;

const FilterLabel = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  margin-right: 12px;
  font-weight: 500;
  
  i {
    margin-right: 8px;
    color: #4a89dc;
    font-size: 14px;
  }
`;

const FilterSelectWrapper = styled.div`
  position: relative;
  z-index: 20;
`;

const FilterSelect = styled.select`
  appearance: none;
  background-color: #fff;
  border: 1px solid #e8eef7;
  border-radius: 8px;
  padding: 8px 35px 8px 14px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  outline: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  font-weight: 500;
  
  &:hover {
    border-color: #c0d6f4;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  }
  
  &:focus {
    border-color: #4a89dc;
    box-shadow: 0 3px 12px rgba(74, 137, 220, 0.12);
  }
  
  /* 自定义下拉箭头 */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%234a89dc' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  
  /* 自定义下拉菜单样式 */
  &::-ms-expand {
    display: none;
  }
  
  /* 修改下拉菜单方向为向下 */
  & + select-dropdown {
    top: 100%;
    bottom: auto;
  }
  
  /* 自定义下拉菜单样式 */
  option {
    padding: 10px 14px;
    font-weight: 500;
    background-color: white;
  }
`;

// 添加自定义下拉菜单组件 - 完全重写
const CustomSelectWrapper = styled.div`
  position: relative;
  display: inline-block;
  z-index: 1000;
`;

const SelectButton = styled.div`
  appearance: none;
  background-color: #fff;
  border: 1px solid #e8eef7;
  border-radius: 8px;
  padding: 8px 35px 8px 14px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  outline: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 120px;
  
  &:hover {
    border-color: #c0d6f4;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  }
  
  /* 自定义下拉箭头 */
  &:after {
    content: '';
    width: 10px;
    height: 10px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%234a89dc' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    display: block;
    margin-left: 8px;
  }
`;

// 修改下拉菜单，将其添加到body最外层以避免嵌套z-index问题
const DropdownMenuPortal = styled.div`
  position: fixed;
  z-index: 9999;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  opacity: 1;
  visibility: visible;
`;

const DropdownItem = styled.div<{ isSelected: boolean }>`
  padding: 10px 14px;
  font-size: 14px;
  font-weight: ${props => props.isSelected ? '600' : '500'};
  color: ${props => props.isSelected ? '#4a89dc' : '#333'};
  background-color: ${props => props.isSelected ? '#f5f8ff' : 'white'};
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &:hover {
    background-color: #f5f8ff;
    color: #4a89dc;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #f0f6ff;
  }
`;

const CheckMark = styled.i`
  color: #4a89dc;
  font-size: 12px;
`;

// 修改第一处TabBarWrapper命名冲突
const MainTabBarWrapper = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 0 16px;
  // margin: 12px 0;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  position: relative;
  &::-webkit-scrollbar {
    display: none;
  }
`;

// 更新CustomSelect组件的实现，使用createPortal将下拉菜单渲染到body
const CustomSelect: React.FC<{
  options: Array<{value: string, label: string}>;
  value: string;
  onChange: (value: string) => void;
}> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectButtonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  
  // 处理下拉菜单切换
  const toggleDropdown = () => {
    if (!isOpen) {
      updateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };
  
  // 处理选项点击
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };
  
  // 更新下拉菜单位置
  const updateDropdownPosition = () => {
    if (selectButtonRef.current) {
      const rect = selectButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };
  
  // 点击外部区域关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectButtonRef.current && 
        !selectButtonRef.current.contains(event.target as Node) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    // 窗口大小变化时更新下拉菜单位置
    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isOpen]);
  
  // 获取当前选中选项的标签
  const selectedLabel = options.find(option => option.value === value)?.label || '';
  
  // 使用createPortal将下拉菜单渲染到body
  const renderDropdown = () => {
    if (!isOpen) return null;
    
    return ReactDOM.createPortal(
      <DropdownMenuPortal 
        ref={dropdownRef}
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`
        }}
      >
        {options.map(option => (
          <DropdownItem
            key={option.value}
            isSelected={option.value === value}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
            {option.value === value && (
              <CheckMark className="fas fa-check" />
            )}
          </DropdownItem>
        ))}
      </DropdownMenuPortal>,
      document.body
    );
  };
  
  return (
    <CustomSelectWrapper>
      <SelectButton 
        ref={selectButtonRef}
        onClick={toggleDropdown}
      >
        {selectedLabel}
      </SelectButton>
      {renderDropdown()}
    </CustomSelectWrapper>
  );
};

/**
 * HomePage组件 - 应用首页
 * 
 * 功能：
 * - 显示学科选项卡
 * - 展示公式卡片网格
 * - 支持收藏公式
 * - 支持练习公式
 * - 支持低掌握度公式提醒
 * - 支持切换年级/学段
 * - 右上角功能按钮
 */
const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 获取当前路由信息
  const [activeSubject, setActiveSubject] = useState<string>(() => {
    // 如果是从记录页面跳转过来，使用传递的activeTab
    if (location.state && (location.state as any).fromPage === 'record') {
      return (location.state as any).activeTab || 'math';
    }
    // 从localStorage中获取保存的activeSubject，默认为math
    const savedSubject = localStorage.getItem('activeSubject');
    return savedSubject || 'math';
  });
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [showLowAccuracyModal, setShowLowAccuracyModal] = useState(false);
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
  // 添加收藏弹窗状态
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  
  // 从localStorage中获取保存的学段，默认为初中
  const [currentGrade, setCurrentGrade] = useState<string>(() => {
    const savedGrade = localStorage.getItem('currentGrade');
    return savedGrade || '初中';
  });
  
  // 修改：按学段分别记录最后弹窗时间
  // 使用JSON格式存储不同学段的弹窗时间记录
  const [lastModalShowDates, setLastModalShowDates] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('lastModalShowDates');
    return saved ? JSON.parse(saved) : {};
  });
  
  // 用于标记是否是页面刷新或直接访问（而不是从内部导航返回）
  const isDirectAccess = React.useRef(true);

  // 添加Toast相关状态
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastIcon, setToastIcon] = useState('fas fa-check');

  // 添加搜索弹窗状态
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchResults, setSearchResults] = useState<Formula[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // 添加搜索状态
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [filteredFormulas, setFilteredFormulas] = useState<Formula[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 添加练习状态筛选状态
  const [practiceFilter, setPracticeFilter] = useState<string>('all');

  // 根据当前学段获取可用的学科标签
  const getSubjectsByGrade = (grade: string): SubjectTab[] => {
    // 统计各学科的公式数量
    const mathCount = ALL_FORMULAS.filter(f => f.subject === 'math' && f.level === grade).length;
    const physicsCount = ALL_FORMULAS.filter(f => f.subject === 'physics' && f.level === grade).length;
    const chemistryCount = ALL_FORMULAS.filter(f => f.subject === 'chemistry' && f.level === grade).length;
    
    if (grade === '小学') {
      return [{ id: 'math', label: `数学 (${mathCount})` }];
    } else {
      return [
        { id: 'math', label: `数学 (${mathCount})` },
        { id: 'physics', label: `物理 (${physicsCount})` },
        { id: 'chemistry', label: `化学 (${chemistryCount})` }
      ];
    }
  };

  // 当前学段可用的学科
  const availableSubjects = React.useMemo(() => getSubjectsByGrade(currentGrade), [currentGrade, searchResults, showSearchResults, practiceFilter]);

  // 查找正确率低于阈值的公式
  const findLowAccuracyFormulas = (threshold: number = 30) => {
    return ALL_FORMULAS
      .filter(formula => 
        // 修改：只筛选练习过且正确率低于阈值的公式（排除accuracy为-1的情况）
        formula.accuracy >= 0 && 
        formula.accuracy < threshold && 
        formula.level === currentGrade
      )
      .sort((a, b) => {
        // 如果有lastPracticed属性，按最近练习时间排序（降序）
        if (a.lastPracticed && b.lastPracticed) {
          return b.lastPracticed.getTime() - a.lastPracticed.getTime();
        }
        // 如果只有一个有lastPracticed属性，将其排在前面
        if (a.lastPracticed) return -1;
        if (b.lastPracticed) return 1;
        // 如果都没有lastPracticed属性，按正确率排序（升序）
        return a.accuracy - b.accuracy;
      });
  };

  // 检查是否需要显示弹窗
  // 只在直接访问首页（刷新或从URL直接进入）且当天未显示过该学段的弹窗时显示
  const shouldShowModal = () => {
    // 如果不是直接访问（是从内部导航返回），不显示弹窗
    if (!isDirectAccess.current) {
      console.log("不是直接访问，不显示巩固建议弹窗");
      return false;
    }
    
    // 获取当前日期字符串（YYYY-MM-DD格式，用于按自然日比较）
    const today = new Date().toISOString().split('T')[0];
    
    // 检查当前学段今天是否已经显示过弹窗
    const lastShownForGrade = lastModalShowDates[currentGrade];
    
    console.log(`检查是否显示${currentGrade}学段的巩固建议弹窗`, 
                `今天是: ${today}`, 
                `上次显示是: ${lastShownForGrade || '从未显示'}`);
    
    // 如果当前学段今天没有显示过弹窗，则显示
    return !lastShownForGrade || lastShownForGrade !== today;
  };

  // 设置弹窗已显示
  const markModalAsShown = () => {
    // 获取当前日期字符串（YYYY-MM-DD格式）
    const today = new Date().toISOString().split('T')[0];
    
    // 更新当前学段的显示记录
    const newShowDates = {
      ...lastModalShowDates,
      [currentGrade]: today
    };
    
    // 保存到localStorage
    localStorage.setItem('lastModalShowDates', JSON.stringify(newShowDates));
    setLastModalShowDates(newShowDates);
    
    console.log(`已记录${currentGrade}学段在${today}显示过巩固建议弹窗`);
  };

  // 强制将所有公式的ID转为字符串
  useEffect(() => {
    // 确保所有公式ID都是字符串类型
    ALL_FORMULAS.forEach(formula => {
      if (typeof formula.id !== 'string') {
        formula.id = String(formula.id);
      }
    });
  }, []);

  // 在组件挂载时检查是否有低正确率的公式，并决定是否显示提醒
  useEffect(() => {
    // 检查是否应该显示弹窗
    if (shouldShowModal()) {
      const lowAccuracyFormulas = findLowAccuracyFormulas();
      if (lowAccuracyFormulas.length > 0) {
        // 选择排在最前面的公式（最近练习且正确率低的）
        setSelectedFormula(lowAccuracyFormulas[0]);
        setShowLowAccuracyModal(true);
        // 记录已显示弹窗
        markModalAsShown();
      }
    }
    
    // 组件挂载后，将isDirectAccess设为false，表示后续的渲染都是由导航引起的
    return () => {
      isDirectAccess.current = false;
    };
  }, []); // 空依赖数组确保只在组件挂载时执行一次

  // 监听导航事件，设置isDirectAccess标志
  useEffect(() => {
    // 只有当用户直接访问首页URL时，才将isDirectAccess设为true
    // 对于所有其他导航情况，都设为false
    if (location.pathname === '/') {
      const referrer = document.referrer;
      // 如果没有引用页面或引用页面不是当前域名下的页面，认为是直接访问
      const isDirect = !referrer || !referrer.includes(window.location.host);
      isDirectAccess.current = isDirect;
    } else {
      isDirectAccess.current = false;
    }
  }, [location.pathname]);

  // 根据当前选择的学科和学段筛选公式，并处理不可用学科的情况
  useEffect(() => {
    // 检查当前学科是否在可用学科中
    const isSubjectAvailable = availableSubjects.some(s => s.id === activeSubject);
    const subjectToUse = isSubjectAvailable ? activeSubject : 'math';
    
    // 筛选符合当前学科和学段的公式
    const filteredFormulas = ALL_FORMULAS.filter(formula => 
      formula.subject === subjectToUse && formula.level === currentGrade
    );
    
    setFormulas(filteredFormulas);
    
    // 如果当前学科不可用，自动切换到数学
    if (!isSubjectAvailable && activeSubject !== 'math') {
      setActiveSubject('math');
    }
  }, [activeSubject, currentGrade, availableSubjects]);

  // 从localStorage同步收藏状态
  const syncFavoritesFromStorage = () => {
    ALL_FORMULAS.forEach(formula => {
      const storedValue = localStorage.getItem(`formula_favorite_${formula.id}`);
      if (storedValue !== null) {
        try {
          // 尝试解析JSON格式
          const favoriteData = JSON.parse(storedValue);
          formula.isFavorite = favoriteData.isFavorite;
          if (favoriteData.timestamp) {
            formula.favoriteTimestamp = favoriteData.timestamp;
          }
        } catch (e) {
          // 兼容旧版本格式
          formula.isFavorite = storedValue === 'true';
        }
      }
    });
  };
  
  // 从localStorage同步练习状态
  const syncPracticeDataFromStorage = () => {
    ALL_FORMULAS.forEach(formula => {
      // 读取最近练习时间
      const lastPracticedValue = localStorage.getItem(`formula_lastPracticed_${formula.id}`);
      if (lastPracticedValue) {
        try {
          formula.lastPracticed = new Date(lastPracticedValue);
          console.log(`公式"${formula.title}"的最近练习时间已更新:`, formula.lastPracticed);
        } catch (e) {
          console.error(`解析公式${formula.id}的练习时间失败:`, e);
        }
      }
      
      // 读取准确率
      const accuracyValue = localStorage.getItem(`formula_accuracy_${formula.id}`);
      if (accuracyValue) {
        try {
          formula.accuracy = parseInt(accuracyValue, 10);
          console.log(`公式"${formula.title}"的准确率已更新:`, formula.accuracy);
        } catch (e) {
          console.error(`解析公式${formula.id}的准确率失败:`, e);
        }
      }
    });
    
    // 检查是否有最新练习数据
    const lastPracticedFormulaData = localStorage.getItem('lastPracticedFormulaData');
    if (lastPracticedFormulaData) {
      try {
        const { id, lastPracticed, accuracy } = JSON.parse(lastPracticedFormulaData);
        
        // 查找并更新对应公式
        const formula = ALL_FORMULAS.find(f => f.id === id);
        if (formula) {
          console.log(`更新最近练习的公式"${formula.title}"`);
          formula.lastPracticed = new Date(lastPracticed);
          formula.accuracy = accuracy;
        }
        
        // 清除临时存储的数据
        localStorage.removeItem('lastPracticedFormulaData');
      } catch (e) {
        console.error('解析最近练习公式数据失败:', e);
      }
    }
  };
  
  // 在组件挂载和路由变化时同步收藏状态和练习状态
  useEffect(() => {
    syncFavoritesFromStorage();
    syncPracticeDataFromStorage();
  }, [location.pathname]); // 当路由变化时，重新同步状态
  
  // 处理公式卡片点击
  const handleFormulaClick = (formula: Formula) => {
    // 确保formula.id是字符串并记录日志
    const formulaId = String(formula.id);
    console.log("Clicking formula:", formula.title, "with ID:", formulaId, "Subject:", formula.subject);
    
    // 清除可能存在的从收藏弹窗进入的标记
    sessionStorage.removeItem('fromFavoritesModal');
    
    // 导航前再次检查ID是否有效
    if (formulaId) {
      console.log("Navigating to formula detail:", formulaId, formula.title);
      navigate(`/formula/${formulaId}`);
    } else {
      console.error("Invalid formula ID for:", formula.title);
    }
  };

  // 显示Toast提示的函数
  const showToastMessage = (message: string, icon: string = 'fas fa-check') => {
    setToastMessage(message);
    setToastIcon(icon);
    setShowToast(true);
    
    // 3秒后自动关闭
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // 处理收藏切换
  const handleFavoriteToggle = (id: string) => {
    // 查找当前公式，获取其标题和收藏状态
    const formula = ALL_FORMULAS.find(f => f.id === id);
    if (!formula) return;
    
    const newIsFavorite = !formula.isFavorite;
    const timestamp = new Date().getTime(); // 获取当前时间戳
    
    // 更新本地状态
    setFormulas(formulas.map(f => 
      f.id === id ? { ...f, isFavorite: newIsFavorite, favoriteTimestamp: newIsFavorite ? timestamp : undefined } : f
    ));
    
    // 同时更新ALL_FORMULAS中的收藏状态，确保在切换标签页或学段时状态一致
    const formulaIndex = ALL_FORMULAS.findIndex(f => f.id === id);
    if (formulaIndex !== -1) {
      ALL_FORMULAS[formulaIndex].isFavorite = newIsFavorite;
      ALL_FORMULAS[formulaIndex].favoriteTimestamp = newIsFavorite ? timestamp : undefined;
    }
    
    // 保存到localStorage，确保在公式详情页和首页之间共享状态
    // 存储为JSON对象，包含是否收藏和收藏时间
    localStorage.setItem(
      `formula_favorite_${id}`, 
      JSON.stringify({ 
        isFavorite: newIsFavorite, 
        timestamp: newIsFavorite ? timestamp : null 
      })
    );
    
    // 显示Toast提示
    if (newIsFavorite) {
      showToastMessage(`已将「${formula.title}」添加到您的收藏中`, 'fas fa-star');
    } else {
      showToastMessage(`已将「${formula.title}」从收藏中移除`, 'far fa-star');
      
      // 如果当前在收藏弹窗中，且没有收藏的公式了，可以自动关闭弹窗
      if (showFavoritesModal && ALL_FORMULAS.filter(f => f.isFavorite).length === 0) {
        setShowFavoritesModal(false);
      }
    }
  };

  // 处理练习按钮点击
  const handlePracticeClick = (formula: Formula) => {
    console.log("首页点击练习按钮:", formula.title, "准确率:", formula.accuracy);
    
    // 直接导航到练习页面，不再弹出提示
    // 用户主动点击练习按钮时，应该直接进入练习页面，不管准确率如何
    navigate(`/practice/${formula.id}?from=home`);
  };

  // 处理标签切换，并保存到localStorage
  const handleTabChange = (tabId: string) => {
    setActiveSubject(tabId);
    localStorage.setItem('activeSubject', tabId);
  };
  
  // 处理学段切换
  const handleGradeSelect = () => {
    // 从localStorage获取可能已更新的学段
    const updatedGrade = localStorage.getItem('currentGrade') || '初中';
    
    // 如果学段已更改，更新状态
    if (updatedGrade !== currentGrade) {
      console.log(`学段从${currentGrade}切换到${updatedGrade}`);
      setCurrentGrade(updatedGrade);
      
      // 获取当前日期，用于检查新学段今天是否已显示过弹窗
      const today = new Date().toISOString().split('T')[0];
      const hasShownToday = lastModalShowDates[updatedGrade] === today;
      
      console.log(`新学段${updatedGrade}今天${hasShownToday ? '已经' : '尚未'}显示过弹窗`);
      
      // 只有当新学段今天未显示过弹窗，且有低准确率公式时才显示
      if (!hasShownToday) {
        // 获取新学段中练习过且准确率较低的公式（排除未练习公式）
        const lowAccuracyFormulasInNewGrade = ALL_FORMULAS.filter(
          formula => formula.accuracy >= 0 && formula.accuracy < 30 && formula.level === updatedGrade
        );
        
        console.log(`找到${lowAccuracyFormulasInNewGrade.length}个准确率低于30%的公式`);
        
        if (lowAccuracyFormulasInNewGrade.length > 0) {
          // 找出新学段中准确率最低的公式，或最近练习过的
          const selectedFormula = lowAccuracyFormulasInNewGrade.sort((a, b) => {
            if (a.lastPracticed && b.lastPracticed) {
              return b.lastPracticed.getTime() - a.lastPracticed.getTime();
            }
            if (a.lastPracticed) return -1;
            if (b.lastPracticed) return 1;
            return a.accuracy - b.accuracy;
          })[0];
          
          console.log(`选择显示公式: ${selectedFormula.title}，准确率: ${selectedFormula.accuracy}`);
          
          setSelectedFormula(selectedFormula);
          setShowLowAccuracyModal(true);
          markModalAsShown();
        }
      }
    }
  };
  
  // 处理学段选择器点击 - 这个函数仍然保留，但现在只是触发handleGradeSelect
  const handleGradeSelectorClick = () => {
    // 立即检查是否有新的学段选择
    handleGradeSelect();
  };

  // 处理搜索输入变化
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      // 更新搜索历史（仅在第一次输入关键词时）
      if (!searchQuery.trim() && query.trim()) {
        const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
        setSearchHistory(newHistory);
        localStorage.setItem('search_history', JSON.stringify(newHistory));
      }
      
      // 实时执行搜索，仅筛选当前学段的公式，不限制学科
      const results = ALL_FORMULAS.filter(formula => 
        formula.level === currentGrade &&
        (formula.title.toLowerCase().includes(query.toLowerCase()) || 
         formula.content.toLowerCase().includes(query.toLowerCase()))
      );
      
      // 更新搜索结果并显示
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      // 如果搜索框为空，清空搜索结果并隐藏结果区域
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };
  
  // 处理搜索提交
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (searchQuery.trim()) {
      // 更新搜索历史
      const newHistory = [searchQuery, ...searchHistory.filter(item => item !== searchQuery)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('search_history', JSON.stringify(newHistory));
      
      // 执行搜索，只筛选当前学段的公式，但不限制学科
      const results = ALL_FORMULAS.filter(formula => 
        formula.level === currentGrade &&
        (formula.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
         formula.content.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      // 更新搜索结果，但保持搜索框显示
      setSearchResults(results);
      setShowSearchResults(true);
      // 不关闭搜索框
      // setIsSearching(false);
    }
  };
  
  // 处理历史记录点击
  const handleHistoryClick = (term: string) => {
    setSearchQuery(term);
    
    // 更新搜索历史
    const newHistory = [term, ...searchHistory.filter(item => item !== term)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
    
    // 执行搜索，只筛选当前学段的公式，但不限制学科
    const results = ALL_FORMULAS.filter(formula => 
      formula.level === currentGrade &&
      (formula.title.toLowerCase().includes(term.toLowerCase()) || 
       formula.content.toLowerCase().includes(term.toLowerCase()))
    );
    setSearchResults(results);
    setShowSearchResults(true);
    setIsSearching(false); // 关闭搜索框，显示结果
  };
  
  // 删除历史记录项
  const handleDeleteHistory = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = searchHistory.filter(item => item !== term);
    setSearchHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
  };
  
  // 生成关联词
  const generateRelatedTerms = (): string[] => {
    // 常见的数学、物理、化学相关词汇
    const commonTerms = [
      "面积", "体积", "周长", "三角形", "圆", "球", "方程", "函数",
      "正弦", "余弦", "力", "压强", "电流", "反应", "质量", "速度"
    ];
    return commonTerms;
  };
  
  // 处理关联词点击
  const handleRelatedTermClick = (term: string) => {
    handleHistoryClick(term);
  };

  // 获取搜索历史
  useEffect(() => {
    const savedHistory = localStorage.getItem('search_history');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);
  
  // 搜索框显示时自动聚焦
  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearching]);

  // 每当currentGrade变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('currentGrade', currentGrade);
  }, [currentGrade]);

  // 每当activeSubject变化时保存到localStorage
  useEffect(() => {
    localStorage.setItem('activeSubject', activeSubject);
  }, [activeSubject]);

  // 添加返回按钮处理函数
  const handleHomeClick = () => {
    // 由于已经在首页，所以返回按钮应该刷新页面或执行其他动作
    window.location.reload();
  };

  // 保留新的useEffect，处理从FormulaDetailPage直接打开收藏弹窗
  useEffect(() => {
    // 检查是否需要直接打开收藏弹窗（从公式详情页返回）
    const openFavoritesDirectly = sessionStorage.getItem('openFavoritesModalDirectly');
    
    if (openFavoritesDirectly === 'true') {
      // 清除标记
      sessionStorage.removeItem('openFavoritesModalDirectly');
      
      // 立即打开收藏弹窗
      setShowFavoritesModal(true);
    }
  }, [location]);

  // 恢复原有的函数
  const handleFavoritesClick = () => {
    // 显示收藏弹窗，而不是导航到新页面
    setShowFavoritesModal(true);
  };
  
  const handleRecordsClick = () => {
    navigate('/record');
  };
  
  const handleErrorBookClick = () => {
    navigate('/error-book');
  };

  // 修改TabBar标签文本，显示搜索结果数量和筛选后的公式数量
  const getTabLabel = (subjectId: string) => {
    if (showSearchResults) {
      // 计算当前搜索结果中每个学科的数量，确保结果非负数
      const subjectResults = searchResults.filter(f => f.subject === subjectId);
      // 进一步应用练习状态筛选
      const filteredResults = subjectResults.filter(f => {
        if (practiceFilter === 'all') return true;
        if (practiceFilter === 'practiced') return f.accuracy > 0;
        if (practiceFilter === 'unpracticed') return f.accuracy <= 0;
        return true;
      });
      return `${subjectId === 'math' ? '数学' : subjectId === 'physics' ? '物理' : '化学'} (${filteredResults.length})`;
    }
    
    // 筛选条件下的公式数量
    if (practiceFilter !== 'all') {
      const filteredCount = ALL_FORMULAS.filter(f => {
        const isCurrentSubject = f.subject === subjectId && f.level === currentGrade;
        if (!isCurrentSubject) return false;
        
        if (practiceFilter === 'practiced') return f.accuracy > 0;
        if (practiceFilter === 'unpracticed') return f.accuracy <= 0;
        return true;
      }).length;
      
      return `${subjectId === 'math' ? '数学' : subjectId === 'physics' ? '物理' : '化学'} (${filteredCount})`;
    }
    
    // 所有公式数量
    const count = ALL_FORMULAS.filter(f => f.subject === subjectId && f.level === currentGrade).length;
    return `${subjectId === 'math' ? '数学' : subjectId === 'physics' ? '物理' : '化学'} (${count})`;
  };

  // 获取最近练习的公式
  const getLastPracticedFormula = React.useMemo(() => {
    // 筛选出有lastPracticed属性的公式
    const formulasWithLastPracticed = ALL_FORMULAS.filter(f => f.lastPracticed !== undefined);
    
    // 如果没有任何公式被练习过，返回null
    if (formulasWithLastPracticed.length === 0) {
      return null;
    }
    
    // 找出最近练习的公式
    return formulasWithLastPracticed.reduce((latest, current) => {
      if (!latest.lastPracticed) return current;
      if (!current.lastPracticed) return latest;
      
      return latest.lastPracticed.getTime() > current.lastPracticed.getTime() ? latest : current;
    });
  }, []);

  // 添加一个处理筛选变更的函数
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPracticeFilter(e.target.value);
  };

  // 添加一个effect，确保标签文本在搜索和筛选条件变化时更新
  useEffect(() => {
    // 仅触发更新，不做实际操作
    console.log("搜索或筛选条件变化，更新标签显示");
  }, [searchQuery, searchResults, showSearchResults, practiceFilter]);

  // 处理从其他页面传递过来的状态
  useEffect(() => {
    // 检查是否从记录页面跳转过来
    if (location.state && (location.state as any).fromPage === 'record') {
      const targetTab = (location.state as any).activeTab;
      if (targetTab && ['math', 'physics', 'chemistry'].includes(targetTab)) {
        setActiveSubject(targetTab);
        // 清除状态，防止刷新页面时重复处理
        window.history.replaceState({}, document.title);
      }
    }
  }, [location]);

  return (
    <HomeContainer>
      <PageHeader>
        <HomeButton onClick={handleHomeClick}>
          <i className="fas fa-arrow-left"></i>
        </HomeButton>
        <Header 
          title={`${currentGrade}公式大全`}
          gradeText={currentGrade}
          showGradeSelector
          showRightActions
          onGradeSelectorClick={handleGradeSelectorClick}
          onSearchClick={() => setIsSearching(true)}
          onFavoritesClick={handleFavoritesClick}
          onErrorBookClick={() => navigate('/error-book')}
          onRecordsClick={handleRecordsClick}
        />
      </PageHeader>
      
      {isSearching ? (
        <form onSubmit={handleSearchSubmit}>
          <SearchBarContainer>
            <SearchInputWrapper>
              <SearchInput
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="请输入公式或公式名称"
              />
              {searchQuery.trim() && (
                <ClearButton onClick={(e) => { 
                  e.stopPropagation(); 
                  setSearchQuery(''); 
                  setSearchResults([]);
                  setShowSearchResults(false);
                  // 强制更新标签文本
                  setActiveSubject(prev => prev);
                }}>
                  <i className="fas fa-times"></i>
                </ClearButton>
              )}
              <SearchIcon onClick={(e) => { e.stopPropagation(); handleSearchSubmit(); }}>
                <i className="fas fa-search"></i>
              </SearchIcon>
            </SearchInputWrapper>
            <CancelButton type="button" onClick={(e) => { 
              e.stopPropagation(); 
              setIsSearching(false); 
              setSearchQuery(''); 
              setSearchResults([]);
              setShowSearchResults(false);
            }}>
              取消
            </CancelButton>
          </SearchBarContainer>
        </form>
      ) : (
        <ActionBar>
          <ActionButton onClick={handleFavoritesClick}>
            <i className="fas fa-star"></i>
            <span>我的收藏</span>
          </ActionButton>
          <ActionButton onClick={handleRecordsClick}>
            <i className="fas fa-history"></i>
            <span>练习记录</span>
          </ActionButton>
          <ActionButton onClick={() => setIsSearching(true)}>
            <i className="fas fa-search"></i>
            <span>搜索公式</span>
          </ActionButton>
          <PrintComponent buttonStyle="action" />
        </ActionBar>
      )}

      {/* 使用TabBarWrapper替换之前的TabBarWithFilterContainer */}
      <MainTabBarWrapper>
        <TabBar 
          tabs={availableSubjects.map(subject => ({
            ...subject,
            label: getTabLabel(subject.id)
          }))}
          activeTab={activeSubject}
          onTabChange={handleTabChange}
          key={`tabbar-${searchQuery}-${practiceFilter}`} // 添加key强制组件在搜索或筛选条件变化时重新渲染
        />
        
        <FilterContainer>
          <FilterLabel>
            <i className="fas fa-filter"></i>
            学习状态
          </FilterLabel>
          <CustomSelect
            options={[
              { value: 'all', label: '全部公式' },
              { value: 'practiced', label: '已练习公式' },
              { value: 'unpracticed', label: '未练习公式' }
            ]}
            value={practiceFilter}
            onChange={(value) => setPracticeFilter(value)}
          />
        </FilterContainer>
      </MainTabBarWrapper>

      <FormulaGridContainer>
        <FormulaGrid>
          {/* 根据是否在搜索状态显示不同的公式列表 */}
          {showSearchResults ? (
            (() => {
              // 先应用学科筛选
              const subjectFiltered = searchResults.filter(formula => formula.subject === activeSubject);
              
              // 再应用练习状态筛选
              const filteredResults = subjectFiltered.filter(formula => {
                if (practiceFilter === 'all') return true;
                if (practiceFilter === 'practiced') return formula.accuracy > 0;
                if (practiceFilter === 'unpracticed') return formula.accuracy <= 0;
                return true;
              });
              
              if (filteredResults.length > 0) {
                return filteredResults.map(formula => {
                  formula.id = String(formula.id);
                  const isLastPracticed = !!getLastPracticedFormula && formula.id === getLastPracticedFormula.id;
                  return (
                    <FormulaCard
                      key={formula.id}
                      title={formula.title}
                      content={formula.content}
                      accuracy={formula.accuracy}
                      isFavorite={formula.isFavorite}
                      isLastPracticed={isLastPracticed}
                      searchQuery={searchQuery}
                      onFavoriteToggle={() => handleFavoriteToggle(formula.id)}
                      onPracticeClick={() => handlePracticeClick(formula)}
                      onClick={() => handleFormulaClick(formula)}
                    />
                  );
                });
              } else {
                return (
                  <NoResultsMessage>
                    <i className="fas fa-search"></i>
                    <div>
                      <p>当前筛选条件下未找到与"{searchQuery}"相关的{activeSubject === 'math' ? '数学' : activeSubject === 'physics' ? '物理' : '化学'}公式</p>
                      {practiceFilter !== 'all' ? (
                        <p className="suggestion">尝试更改筛选条件或搜索其他关键词</p>
                      ) : (
                        searchResults.length > 0 ? (
                          <p className="suggestion">已在其他学科找到匹配结果，请点击上方对应标签查看</p>
                        ) : (
                          <p className="suggestion">可尝试其他关键词或切换学科查找</p>
                        )
                      )}
                    </div>
                  </NoResultsMessage>
                );
              }
            })()
          ) : (
            (() => {
              const filteredList = formulas.filter(formula => {
                if (practiceFilter === 'all') return true;
                if (practiceFilter === 'practiced') return formula.accuracy > 0;
                if (practiceFilter === 'unpracticed') return formula.accuracy <= 0;
                return true;
              });
              
              if (filteredList.length === 0) {
                return (
                  <NoResultsMessage>
                    <i className="fas fa-filter"></i>
                    <div>
                      <p>当前学科下没有{practiceFilter === 'practiced' ? '已练习' : '未练习'}的公式</p>
                      <p className="suggestion">可以尝试切换筛选条件或学科</p>
                    </div>
                  </NoResultsMessage>
                );
              }
              
              return filteredList.map(formula => {
                formula.id = String(formula.id);
                const isLastPracticed = !!getLastPracticedFormula && formula.id === getLastPracticedFormula.id;
                return (
                  <FormulaCard
                    key={formula.id}
                    title={formula.title}
                    content={formula.content}
                    accuracy={formula.accuracy}
                    isFavorite={formula.isFavorite}
                    isLastPracticed={isLastPracticed}
                    searchQuery={searchQuery}
                    onFavoriteToggle={() => handleFavoriteToggle(formula.id)}
                    onPracticeClick={() => handlePracticeClick(formula)}
                    onClick={() => handleFormulaClick(formula)}
                  />
                );
              });
            })()
          )}
        </FormulaGrid>
      </FormulaGridContainer>
      
      {/* 公式掌握度低提示弹窗 */}
      <AlertModal 
        isOpen={showLowAccuracyModal}
        onClose={() => setShowLowAccuracyModal(false)}
        title="巩固建议"
        content={selectedFormula ? `您对"${selectedFormula.title}"的掌握度较低(${selectedFormula.accuracy}%)，通过短时间练习可以快速提高掌握程度哦！` : ''}
        primaryAction={{
          text: "立即练习",
          onClick: () => {
            setShowLowAccuracyModal(false);
            if (selectedFormula) {
              // 导航到练习页面，添加来源参数
              console.log(`从巩固建议弹窗点击练习公式: ${selectedFormula.title}`);
              navigate(`/practice/${selectedFormula.id}?from=home`);
            }
          }
        }}
        secondaryAction={{
          text: "稍后再说",
          onClick: () => setShowLowAccuracyModal(false)
        }}
        icon={{
          name: "fas fa-graduation-cap",
          color: "#4a89dc"
        }}
      />
      
      {/* 收藏公式弹窗 */}
      <FavoritesModal 
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        favoriteFormulas={ALL_FORMULAS.filter(f => f.isFavorite)}
        onFavoriteToggle={handleFavoriteToggle}
        onPracticeClick={(formula) => {
          console.log("从收藏弹窗点击练习按钮:", formula.title);
          setShowFavoritesModal(false);
          // 导航到练习页面，添加来源为favorites的参数
          navigate(`/practice/${formula.id}?from=favorites`);
        }}
        onFormulaClick={(formula) => {
          setShowFavoritesModal(false);
          sessionStorage.setItem('fromFavoritesModal', 'true');
          sessionStorage.removeItem('fromFormulaDetail');
          // 直接导航到公式详情页并添加from=favorites参数
          console.log(`从收藏弹窗导航到公式 ID: ${formula.id}，添加from=favorites参数`);
          navigate(`/formula/${formula.id}?from=favorites`);
        }}
        onPrintClick={() => {}}
      />
      
      {/* 使用现有的SearchModal组件但不显示，因为我们已经在PageHeader下实现了搜索功能 */}
      <SearchModal 
        isOpen={false}  // 永远不显示
        onClose={() => {}}
        onSearch={(query) => {
          setIsSearching(true);
          setSearchQuery(query);
        }}
        onFormulaClick={(formulaId) => {
          const formula = ALL_FORMULAS.find(f => f.id === formulaId);
          if (formula) {
            handleFormulaClick(formula);
          }
        }}
        allFormulas={ALL_FORMULAS}
      />
      
      {/* Toast提示 */}
      <Toast visible={showToast}>
        <i className={toastIcon}></i>
        {toastMessage}
      </Toast>
    </HomeContainer>
  );
};

export default HomePage;
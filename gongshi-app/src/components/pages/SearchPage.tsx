import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

// 添加关键帧动画
const fadeIn = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const slideUp = `
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

// 主容器 - 全屏背景
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
  ${fadeIn}
  animation: fadeIn 0.3s ease-in-out;
`;

// 顶部导航栏 - 加宽顶部导航栏
const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  position: relative;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const TopBarTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
`;

const BackButton = styled.div`
  color: white;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  transition: all 0.2s ease;
  position: absolute;
  left: 10px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

// 主内容卡片 - 调整左右边距，参考公式详情页
const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 50px 100px; /* 增加水平内边距，从20px改为30px */
  flex: 1;
  ${slideUp}
  animation: slideUp 0.4s ease-out;
  max-width: 1200px; /* 增加最大宽度，从1100px到1200px */
  width: 100%;
  margin: 0 auto;
  margin-top: 30px;
  margin-bottom: 20px;
`;

// 搜索输入框容器
const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 28px;
  padding: 8px 8px 8px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid transparent;
  width: 100%;
  margin-bottom: 20px;
  
  &:focus-within {
    box-shadow: 0 4px 12px rgba(74, 137, 220, 0.15);
    border-color: rgba(74, 137, 220, 0.3);
    background-color: white;
  }
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  flex: 1;
  outline: none;
  font-size: 16px;
  color: #333;
  
  &::placeholder {
    color: #a0a0a0;
    transition: opacity 0.2s ease;
  }
  
  &:focus::placeholder {
    opacity: 0.7;
  }
`;

const SearchButton = styled.button`
  border: none;
  background-color: #4a89dc;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(74, 137, 220, 0.2);
  
  &:hover {
    background-color: #3a6cad;
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  i {
    font-size: 16px;
  }
`;

// 调整部分标题的间距和样式
const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  margin-top: 30px;
  
  &:first-child {
    margin-top: 0;
  }
`;

const SectionTitle = styled.div`
  font-size: 16px;
  color: #3a4255;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  
  i {
    color: #4a89dc;
    font-size: 18px;
  }
`;

const SeeAllButton = styled.div`
  font-size: 14px;
  color: #4a89dc;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

// 优化标签容器布局
const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
`;

// 改进标签样式
const Tag = styled.div`
  background-color: #f0f5ff;
  padding: 8px 16px;
  border-radius: 22px;
  font-size: 14px;
  color: #4a89dc;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(74, 137, 220, 0.1);
  border: 1px solid rgba(74, 137, 220, 0.1);
  display: flex;
  align-items: center;
  
  i {
    margin-right: 8px;
    font-size: 14px;
  }
  
  &:hover {
    background-color: #e0ecff;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(74, 137, 220, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// 优化搜索历史容器布局
const HistoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
`;

// 改进历史项目样式
const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  background-color: #f8f9fd;
  border-radius: 20px;
  padding: 5px 14px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #eef2f7;
  
  &:hover {
    background-color: #f0f5ff;
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(74, 137, 220, 0.1);
  }
`;

const HistoryContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const HistoryIcon = styled.i`
  color: #8a94a6;
  font-size: 14px;
`;

const HistoryText = styled.div`
  font-size: 14px;
  color: #3a4255;
  transition: color 0.2s ease;
  
  ${HistoryContent}:hover & {
    color: #4a89dc;
  }
`;

const DeleteIcon = styled.i`
  color: #8a94a6;
  cursor: pointer;
  font-size: 12px;
  margin-left: 8px;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    color: #f44336;
    background-color: rgba(244, 67, 54, 0.1);
  }
`;

const ClearButton = styled.button`
  background-color: white;
  border: 1px solid #eef2f7;
  border-radius: 20px;
  color: #8a94a6;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  
  i {
    font-size: 14px;
  }
  
  &:hover {
    color: #f44336;
    border-color: rgba(244, 67, 54, 0.3);
    background-color: #fff8f8;
  }
  
  &:active {
    transform: scale(0.97);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #8a94a6;
  
  i {
    font-size: 40px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  p {
    font-size: 15px;
    text-align: center;
    line-height: 1.6;
  }
`;

// 优化搜索结果区域布局
const SearchResultsSection = styled.div`
  margin-top: 20px;
  animation: ${slideUp} 0.4s ease-out;
`;

const SearchResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ResultsCount = styled.div`
  font-size: 14px;
  color: #8a94a6;
`;

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

// 改进搜索结果项目布局，使其与首页公式卡片一致
const ResultItem = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eef2f7;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(74, 137, 220, 0.15);
    border-color: rgba(74, 137, 220, 0.2);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ResultTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #4a89dc;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  
  i {
    font-size: 16px;
  }
`;

const ResultFormula = styled.div`
  font-family: 'Times New Roman', Times, serif;
  font-size: 28px;
  color: #333;
  margin: 20px 0 25px;
  text-align: center;
  font-weight: 500;
`;

const ResultDescription = styled.div`
  font-size: 15px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
`;

const ResultFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
`;

const ResultLevel = styled.div`
  font-size: 13px;
  color: #8a94a6;
  display: flex;
  align-items: center;
  gap: 5px;
  
  i {
    font-size: 12px;
  }
`;

const ResultAccuracy = styled.div<{ accuracy: number }>`
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${props => getAccuracyColor(props.accuracy)};
  
  i {
    font-size: 12px;
  }
`;

// 函数：根据准确率返回对应的颜色
const getAccuracyColor = (accuracy: number) => {
  if (accuracy >= 80) return '#4caf50';
  if (accuracy >= 60) return '#ff9800';
  return '#f44336';
};

// 无搜索结果组件
const NoResults = styled.div`
  text-align: center;
  padding: 50px 40px;
  background-color: #f8fafc;
  border-radius: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const NoResultsIcon = styled.div`
  font-size: 60px;
  color: #e0e6f0;
  margin-bottom: 24px;
  
  i {
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
`;

const NoResultsTitle = styled.h3`
  font-size: 22px;
  color: #4a5568;
  margin-bottom: 16px;
  font-weight: 600;
`;

const NoResultsText = styled.p`
  font-size: 16px;
  color: #718096;
  line-height: 1.6;
  margin-bottom: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

// 确认弹窗组件
const ConfirmModal = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.isVisible ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 24px;
  animation: ${slideUp} 0.3s ease-out;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin-top: 0;
  margin-bottom: 16px;
  text-align: center;
  font-weight: 600;
`;

const ModalText = styled.p`
  font-size: 15px;
  color: #666;
  margin-bottom: 24px;
  text-align: center;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const ModalButton = styled.button<{ primary?: boolean }>`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  background-color: ${props => props.primary ? '#4a89dc' : 'white'};
  color: ${props => props.primary ? 'white' : '#666'};
  border: ${props => props.primary ? 'none' : '1px solid #ddd'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, ${props => props.primary ? '0.15' : '0.05'});
    background-color: ${props => props.primary ? '#3a6cad' : '#f9f9f9'};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// 模拟数据 - 公式和ID的映射
interface FormulaInfo {
  term: string;
  icon: string;
  id: string; // 添加对应的公式ID
  level: string; // 添加学段信息
}

// 添加公式ID信息，用于跳转到公式详情页，并添加学段信息
const HOT_SEARCHES: FormulaInfo[] = [
  // 小学
  { term: '周长公式', icon: 'fas fa-circle', id: '1', level: '小学' },
  { term: '圆的面积', icon: 'fas fa-circle', id: '2', level: '小学' },
  { term: '三角形面积', icon: 'fas fa-draw-polygon', id: '3', level: '小学' },
  { term: '速度公式', icon: 'fas fa-car', id: '9', level: '小学' },
  { term: '密度公式', icon: 'fas fa-cube', id: '10', level: '小学' },
  
  // 初中
  { term: '勾股定理', icon: 'fas fa-square-root-alt', id: '4', level: '初中' },
  { term: '平行四边形面积', icon: 'fas fa-shapes', id: '5', level: '初中' },
  { term: '梯形面积', icon: 'fas fa-shapes', id: '6', level: '初中' },
  { term: '牛顿第二定律', icon: 'fas fa-bowling-ball', id: '11', level: '初中' },
  { term: '功公式', icon: 'fas fa-bolt', id: '12', level: '初中' },
  { term: '电功率公式', icon: 'fas fa-plug', id: '13', level: '初中' },
  
  // 高中
  { term: '一元二次方程', icon: 'fas fa-superscript', id: '7', level: '高中' },
  { term: '余弦定理', icon: 'fas fa-draw-polygon', id: '8', level: '高中' },
  { term: '电磁感应定律', icon: 'fas fa-magnet', id: '14', level: '高中' },
  { term: '质能方程', icon: 'fas fa-atom', id: '15', level: '高中' }
];

// 搜索历史词和公式ID的映射
const HISTORY_FORMULA_MAPPING: {[key: string]: string} = {
  '三角形面积': '3',
  '圆柱体积': '10',
  '勾股定理': '4',
  '椭圆面积': '9',
  '牛顿第二定律': '11',
  '三角函数公式': '8'
};

// 模拟搜索历史
const INITIAL_SEARCH_HISTORY = [
  '三角形面积',
  '圆柱体积',
  '勾股定理',
  '椭圆面积',
  '牛顿第二定律',
  '三角函数公式'
];

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showAllHotSearches, setShowAllHotSearches] = useState(false);
  const [searchResults, setSearchResults] = useState<FormulaInfo[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // 从localStorage获取当前用户学段，默认为小学
  const [currentGrade, setCurrentGrade] = useState<string>(() => {
    const savedGrade = localStorage.getItem('currentGrade');
    return savedGrade || '小学';
  });
  
  // 从localStorage加载搜索历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('无法解析搜索历史', e);
        setSearchHistory(INITIAL_SEARCH_HISTORY);
      }
    } else {
      setSearchHistory(INITIAL_SEARCH_HISTORY);
    }
    
    // 检查是否有建议搜索词（从搜索结果页传递）
    if (location.state && (location.state as any).suggestedTerm) {
      setSearchTerm((location.state as any).suggestedTerm);
    }
    
    // 处理从公式详情页返回，保持搜索状态
    if (location.state && (location.state as any).keepSearchResults) {
      // 恢复搜索词
      if ((location.state as any).searchTerm) {
        setSearchTerm((location.state as any).searchTerm);
      }
      // 将搜索状态设为true，显示搜索结果
      setHasSearched(true);
      // 重新执行搜索，获取结果
      const term = (location.state as any).searchTerm || searchTerm;
      if (term) {
        const results = HOT_SEARCHES.filter(item => 
          item.term.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(results);
      }
    }
    
    // 检查是否需要直接返回首页
    else if (location.state && (location.state as any).shouldReturnHome) {
      // 短暂延迟后自动返回首页，给用户一个视觉上的过渡
      const timer = setTimeout(() => {
        navigate('/');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);
  
  // 保存搜索历史到localStorage
  const saveSearchHistory = (history: string[]) => {
    localStorage.setItem('searchHistory', JSON.stringify(history));
  };
  
  const handleBack = () => {
    // 如果有搜索结果显示，先清除搜索结果，回到搜索主页
    if (hasSearched) {
      setHasSearched(false);
      setSearchTerm('');
      return;
    }
    
    // 否则返回到主页
    navigate('/');
  };
  
  // 执行搜索并在当前页面显示结果
  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    
    // 更新搜索历史，将新搜索添加到顶部，并移除重复项
    const updatedHistory = [
      term, 
      ...searchHistory.filter(item => item !== term)
    ].slice(0, 20); // 只保留最近的20条搜索记录
    
    setSearchHistory(updatedHistory);
    saveSearchHistory(updatedHistory);
    
    // 在当前页面显示搜索结果
    setHasSearched(true);
    
    // 搜索所有公式（这里只考虑名称匹配）
    // 实际应用中可以添加更复杂的搜索逻辑，如模糊匹配、内容匹配等
    const results = HOT_SEARCHES.filter(item => 
      item.term.toLowerCase().includes(term.toLowerCase())
    );
    
    setSearchResults(results);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      handleSearch(searchTerm);
    }
  };
  
  const handleSearchButtonClick = () => {
    if (searchTerm.trim()) {
      handleSearch(searchTerm);
    }
  };
  
  const handleTagClick = (item: FormulaInfo) => {
    // 记录点击的项目到搜索历史
    const updatedHistory = [
      item.term, 
      ...searchHistory.filter(historyItem => historyItem !== item.term)
    ].slice(0, 20);
    
    setSearchHistory(updatedHistory);
    saveSearchHistory(updatedHistory);
    
    // 直接跳转到公式详情页，并传递来源信息
    navigate(`/formula/${item.id}`, { 
      state: { fromSearch: true }  // 添加状态标记来源
    });
  };
  
  const handleHistoryClick = (term: string) => {
    // 用点击的历史记录替换搜索框内容
    setSearchTerm(term);
    // 直接执行搜索
    handleSearch(term);
  };
  
  const handleDeleteHistory = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止冒泡，避免触发整行的点击事件
    
    const updatedHistory = [...searchHistory];
    updatedHistory.splice(index, 1);
    
    setSearchHistory(updatedHistory);
    saveSearchHistory(updatedHistory);
  };
  
  const handleClearHistoryClick = () => {
    setShowConfirmModal(true);
  };
  
  const confirmClearHistory = () => {
    setSearchHistory([]);
    saveSearchHistory([]);
    setShowConfirmModal(false);
  };
  
  // 显示的热门搜索标签数量，并根据用户当前学段进行过滤
  const filteredHotSearches = HOT_SEARCHES.filter(item => item.level === currentGrade);
  const displayedHotSearches = showAllHotSearches 
    ? filteredHotSearches 
    : filteredHotSearches.slice(0, 6);
  
  const handleResultItemClick = (id: string) => {
    navigate(`/formula/${id}`, { 
      state: { 
        fromSearch: true,
        searchTerm: searchTerm
      }
    });
  };
  
  // 格式化公式内容，添加更多信息
  const formatFormula = (formula: FormulaInfo) => {
    // 模拟公式内容和描述，实际项目中应从后端获取
    const formulaContents: {[key: string]: {content: string, description: string, accuracy: number}} = {
      '1': { content: 'C = 2πr', description: '圆的周长等于2倍的圆周率乘以半径', accuracy: 90 },
      '2': { content: 'S = πr²', description: '圆的面积等于圆周率乘以半径的平方', accuracy: 85 },
      '3': { content: 'S = ½ah', description: '三角形的面积等于底边乘以高的积的一半', accuracy: 95 },
      '4': { content: 'a² + b² = c²', description: '直角三角形中，两直角边的平方和等于斜边的平方', accuracy: 75 },
      '5': { content: 'S = ah', description: '平行四边形的面积等于底边乘以高', accuracy: 90 },
      '6': { content: 'S = ½(a+c)h', description: '梯形的面积等于上下底和乘以高的一半', accuracy: 80 },
      '7': { content: 'ax² + bx + c = 0', description: '一元二次方程的标准形式', accuracy: 70 },
      '8': { content: 'c² = a² + b² - 2ab·cosC', description: '余弦定理，适用于所有三角形', accuracy: 65 },
      '9': { content: 'v = s/t', description: '速度等于路程除以时间', accuracy: 95 },
      '10': { content: 'ρ = m/V', description: '密度等于质量除以体积', accuracy: 90 },
      '11': { content: 'F = ma', description: '力等于质量乘以加速度', accuracy: 85 },
      '12': { content: 'W = Fs', description: '功等于力乘以位移', accuracy: 80 },
      '13': { content: 'P = UI', description: '电功率等于电压乘以电流', accuracy: 75 },
      '14': { content: 'E = -dΦ/dt', description: '电磁感应电动势等于磁通量变化率的负值', accuracy: 60 },
      '15': { content: 'E = mc²', description: '质能方程，能量等于质量乘以光速的平方', accuracy: 70 }
    };
    
    return {
      ...formula,
      content: formulaContents[formula.id]?.content || '暂无公式内容',
      description: formulaContents[formula.id]?.description || '暂无描述',
      accuracy: formulaContents[formula.id]?.accuracy || 50
    };
  };
  
  return (
    <Container>
      {/* 顶部导航栏 */}
      <TopBar>
        <BackButton onClick={handleBack}>
          <i className="fas fa-arrow-left"></i>
        </BackButton>
        <TopBarTitle>搜索</TopBarTitle>
      </TopBar>
      
      {/* 主内容卡片 */}
      <Card>
        {/* 搜索框 - 修改默认文案 */}
        <SearchInputContainer>
          <SearchInput 
            placeholder="请输入公式名称" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          {searchTerm && (
            <i 
              className="fas fa-times" 
              style={{ cursor: 'pointer', color: '#999', padding: '0 20px' }}
              onClick={() => {
                setSearchTerm('');
                setHasSearched(false);
              }}
            />
          )}
          <SearchButton onClick={handleSearchButtonClick}>
            <i className="fas fa-search" />
          </SearchButton>
        </SearchInputContainer>
        
        {/* 搜索结果区域 - 只在搜索后显示 */}
        {hasSearched && (
          <SearchResultsSection>
            <SearchResultsHeader>
              <SectionTitle>
                <i className="fas fa-search"></i>
                搜索结果
              </SectionTitle>
              {searchResults.length > 0 && (
                <ResultsCount>找到 {searchResults.length} 个结果</ResultsCount>
              )}
            </SearchResultsHeader>
            
            {searchResults.length > 0 ? (
              <ResultsList>
                {searchResults.map((result, index) => {
                  const formattedResult = formatFormula(result);
                  return (
                    <ResultItem 
                      key={index}
                      onClick={() => handleResultItemClick(result.id)}
                    >
                      <ResultTitle>
                        <i className={result.icon}></i>
                        {result.term}
                      </ResultTitle>
                      <ResultFormula>{formattedResult.content}</ResultFormula>
                      <ResultDescription>{formattedResult.description}</ResultDescription>
                      <ResultFooter>
                        <ResultLevel>
                          <i className="fas fa-graduation-cap"></i>
                          {result.level}
                        </ResultLevel>
                        <ResultAccuracy accuracy={formattedResult.accuracy}>
                          <i className="fas fa-chart-line"></i>
                          准确率: {formattedResult.accuracy}%
                        </ResultAccuracy>
                      </ResultFooter>
                    </ResultItem>
                  );
                })}
              </ResultsList>
            ) : (
              <NoResults>
                <NoResultsIcon>
                  <i className="fas fa-search"></i>
                </NoResultsIcon>
                <NoResultsTitle>未找到"{searchTerm}"相关结果</NoResultsTitle>
                <NoResultsText>
                  抱歉，我们没有找到与您搜索的内容相关的公式。请尝试使用不同的关键词，或者浏览热门公式。
                </NoResultsText>
              </NoResults>
            )}
          </SearchResultsSection>
        )}
        
        {/* 搜索历史和热门搜索 - 仅在未搜索时显示 */}
        {!hasSearched && (
          <>
            {/* 搜索历史 */}
            <SectionHeader>
              <SectionTitle>
                <i className="fas fa-history"></i>
                搜索历史记录
              </SectionTitle>
              
              {searchHistory.length > 0 && (
                <ClearButton onClick={handleClearHistoryClick} style={{ margin: 0 }}>
                  <i className="fas fa-trash-alt"></i>
                  清空
                </ClearButton>
              )}
            </SectionHeader>
            
            {searchHistory.length > 0 ? (
              <HistoryContainer>
                {searchHistory.map((term, index) => (
                  <HistoryItem key={index}>
                    <HistoryContent onClick={() => handleHistoryClick(term)}>
                      <HistoryIcon className="fas fa-history" />
                      <HistoryText>{term}</HistoryText>
                    </HistoryContent>
                    <DeleteIcon 
                      className="fas fa-times" 
                      onClick={(e) => handleDeleteHistory(index, e)}
                    />
                  </HistoryItem>
                ))}
              </HistoryContainer>
            ) : (
              <EmptyState>
                <i className="fas fa-history"></i>
                <p>暂无搜索历史记录<br />您可以尝试搜索或浏览热门公式</p>
              </EmptyState>
            )}
            
            {/* 热门搜索标签 */}
            <SectionHeader>
              <SectionTitle>
                <i className="fas fa-fire"></i>
                大家热搜
              </SectionTitle>
              
              {/* 热搜查看全部按钮智能显示 - 仅当过滤后的热搜数量超过6个时显示 */}
              {filteredHotSearches.length > 6 && (
                <SeeAllButton onClick={() => setShowAllHotSearches(!showAllHotSearches)}>
                  {showAllHotSearches ? '收起' : '查看全部'}
                </SeeAllButton>
              )}
            </SectionHeader>
            
            <TagContainer>
              {displayedHotSearches.length > 0 ? (
                displayedHotSearches.map((item: FormulaInfo, index: number) => (
                  <Tag 
                    key={index}
                    onClick={() => handleTagClick(item)}
                  >
                    <i className={item.icon}></i>
                    {item.term}
                  </Tag>
                ))
              ) : (
                <div style={{ width: '100%', textAlign: 'center', padding: '20px 0', color: '#8a94a6' }}>
                  当前学段暂无热门搜索
                </div>
              )}
            </TagContainer>
          </>
        )}
        
        {/* 确认清空历史弹窗 */}
        <ConfirmModal isVisible={showConfirmModal}>
          <ModalContent>
            <ModalTitle>确认清空搜索历史</ModalTitle>
            <ModalText>确定要清空所有搜索历史记录吗？此操作无法撤销。</ModalText>
            <ModalButtons>
              <ModalButton onClick={() => setShowConfirmModal(false)}>
                取消
              </ModalButton>
              <ModalButton primary onClick={confirmClearHistory}>
                确认清空
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ConfirmModal>
      </Card>
    </Container>
  );
};

export default SearchPage; 
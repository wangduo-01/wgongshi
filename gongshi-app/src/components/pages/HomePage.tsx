import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../common/Header';
import TabBar from '../common/TabBar';
import FormulaCard from '../common/FormulaCard';
import GradeSelectorModal from '../common/GradeSelectorModal';
import AlertModal from '../common/AlertModal';
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
  padding: 20px 30px;
`;

const PageHeader = styled.div`
  background-color: #4a89dc;
  color: white;
  padding: 5px 20px;
  position: relative;
  margin: -20px -30px 20px -30px;
`;

const FormulaGridContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
  margin-bottom: 30px;
`;

const FormulaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-top: 20px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  background-color: white;
  padding: 15px 0;
  border-radius: 10px;
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

// 收藏弹窗相关样式
const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  
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

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eef2f7;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #2a2f45;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 20px;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
    color: #333;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
  
  i {
    font-size: 60px;
    margin-bottom: 20px;
    color: #ddd;
  }
  
  div {
    font-size: 16px;
  }
`;

const PrintButton = styled.button`
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
  margin-left: auto;
  margin-bottom: 20px;
  
  &:hover {
    background-color: #3a6cad;
  }
  
  i {
    font-size: 18px;
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
}

// 模拟公式数据 - 扩展数据包含学科和学段
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
    accuracy: 70,
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
    lastPracticed: new Date(2023, 10, 25) // 添加最近练习时间，确保会优先显示这个公式
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
    lastPracticed: new Date(2023, 8, 15) // 2023-09-15
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
    lastPracticed: new Date(2023, 9, 20) // 2023-10-20，比相对论质能方程更近
  }
];

// 添加自定义Toast组件
const Toast = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  opacity: ${props => props.visible ? '1' : '0'};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  
  i {
    font-size: 18px;
    color: #ffcc00;
  }
`;

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
    // 从localStorage中获取保存的activeSubject，默认为math
    const savedSubject = localStorage.getItem('activeSubject');
    return savedSubject || 'math';
  });
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [showLowAccuracyModal, setShowLowAccuracyModal] = useState(false);
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
  const [showGradeSelectorModal, setShowGradeSelectorModal] = useState(false);
  // 添加收藏弹窗状态
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  
  // 从localStorage中获取保存的学段，默认为初中
  const [currentGrade, setCurrentGrade] = useState<string>(() => {
    const savedGrade = localStorage.getItem('currentGrade');
    return savedGrade || '初中';
  });
  
  // 使用localStorage记录最后一次显示弹窗的时间戳
  // 这样在刷新页面时可以根据时间戳判断是否需要再次显示弹窗
  const [lastModalShowTime, setLastModalShowTime] = useState(() => {
    const saved = localStorage.getItem('lastModalShowTime');
    return saved ? parseInt(saved) : 0;
  });
  
  // 用于标记是否是页面刷新或直接访问（而不是从内部导航返回）
  const isDirectAccess = React.useRef(true);

  // 添加Toast相关状态
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastIcon, setToastIcon] = useState('fas fa-check');

  // 根据当前学段获取可用的学科标签
  const getSubjectsByGrade = (grade: string): SubjectTab[] => {
    if (grade === '小学') {
      return ALL_SUBJECTS.filter(subject => subject.id === 'math');
    } else {
      return ALL_SUBJECTS;
    }
  };

  // 当前学段可用的学科
  const availableSubjects = getSubjectsByGrade(currentGrade);

  // 查找正确率低于阈值的公式
  const findLowAccuracyFormulas = (threshold: number = 30) => {
    return ALL_FORMULAS
      .filter(formula => formula.accuracy < threshold && formula.level === currentGrade) // 只筛选当前学段的公式
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
  // 只在直接访问首页（刷新或从URL直接进入）且一天内未显示过时显示
  const shouldShowModal = () => {
    // 如果不是直接访问（是从内部导航返回），不显示弹窗
    if (!isDirectAccess.current) {
      return false;
    }
    
    const now = Date.now();
    // 24小时内只显示一次弹窗
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    // 恢复时间检查逻辑，确保24小时内只显示一次
    return (now - lastModalShowTime) > oneDayMs;
    // return true; // 测试用，直接返回true
  };

  // 设置弹窗已显示
  const markModalAsShown = () => {
    const now = Date.now();
    localStorage.setItem('lastModalShowTime', now.toString());
    setLastModalShowTime(now);
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

  // 根据当前选择的学科和学段筛选公式
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
    if (!isSubjectAvailable) {
      setActiveSubject('math');
    }
  }, [activeSubject, currentGrade, availableSubjects]);

  // 从localStorage同步收藏状态
  const syncFavoritesFromStorage = () => {
    ALL_FORMULAS.forEach(formula => {
      const storedValue = localStorage.getItem(`formula_favorite_${formula.id}`);
      if (storedValue !== null) {
        formula.isFavorite = storedValue === 'true';
      }
    });
  };
  
  // 在组件挂载和路由变化时同步收藏状态
  useEffect(() => {
    syncFavoritesFromStorage();
    // 根据当前状态筛选公式
    const filteredFormulas = ALL_FORMULAS.filter(formula => 
      formula.subject === activeSubject && formula.level === currentGrade
    );
    setFormulas(filteredFormulas);
  }, [location.pathname]); // 当路由变化时，重新同步收藏状态

  // 处理公式卡片点击
  const handleFormulaClick = (formula: Formula) => {
    // 确保formula.id是字符串并记录日志
    const formulaId = String(formula.id);
    console.log("Clicking formula:", formula.title, "with ID:", formulaId, "Subject:", formula.subject);
    
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
    
    // 更新本地状态
    setFormulas(formulas.map(f => 
      f.id === id ? { ...f, isFavorite: newIsFavorite } : f
    ));
    
    // 同时更新ALL_FORMULAS中的收藏状态，确保在切换标签页或学段时状态一致
    const formulaIndex = ALL_FORMULAS.findIndex(f => f.id === id);
    if (formulaIndex !== -1) {
      ALL_FORMULAS[formulaIndex].isFavorite = newIsFavorite;
    }
    
    // 保存到localStorage，确保在公式详情页和首页之间共享状态
    localStorage.setItem(`formula_favorite_${id}`, String(newIsFavorite));
    
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

  // 处理练习点击
  const handlePracticeClick = (formula: Formula) => {
    // 移除弹窗显示逻辑，只在点击练习按钮时直接导航到练习页面
    navigate(`/practice/${formula.id}`, { 
      state: { source: 'homepage' } 
    });
  };

  // 处理标签切换，并保存到localStorage
  const handleTabChange = (tabId: string) => {
    setActiveSubject(tabId);
    localStorage.setItem('activeSubject', tabId);
  };
  
  // 处理学段切换
  const handleGradeSelect = (grade: string) => {
    setCurrentGrade(grade);
    setShowGradeSelectorModal(false);
    
    // 学段切换后，检查新学段是否有低准确率公式
    // 只有在直接访问首页的情况下才显示弹窗
    if (isDirectAccess.current) {
      const lowAccuracyFormulasInNewGrade = ALL_FORMULAS.filter(
        formula => formula.accuracy < 30 && formula.level === grade
      );
      
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
        
        setSelectedFormula(selectedFormula);
        setShowLowAccuracyModal(true);
        markModalAsShown();
      }
    }
  };
  
  // 处理学段选择器点击
  const handleGradeSelectorClick = () => {
    setShowGradeSelectorModal(true);
  };
  
  // 处理搜索按钮点击
  const handleSearchClick = () => {
    navigate('/search');
  };
  
  // 处理收藏页面导航 - 修改为显示弹窗
  const handleFavoritesClick = () => {
    // 显示收藏弹窗，而不是导航到新页面
    setShowFavoritesModal(true);
  };
  
  // 处理在收藏弹窗中点击公式卡片
  const handleFavoriteFormulaClick = (formula: Formula) => {
    // 关闭弹窗
    setShowFavoritesModal(false);
    // 导航到公式详情页
    handleFormulaClick(formula);
  };
  
  // 处理错题本导航
  const handleErrorBookClick = () => {
    navigate('/error-book');
  };
  
  // 处理记录导航
  const handleRecordsClick = () => {
    navigate('/record');
  };
  
  // 处理立即练习点击 - 保持详情页跳转，但添加弹窗关闭逻辑
  const handleStartPractice = () => {
    setShowLowAccuracyModal(false);
    if (selectedFormula) {
      // 导航到公式详情页
      navigate(`/formula/${selectedFormula.id}`);
    }
  };

  // 每当currentGrade变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('currentGrade', currentGrade);
  }, [currentGrade]);

  // 处理打印按钮点击
  const handlePrintClick = () => {
    window.print();
  };

  // 每当activeSubject变化时保存到localStorage
  useEffect(() => {
    localStorage.setItem('activeSubject', activeSubject);
  }, [activeSubject]);

  return (
    <HomeContainer>
      <PageHeader>
        <Header 
          title={`${currentGrade}公式大全`}
          gradeText={currentGrade}
          showGradeSelector
          showRightActions
          onGradeSelectorClick={handleGradeSelectorClick}
          onSearchClick={handleSearchClick}
          onFavoritesClick={handleFavoritesClick}
          onErrorBookClick={handleErrorBookClick}
          onRecordsClick={handleRecordsClick}
        />
      </PageHeader>
      
      <ActionBar>
        <ActionButton onClick={handleFavoritesClick}>
          <i className="fas fa-star"></i>
          <span>我的收藏</span>
        </ActionButton>
        {/* <ActionButton onClick={handleErrorBookClick}>
          <i className="fas fa-book"></i>
          <span>错题本</span>
        </ActionButton> */}
        <ActionButton onClick={handleRecordsClick}>
          <i className="fas fa-history"></i>
          <span>练习记录</span>
        </ActionButton>
        <ActionButton onClick={handleSearchClick}>
          <i className="fas fa-search"></i>
          <span>搜索公式</span>
        </ActionButton>
        <ActionButton onClick={handlePrintClick}>
          <i className="fas fa-print"></i>
          <span>打印</span>
        </ActionButton>
      </ActionBar>

      <TabBar 
        tabs={availableSubjects}
        activeTab={activeSubject}
        onTabChange={handleTabChange}
      />
      
      <FormulaGridContainer>
        <FormulaGrid>
          {formulas.map(formula => {
            // 在渲染卡片前确保ID为字符串
            formula.id = String(formula.id);
            console.log(`Rendering formula card: ${formula.title}, ID: ${formula.id}, Type: ${typeof formula.id}`);
            
            return (
              <FormulaCard
                key={formula.id}
                title={formula.title}
                content={formula.content}
                accuracy={formula.accuracy}
                isFavorite={formula.isFavorite}
                onFavoriteToggle={() => handleFavoriteToggle(formula.id)}
                onPracticeClick={() => handlePracticeClick(formula)}
                onClick={() => handleFormulaClick(formula)}
              />
            );
          })}
        </FormulaGrid>
      </FormulaGridContainer>
      
      {/* 公式掌握度低提示弹窗 */}
      <AlertModal 
        isOpen={showLowAccuracyModal}
        onClose={() => setShowLowAccuracyModal(false)}
        title="巩固建议"
        content={`您对"${selectedFormula?.title || ''}"的掌握度较低，通过短时间练习可以快速提高掌握程度哦！`}
        primaryAction={{
          text: "立即练习",
          onClick: handleStartPractice
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
      
      {/* 学段选择器弹窗 */}
      <GradeSelectorModal 
        isOpen={showGradeSelectorModal}
        currentGrade={currentGrade}
        onSelect={handleGradeSelect}
        onClose={() => setShowGradeSelectorModal(false)}
      />
      
      {/* 收藏公式弹窗 */}
      <ModalOverlay isOpen={showFavoritesModal} onClick={() => setShowFavoritesModal(false)}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>我的收藏</ModalTitle>
            <CloseButton onClick={() => setShowFavoritesModal(false)}>
              <i className="fas fa-times"></i>
            </CloseButton>
          </ModalHeader>
          
          {/* 获取收藏的公式 */}
          {(() => {
            // 筛选出已收藏的公式
            const favoriteFormulas = ALL_FORMULAS.filter(f => f.isFavorite);
            
            if (favoriteFormulas.length === 0) {
              return (
                <EmptyState>
                  <i className="far fa-star"></i>
                  <div>暂无收藏公式</div>
                </EmptyState>
              );
            }
            
            return (
              <>
                <PrintButton onClick={handlePrintClick}>
                  <i className="fas fa-print"></i> 打印收藏公式
                </PrintButton>
                
                <FormulaGrid>
                  {favoriteFormulas.map(formula => (
                    <FormulaCard
                      key={formula.id}
                      title={formula.title}
                      content={formula.content}
                      accuracy={formula.accuracy}
                      isFavorite={formula.isFavorite}
                      onFavoriteToggle={() => handleFavoriteToggle(formula.id)}
                      onPracticeClick={() => handlePracticeClick(formula)}
                      onClick={() => handleFavoriteFormulaClick(formula)}
                    />
                  ))}
                </FormulaGrid>
              </>
            );
          })()}
        </ModalContainer>
      </ModalOverlay>
      
      {/* Toast提示 */}
      <Toast visible={showToast}>
        <i className={toastIcon}></i>
        {toastMessage}
      </Toast>
    </HomeContainer>
  );
};

export default HomePage; 
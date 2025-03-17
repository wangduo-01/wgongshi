import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import TabBar from '../common/TabBar';
import FormulaCard from '../common/FormulaCard';
import Modal from '../common/Modal';

// 样式化组件
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1280px;
  margin: 0 auto;
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.medium};
  padding: 15px;
  min-height: 800px;
  height: calc(100vh - 40px);
  overflow: hidden;
  
  ${props => props.theme.mediaQueries.tablet} {
    height: auto;
    min-height: 0;
  }
`;

const FormulaGridContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
  
  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
  }
`;

const FormulaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 15px;
  
  ${props => props.theme.mediaQueries.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
  
  ${props => props.theme.mediaQueries.mobile} {
    grid-template-columns: 1fr;
  }
`;

// 主题选项
interface SubjectTab {
  id: string;
  label: string;
}

// 模拟数据 - 在实际应用中应从API或状态管理系统获取
const SUBJECTS: SubjectTab[] = [
  { id: 'math', label: '数学' },
  { id: 'physics', label: '物理' },
  { id: 'chemistry', label: '化学' },
];

// 模拟公式数据
const SAMPLE_FORMULAS = [
  {
    id: '1',
    title: '周长公式',
    content: 'C = 2πr',
    accuracy: 90,
    isFavorite: false,
  },
  {
    id: '2',
    title: '面积公式',
    content: 'S = πr²',
    accuracy: 65,
    isFavorite: false,
  },
  {
    id: '3',
    title: '体积公式',
    content: 'V = πr²h',
    accuracy: 25,
    isFavorite: true,
  },
  {
    id: '4',
    title: '三角形面积',
    content: 'S = ½ah',
    accuracy: 85,
    isFavorite: false,
  },
  {
    id: '5',
    title: '勾股定理',
    content: 'a² + b² = c²',
    accuracy: 70,
    isFavorite: false,
  },
  {
    id: '6',
    title: '长方形面积',
    content: 'S = ab',
    accuracy: 95,
    isFavorite: false,
  },
];

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
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSubject, setActiveSubject] = useState<string>('math');
  const [formulas, setFormulas] = useState(SAMPLE_FORMULAS);
  const [showLowAccuracyModal, setShowLowAccuracyModal] = useState(false);
  const [selectedFormula, setSelectedFormula] = useState<any>(null);

  // 处理公式卡片点击
  const handleFormulaClick = (formula: any) => {
    navigate(`/formula/${formula.id}`);
  };

  // 处理收藏切换
  const handleFavoriteToggle = (id: string) => {
    setFormulas(formulas.map(f => 
      f.id === id ? { ...f, isFavorite: !f.isFavorite } : f
    ));
  };

  // 处理练习点击
  const handlePracticeClick = (formula: any) => {
    // 如果准确率低于30%，显示提醒
    if (formula.accuracy < 30) {
      setSelectedFormula(formula);
      setShowLowAccuracyModal(true);
    } else {
      navigate(`/practice/${formula.id}`);
    }
  };

  // 处理主题标签切换
  const handleTabChange = (tabId: string) => {
    setActiveSubject(tabId);
    // 在实际应用中，这里可能需要加载新的公式数据
  };

  return (
    <HomeContainer>
      <Header 
        title="小学公式大全"
        showGradeSelector
        showRightActions
      />
      
      <TabBar 
        tabs={SUBJECTS}
        activeTab={activeSubject}
        onTabChange={handleTabChange}
      />
      
      <FormulaGridContainer>
        <FormulaGrid>
          {formulas.map(formula => (
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
          ))}
        </FormulaGrid>
      </FormulaGridContainer>
      
      {/* 低准确率提醒弹窗 */}
      <Modal
        isOpen={showLowAccuracyModal}
        onClose={() => setShowLowAccuracyModal(false)}
        title="需要巩固的公式"
      >
        <div>
          <p>发现您对"{selectedFormula?.title}"的掌握度较低（{selectedFormula?.accuracy}%），建议进行针对性练习以提高掌握度。</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
            <button
              style={{
                padding: '8px 20px',
                borderRadius: '5px',
                backgroundColor: 'white',
                color: '#4a89dc',
                border: '1px solid #4a89dc',
                cursor: 'pointer',
              }}
              onClick={() => setShowLowAccuracyModal(false)}
            >
              稍后再说
            </button>
            <button
              style={{
                padding: '8px 20px',
                borderRadius: '5px',
                backgroundColor: '#4a89dc',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => {
                setShowLowAccuracyModal(false);
                navigate(`/practice/${selectedFormula?.id}`);
              }}
            >
              立即练习
            </button>
          </div>
        </div>
      </Modal>
    </HomeContainer>
  );
};

export default HomePage; 
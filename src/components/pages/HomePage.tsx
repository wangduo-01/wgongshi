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
  padding: 20px;
  min-height: 800px;
  height: calc(100vh - 40px);
  overflow: hidden;
  
  ${props => props.theme.mediaQueries.tablet} {
    height: auto;
    min-height: 0;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex: 1;
  margin-top: 15px;
  height: calc(100% - 100px);
  
  ${props => props.theme.mediaQueries.tablet} {
    flex-direction: column;
    height: auto;
  }
`;

const TabsContainer = styled.div`
  width: 180px;
  padding-right: 15px;
  border-right: 1px solid ${props => props.theme.colors.border};
  
  ${props => props.theme.mediaQueries.tablet} {
    width: 100%;
    padding-right: 0;
    border-right: none;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    padding-bottom: 15px;
    margin-bottom: 15px;
  }
`;

const FormulaGridContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-left: 20px;
  
  ${props => props.theme.mediaQueries.tablet} {
    padding-left: 0;
  }
  
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  
  ${props => props.theme.mediaQueries.tablet} {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  ${props => props.theme.mediaQueries.mobile} {
    grid-template-columns: 1fr;
  }
`;

const VerticalTabs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const TabItem = styled.div<{ active: boolean }>`
  padding: 12px 15px;
  font-size: 15px;
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.active ? props.theme.colors.secondary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text.primary};
  font-weight: ${props => props.active ? 500 : 400};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => !props.active && props.theme.colors.background};
  }
  
  ${props => props.theme.mediaQueries.tablet} {
    padding: 10px;
    font-size: 14px;
  }
`;

const CategoryTitle = styled.h2`
  font-size: 18px;
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 20px 0;
  font-weight: 500;
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
      
      <ContentSection>
        <TabsContainer>
          <CategoryTitle>学科</CategoryTitle>
          <VerticalTabs>
            {SUBJECTS.map(subject => (
              <TabItem 
                key={subject.id}
                active={activeSubject === subject.id}
                onClick={() => handleTabChange(subject.id)}
              >
                {subject.label}
              </TabItem>
            ))}
          </VerticalTabs>
        </TabsContainer>
        
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
      </ContentSection>
      
      {/* 准确率低提醒弹窗 */}
      <Modal
        isOpen={showLowAccuracyModal}
        title="准确率较低"
        onClose={() => setShowLowAccuracyModal(false)}
        onConfirm={() => {
          setShowLowAccuracyModal(false);
          if (selectedFormula) {
            navigate(`/practice/${selectedFormula.id}`);
          }
        }}
        confirmText="继续练习"
        cancelText="查看详情"
        onCancel={() => {
          setShowLowAccuracyModal(false);
          if (selectedFormula) {
            navigate(`/formula/${selectedFormula.id}`);
          }
        }}
      >
        <p>您对"{selectedFormula?.title}"的掌握程度较低(准确率{selectedFormula?.accuracy}%)，建议先查看详情后再练习。</p>
      </Modal>
    </HomeContainer>
  );
};

export default HomePage; 
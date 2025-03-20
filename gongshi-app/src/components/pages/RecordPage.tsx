import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactDOM from 'react-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  background-color: #fff;
  min-height: 100vh;
  padding: 0;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 18px 0;
  background-color: #4a89dc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
`;

const HeaderText = styled.h2`
  font-size: 20px;
  color: white;
  font-weight: 600;
  margin: 0;
  text-align: center;
`;

const BackButton = styled.button`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #f5f7fa;
`;

// 顶部信息栏样式
const TopInfoBar = styled.div`
  display: flex;
  margin-bottom: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

// 分隔线标题
const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 20px 0 16px;
  display: flex;
  align-items: center;
  
  &:before {
    content: '';
    display: inline-block;
    width: 3px;
    height: 16px;
    background-color: #4a89dc;
    margin-right: 8px;
    border-radius: 3px;
  }
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
  overflow-x: auto;
  margin: 32px 0;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

interface TabProps {
  active: boolean;
}

const Tab = styled.div<TabProps>`
  padding: 15px 25px;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  font-size: 18px;
  color: ${props => props.active ? '#4a89dc' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  display: flex;
  align-items: center;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${props => props.active ? '#4a89dc' : 'transparent'};
    transition: background-color 0.2s;
  }
`;

const TabText = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TabCount = styled.span<{active: boolean}>`
  font-size: 15px;
  font-weight: 500;
  color: ${props => props.active ? '#4a89dc' : '#666'};
`;

// 统计卡片集合样式
const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 0;
  
  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
    gap: 16px;
    padding: 4px;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

// 统计卡片样式
const StatItem = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 16px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    min-width: 180px;
  }
`;

// 统计图标容器
const StatIconBox = styled.div<{color: string}>`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-color: ${props => props.color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 18px;
`;

// 统计文本容器
const StatText = styled.div`
  display: flex;
  flex-direction: column;
`;

// 统计标签
const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
`;

// 卡片网格，每行3个卡片
const RecordGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

interface CardProps {
  subjectColor: string;
  accuracy: number;
}

// 记录卡片样式
const RecordCard = styled.div<CardProps>`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  position: relative;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 3px solid ${props => {
    // 根据正确率决定边框颜色
    if (props.accuracy >= 80) return '#4cd964'; // 高正确率 - 绿色
    if (props.accuracy >= 60) return '#ff9500'; // 中正确率 - 橙色
    return '#ff3b30'; // 低正确率 - 红色
  }};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

// 日期标签
const DateLabel = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 12px;
  color: #777;
  display: flex;
  align-items: center;
  
  i {
    margin-right: 4px;
    font-size: 11px;
  }
`;

// 学段标签样式
const EducationLevelTag = styled.div<{color: string}>`
  position: absolute;
  top: 15px;
  left: 15px;
  display: inline-flex;
  align-items: center;
  background-color: ${props => `${props.color}15`};
  color: ${props => props.color};
  padding: 0px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  
  i {
    margin-right: 4px;
    font-size: 10px;
  }
`;

// 主题标签
const SubjectTag = styled.div<{color: string}>`
  display: inline-flex;
  align-items: center;
  background-color: ${props => `${props.color}15`};
  color: ${props => props.color};
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 10px;
  
  i {
    margin-right: 4px;
    font-size: 10px;
  }
`;

// 卡片标题
const CardTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 2;
  height: 40px; // 固定高度确保一致性
`;

// 卡片内容区
const CardContent = styled.div`
  margin-top: 25px; // 为日期标签留出空间
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

// 公式内容样式
const FormulaContent = styled.div`
  font-size: 24px;
  color: #000;
  text-align: center;
  font-family: 'Times New Roman', Times, serif;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  max-width: 100%;
  margin: 10px auto;
  
  & > div {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1;
    max-height: 85px;
    text-align: center;
  }
`;

// 卡片底部信息行
const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

// 练习次数和正确率容器
const CardMetrics = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

// 练习次数标签
const PracticeCount = styled.div`
  font-size: 12px;
  color: #555;
  display: flex;
  align-items: center;
  
  i {
    margin-right: 4px;
    font-size: 10px;
    color: #4a89dc;
  }
`;

// 正确率标签
const AccuracyLabel = styled.div<{value: number}>`
  display: inline-flex;
  align-items: center;
  padding: 3px 7px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => {
    if (props.value >= 80) return 'rgba(76, 217, 100, 0.15)';
    if (props.value >= 50) return 'rgba(255, 149, 0, 0.15)';
    return 'rgba(255, 59, 48, 0.15)';
  }};
  color: ${props => {
    if (props.value >= 80) return '#32a852';
    if (props.value >= 50) return '#e67e00';
    return '#d92e2e';
  }};
`;

// 查看详情按钮
const ViewButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  background-color: #4a89dc;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  i {
    margin-left: 3px;
    font-size: 10px;
  }
  
  &:hover {
    background-color: #3a79cc;
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(74, 137, 220, 0.3);
  }
`;

// 无数据状态
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #8590A6;
  text-align: center;
  animation: fadeIn 0.5s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 20px;
    color: #D8E1E9;
    transition: all 0.3s ease;
    animation: float 3s ease-in-out infinite;
    
    @keyframes float {
      0% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
      100% {
        transform: translateY(0px);
      }
    }
    
    &:hover {
      transform: scale(1.1);
      color: #1890FF;
    }
  }
  
  .message {
    font-size: 16px;
    line-height: 1.6;
    margin: 0;
    opacity: 0;
    animation: slideUp 0.5s ease forwards;
    animation-delay: 0.2s;
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
  
  .highlight {
    display: inline-block;
    color: #1890FF;
    cursor: pointer;
    font-weight: 500;
    margin-top: 8px;
    transition: all 0.3s ease;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      width: 100%;
      height: 2px;
      bottom: -2px;
      left: 0;
      background-color: #1890FF;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.3s ease;
    }
    
    &:hover {
      color: #40A9FF;
      
      &:after {
        transform: scaleX(1);
        transform-origin: left;
      }
    }
  }
`;

// 更新学段筛选组件样式，使其与首页学习状态筛选一致
const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
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
    display: block;
    width: 10px;
    height: 10px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%234a89dc' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    margin-left: 8px;
  }
`;

const DropdownMenuPortal = styled.div`
  position: absolute;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  max-height: 250px;
  overflow-y: auto;
  margin-top: 4px;
  animation: dropdownFadeIn 0.2s ease-out;

  @keyframes dropdownFadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

interface DropdownItemProps {
  isSelected?: boolean;
}

const DropdownItem = styled.div<DropdownItemProps>`
  padding: 10px 16px;
  font-size: 14px;
  color: ${props => props.isSelected ? '#4a89dc' : '#333'};
  background-color: ${props => props.isSelected ? '#f0f5ff' : 'white'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &:hover {
    background-color: #f5f8ff;
  }
`;

const CheckMark = styled.i`
  color: #4a89dc;
  font-size: 12px;
`;

type Subject = 'math' | 'physics' | 'chemistry';
type SubjectTab = 'all' | Subject;
type EducationLevel = 'all' | 'elementary' | 'middle' | 'high';

interface PracticeRecord {
  id: string;
  formulaId: string;
  formulaTitle: string;
  date: string;
  questionsCount: number;
  accuracy: number;
  timeSpent: string;
  subject: Subject;
  educationLevel: Exclude<EducationLevel, 'all'>;
}

interface AggregatedRecord {
  formulaId: string;
  formulaTitle: string;
  lastPracticeDate: string;
  totalPractices: number;
  avgAccuracy: number;
  lastAccuracy: number;
  subject: 'math' | 'physics' | 'chemistry';
  educationLevel: 'elementary' | 'middle' | 'high';
  records: PracticeRecord[];
}

// 模拟练习记录数据
const SAMPLE_RECORDS: PracticeRecord[] = [
  {
    id: '1',
    formulaId: 'f1',
    formulaTitle: '二次方程',
    date: '2024-03-15',
    questionsCount: 10,
    accuracy: 0.9,  // 90%正确率
    timeSpent: '15分钟',
    subject: 'math',
    educationLevel: 'middle'
  },
  {
    id: '2',
    formulaId: 'f1',  // 同一个公式的第二条记录
    formulaTitle: '二次方程',
    date: '2024-03-10',
    questionsCount: 8,
    accuracy: 0.7,  // 70%正确率
    timeSpent: '12分钟',
    subject: 'math',
    educationLevel: 'middle'
  },
  {
    id: '3',
    formulaId: 'f2',
    formulaTitle: '牛顿第二定律',
    date: '2024-03-14',
    questionsCount: 8,
    accuracy: 0.7,  // 70%正确率
    timeSpent: '12分钟',
    subject: 'physics',
    educationLevel: 'middle'
  },
  {
    id: '4',
    formulaId: 'f3',
    formulaTitle: '化学方程式配平',
    date: '2024-03-13',
    questionsCount: 12,
    accuracy: 0.2,  // 20%正确率
    timeSpent: '20分钟',
    subject: 'chemistry',
    educationLevel: 'high'
  },
  // 为二次方程添加更多练习记录
  {
    id: '5',
    formulaId: 'f1',
    formulaTitle: '二次方程',
    date: '2024-03-05',
    questionsCount: 12,
    accuracy: 0.65,  // 65%正确率
    timeSpent: '18分钟',
    subject: 'math',
    educationLevel: 'middle'
  },
  {
    id: '6',
    formulaId: 'f1',
    formulaTitle: '二次方程',
    date: '2024-03-01',
    questionsCount: 8,
    accuracy: 0.5,  // 50%正确率
    timeSpent: '13分钟',
    subject: 'math',
    educationLevel: 'middle'
  },
  {
    id: '7',
    formulaId: 'f1',
    formulaTitle: '二次方程',
    date: '2024-02-25',
    questionsCount: 15,
    accuracy: 0.45,  // 45%正确率
    timeSpent: '22分钟',
    subject: 'math',
    educationLevel: 'middle'
  },
  {
    id: '8',
    formulaId: 'f1',
    formulaTitle: '二次方程',
    date: '2024-02-18',
    questionsCount: 10,
    accuracy: 0.3,  // 30%正确率
    timeSpent: '16分钟',
    subject: 'math',
    educationLevel: 'middle'
  },
  {
    id: '9',
    formulaId: 'f1',
    formulaTitle: '二次方程',
    date: '2024-02-10',
    questionsCount: 10,
    accuracy: 0.6,  // 60%正确率
    timeSpent: '14分钟',
    subject: 'math',
    educationLevel: 'middle'
  },
  {
    id: '10',
    formulaId: 'f1',
    formulaTitle: '二次方程',
    date: '2024-02-05',
    questionsCount: 12,
    accuracy: 0.58,  // 58%正确率
    timeSpent: '20分钟',
    subject: 'math',
    educationLevel: 'middle'
  },
  {
    id: '11',
    formulaId: 'f1',
    formulaTitle: '二次方程',
    date: '2024-01-28',
    questionsCount: 8,
    accuracy: 0.5,  // 50%正确率
    timeSpent: '11分钟',
    subject: 'math',
    educationLevel: 'middle'
  },
  {
    id: '12',
    formulaId: 'f1',
    formulaTitle: '二次方程',
    date: '2024-01-20',
    questionsCount: 15,
    accuracy: 0.4,  // 40%正确率
    timeSpent: '25分钟',
    subject: 'math',
    educationLevel: 'middle'
  },
  {
    id: '13',
    formulaId: 'f1',
    formulaTitle: '二次方程',
    date: '2024-01-15',
    questionsCount: 10,
    accuracy: 0.35,  // 35%正确率
    timeSpent: '18分钟',
    subject: 'math',
    educationLevel: 'middle'
  },
  {
    id: '14',
    formulaId: 'f1',
    formulaTitle: '二次方程',
    date: '2024-01-10',
    questionsCount: 8,
    accuracy: 0.25,  // 25%正确率
    timeSpent: '14分钟',
    subject: 'math',
    educationLevel: 'middle'
  },
  // 添加一个趋势为负的数据组（最近的成绩比前一次差）
  {
    id: '15',
    formulaId: 'f4',
    formulaTitle: '三角函数',
    date: '2024-03-16',
    questionsCount: 12,
    accuracy: 0.5,  // 50%正确率
    timeSpent: '18分钟',
    subject: 'math',
    educationLevel: 'high'
  },
  {
    id: '16',
    formulaId: 'f4',
    formulaTitle: '三角函数',
    date: '2024-03-10',
    questionsCount: 15,
    accuracy: 0.7,  // 70%正确率
    timeSpent: '22分钟',
    subject: 'math',
    educationLevel: 'high'
  },
  {
    id: '17',
    formulaId: 'f4',
    formulaTitle: '三角函数',
    date: '2024-03-05',
    questionsCount: 10,
    accuracy: 0.6,  // 60%正确率
    timeSpent: '15分钟',
    subject: 'math',
    educationLevel: 'high'
  },
  // 添加一个趋势为0的数据组（最近两次成绩相同）
  {
    id: '18',
    formulaId: 'f5',
    formulaTitle: '牛顿第三定律',
    date: '2024-03-17',
    questionsCount: 10,
    accuracy: 0.8,  // 80%正确率
    timeSpent: '14分钟',
    subject: 'physics',
    educationLevel: 'high'
  },
  {
    id: '19',
    formulaId: 'f5',
    formulaTitle: '牛顿第三定律',
    date: '2024-03-12',
    questionsCount: 10,
    accuracy: 0.8,  // 80%正确率，与上一次相同
    timeSpent: '15分钟',
    subject: 'physics',
    educationLevel: 'high'
  },
  {
    id: '20',
    formulaId: 'f5',
    formulaTitle: '牛顿第三定律',
    date: '2024-03-08',
    questionsCount: 12,
    accuracy: 0.6,  // 60%正确率
    timeSpent: '18分钟',
    subject: 'physics',
    educationLevel: 'high'
  }
];

// 聚合记录数据
const aggregateRecords = (records: PracticeRecord[]): AggregatedRecord[] => {
  const formulaMap = new Map<string, PracticeRecord[]>();
  
  // 按公式ID分组记录
  records.forEach(record => {
    if (!formulaMap.has(record.formulaId)) {
      formulaMap.set(record.formulaId, []);
    }
    formulaMap.get(record.formulaId)!.push(record);
  });
  
  // 将分组数据转换为聚合记录
  const aggregated: AggregatedRecord[] = [];
  
  formulaMap.forEach((practiceRecords, formulaId) => {
    // 按日期降序排序
    const sortedRecords = [...practiceRecords].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const totalPractices = sortedRecords.length;
    const avgAccuracy = Math.round(
      sortedRecords.reduce((sum, r) => sum + r.accuracy * 100, 0) / totalPractices
    );
    // 获取最近一次练习的正确率，转换为百分比
    const lastAccuracy = Math.round(sortedRecords[0].accuracy * 100);
    
    aggregated.push({
      formulaId,
      formulaTitle: sortedRecords[0].formulaTitle,
      lastPracticeDate: sortedRecords[0].date,
      totalPractices,
      avgAccuracy,
      lastAccuracy,
      subject: sortedRecords[0].subject,
      educationLevel: sortedRecords[0].educationLevel,
      records: sortedRecords
    });
  });
  
  // 按最近练习日期降序排序
  return aggregated.sort(
    (a, b) => new Date(b.lastPracticeDate).getTime() - new Date(a.lastPracticeDate).getTime()
  );
};

// 格式化日期函数
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // 如果是今天
  if (date.getFullYear() === today.getFullYear() && 
      date.getMonth() === today.getMonth() && 
      date.getDate() === today.getDate()) {
    return '今天';
  }
  
  // 如果是昨天
  if (date.getFullYear() === yesterday.getFullYear() && 
      date.getMonth() === yesterday.getMonth() && 
      date.getDate() === yesterday.getDate()) {
    return '昨天';
  }
  
  // 否则返回完整日期
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 科目颜色函数
const getSubjectColor = (subject: 'math' | 'physics' | 'chemistry'): string => {
  switch(subject) {
    case 'math': return '#4a89dc';
    case 'physics': return '#5856d6';
    case 'chemistry': return '#ff9500';
    default: return '#4a89dc';
  }
};

// 科目图标函数
const getSubjectIcon = (subject: 'math' | 'physics' | 'chemistry'): string => {
  switch(subject) {
    case 'math': return 'fas fa-square-root-alt';
    case 'physics': return 'fas fa-atom';
    case 'chemistry': return 'fas fa-flask';
    default: return 'fas fa-book';
  }
};

// 学段颜色函数
const getEducationLevelColor = (level: 'elementary' | 'middle' | 'high'): string => {
  switch(level) {
    case 'elementary': return '#4cd964';
    case 'middle': return '#007aff';
    case 'high': return '#5856d6';
    default: return '#4a89dc';
  }
};

// 学段图标函数
const getEducationLevelIcon = (level: 'elementary' | 'middle' | 'high'): string => {
  switch(level) {
    case 'elementary': return 'fas fa-child';
    case 'middle': return 'fas fa-user';
    case 'high': return 'fas fa-user-graduate';
    default: return 'fas fa-book';
  }
};

// 学段名称映射
const getEducationLevelName = (level: 'elementary' | 'middle' | 'high'): string => {
  switch(level) {
    case 'elementary': return '小学';
    case 'middle': return '初中';
    case 'high': return '高中';
    default: return '';
  }
};

// 模拟公式内容
const FORMULA_CONTENTS: {[key: string]: string} = {
  'f1': 'π = 3.14159',
  'f2': 'S = πr²',
  'f3': 'V = πr²h',
  'f4': 'sin²α + cos²α = 1',
  'f5': 'F₁₂ = -F₂₁',
  'p1': 'F = ma',
  'p2': 'E_k = \\frac{1}{2}mv²',
  'c1': 'm(反应物) = m(生成物)'
};

// 添加自定义下拉选择组件
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
  
  // 使用ReactDOM.createPortal将下拉菜单渲染到body
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

// 获取当前学段可用的科目标签
const getAvailableSubjects = (educationLevel: EducationLevel): SubjectTab[] => {
  switch (educationLevel) {
    case 'elementary':
      return ['all', 'math'];
    case 'middle':
      return ['all', 'math', 'physics', 'chemistry'];
    case 'high':
      return ['all', 'math', 'physics', 'chemistry'];
    default:
      return ['all', 'math', 'physics', 'chemistry'];
  }
};

// 详情列表
const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// 详情项
const DetailItem = styled.div`
  padding: 16px;
  border-radius: 10px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  
  &:hover {
    background-color: #f0f5ff;
    border-color: #d6e4ff;
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  }
`;

// 详情信息
const DetailInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

// 详情日期
const DetailDate = styled.div`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

// 详情正确率
const DetailAccuracy = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  font-size: 14px;
`;

// 重新定义单独的ArrowIcon组件
const ArrowIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a89dc;
  background-color: #ecf5ff;
  border-radius: 50%;
  transition: transform 0.2s ease;
  
  ${DetailItem}:hover & {
    transform: translateX(4px);
  }
`;

// 模态框背景
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
`;

// 模态框内容
const ModalContent = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 0 0 24px 0;
  width: 60vw;
  maxWidth: 60vw;
  height: 60vh;
  maxHeight: 60vh;
  overflowY: auto;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
`;

// 模态框头部
const ModalHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  background-color: #4a89dc;
  color: white;
  position: relative;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  margin-bottom: 16px;
`;

// 模态框标题
const ModalTitle = styled.h3`
  font-size: 16px;
  margin: 0;
  font-weight: 500;
  text-align: center;
`;

// 关闭按钮
const CloseButton = styled.button`
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  font-size: 16px;
  cursor: pointer;
  color: white;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 记录详情页组件
const RecordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 处理返回按钮点击
  const handleBack = () => {
    navigate('/');
  };
  
  // 科目分类标签
  const [activeTab, setActiveTab] = useState<SubjectTab>('all');
  
  // 学段筛选
  const [activeEducationLevel, setActiveEducationLevel] = useState<EducationLevel>('all');
  
  // 聚合记录状态
  const aggregatedRecords = aggregateRecords(SAMPLE_RECORDS);
  
  // 模态框状态
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AggregatedRecord | null>(null);
  
  // 检查是否从练习报告页返回，如果是则打开对应的弹窗
  useEffect(() => {
    // 从location.state中获取信息
    const fromPage = location.state?.fromPage;
    const formulaId = location.state?.formulaId;

    // 如果是从练习报告页返回，并且有公式ID
    if (fromPage === 'record-modal' && formulaId) {
      // 查找对应的记录
      const record = aggregatedRecords.find(r => r.formulaId === formulaId);
      if (record) {
        // 设置选中的记录并显示弹窗
        setSelectedRecord(record);
        setShowDetailModal(true);
        
        // 清除location.state，防止重复触发
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state, aggregatedRecords, navigate, location.pathname]);
  
  // 过滤记录
  const filteredRecords = useMemo(() => {
    // 先根据学段筛选
    const educationLevelFiltered = aggregatedRecords.filter(record => 
      activeEducationLevel === 'all' || record.educationLevel === activeEducationLevel
    );
    
    // 获取当前学段可用的科目
    const availableSubjects = getAvailableSubjects(activeEducationLevel)
      .filter((s): s is Subject => s !== 'all');
    
    // 根据科目和学段限制筛选
    return educationLevelFiltered.filter(record => {
      // 检查科目是否在当前学段可用
      if (!availableSubjects.includes(record.subject)) {
        return false;
      }
      
      // 如果选择了特定科目，只显示该科目的记录
      if (activeTab !== 'all') {
        return record.subject === activeTab;
      }
      
      return true;
    });
  }, [aggregatedRecords, activeTab, activeEducationLevel]);
  
  // 计算统计数据
  const totalPractices = SAMPLE_RECORDS.length;
  const totalFormulas = aggregatedRecords.length;
  const averageAccuracy = Math.round(
    SAMPLE_RECORDS.reduce((sum, record) => sum + record.accuracy * 100, 0) / totalPractices
  );
  
  // 处理记录点击，根据记录数量决定是显示详情模态框还是直接跳转
  const handleRecordClick = (record: AggregatedRecord) => {
    if (record.records.length === 1) {
      // 如果只有一条记录，直接跳转到练习报告页面，并传递来源信息
      navigate(`/practice-result/${record.records[0].id}`, {
        state: { fromPage: 'record' }
      });
    } else {
      // 如果有多条记录，显示弹窗让用户选择
      setSelectedRecord(record);
      setShowDetailModal(true);
    }
  };
  
  // 科目名称映射
  const getSubjectName = (subject: SubjectTab): string => {
    switch(subject) {
      case 'math': return '数学';
      case 'physics': return '物理';
      case 'chemistry': return '化学';
      default: return '全部';
    }
  };
  
  // 修改计算每个科目记录数的逻辑，考虑当前选中的学段
  const getSubjectCount = (subject: SubjectTab): number => {
    // 先根据学段筛选
    const educationLevelFiltered = aggregatedRecords.filter(record => 
      activeEducationLevel === 'all' || record.educationLevel === activeEducationLevel
    );
    
    // 再根据科目筛选，同时考虑学段限制
    const currentSubjects = getAvailableSubjects(activeEducationLevel);
    
    if (subject === 'all') {
      // 如果是全部，需要根据当前学段过滤可用科目
      const subjectsForLevel = currentSubjects
        .filter((s): s is Subject => s !== 'all');
      return educationLevelFiltered.filter(record => subjectsForLevel.includes(record.subject)).length;
    }
    
    // 检查当前科目在当前学段是否可用
    if (!currentSubjects.includes(subject)) {
      return 0;
    }
    
    return educationLevelFiltered.filter(record => record.subject === subject).length;
  };
  
  // 获取学段筛选的计数
  const getEducationLevelCount = (level: EducationLevel): number => {
    if (level === 'all') return aggregatedRecords.length;
    return aggregatedRecords.filter(record => record.educationLevel === level).length;
  };
  
  // 获取空状态提示文案
  const getEmptyStateMessage = (activeTab: SubjectTab, activeEducationLevel: EducationLevel) => {
    const subject = activeTab === 'all' ? '' : 
      activeTab === 'math' ? '数学' :
      activeTab === 'physics' ? '物理' : '化学';
    
    const level = activeEducationLevel === 'all' ? '' :
      activeEducationLevel === 'elementary' ? '小学' :
      activeEducationLevel === 'middle' ? '初中' : '高中';
      
    const prefix = level ? `${level}${subject}` : subject;
    
    // 根据当前tab和首页学段决定跳转目标
    const handleStartPractice = () => {
      // 获取首页当前学段
      const homePageGrade = localStorage.getItem('currentGrade') || '初中';
      
      // 根据当前tab和首页学段决定跳转目标
      let targetSubject: Subject = 'math'; // 默认为数学
      
      if (activeTab === 'math') {
        // 数学在所有学段都存在
        targetSubject = 'math';
      } else if (activeTab === 'physics') {
        // 物理在初中和高中存在
        if (homePageGrade !== '小学') {
          targetSubject = 'physics';
        }
        // 否则默认为数学
      } else if (activeTab === 'chemistry') {
        // 化学在初中和高中存在
        if (homePageGrade !== '小学') {
          targetSubject = 'chemistry';
        }
        // 否则默认为数学
      }
      // activeTab为'all'时默认为数学
      
      // 跳转到首页并传递目标tab信息
      navigate('/', { 
        state: { 
          activeTab: targetSubject,
          fromPage: 'record'
        } 
      });
    };
    
    return (
      <p className="message">
        还没有{prefix ? `${prefix}练习记录` : '练习记录'}
        <br />
        <span className="highlight" onClick={handleStartPractice}>
          快去练习吧，让知识成为你的力量！💪
        </span>
      </p>
    );
  };
  
  // 处理详情记录点击，跳转到练习报告页面
  const handleDetailClick = (id: string) => {
    navigate(`/practice-result/${id}`, {
      state: { 
        fromPage: 'record-modal',
        formulaId: selectedRecord?.formulaId,
        formulaTitle: selectedRecord?.formulaTitle
      }
    });
    // 不关闭弹窗，这样返回时可以恢复弹窗状态
    // setShowDetailModal(false);
  };
  
  return (
    <Container>
      <PageHeader>
        <BackButton onClick={handleBack}>
          <i className="fas fa-chevron-left"></i>
        </BackButton>
        <HeaderText>练习记录</HeaderText>
      </PageHeader>
      
      <Content>
        {/* 统计数据卡片 */}
        <StatsBar>
          <StatItem>
            <StatIconBox color="#4a89dc">
              <i className="fas fa-book"></i>
            </StatIconBox>
            <StatText>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#333' }}>{totalPractices}</div>
              <StatLabel>总练习次数</StatLabel>
            </StatText>
          </StatItem>
          
          <StatItem>
            <StatIconBox color="#52c41a">
              <i className="fas fa-calculator"></i>
            </StatIconBox>
            <StatText>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#333' }}>{totalFormulas}</div>
              <StatLabel>总公式数</StatLabel>
            </StatText>
          </StatItem>
          
          <StatItem>
            <StatIconBox color="#fa8c16">
              <i className="fas fa-chart-line"></i>
            </StatIconBox>
            <StatText>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#333' }}>{averageAccuracy}%</div>
              <StatLabel>平均正确率</StatLabel>
            </StatText>
          </StatItem>
        </StatsBar>
        
        {/* 分类标签栏和学段筛选 */}
        <TabContainer>
          {getAvailableSubjects(activeEducationLevel).map(subject => (
            <Tab 
              key={subject}
              active={activeTab === subject}
              onClick={() => setActiveTab(subject)}
            >
              <TabText>
                {getSubjectName(subject)}
                <TabCount active={activeTab === subject}>
                  ({getSubjectCount(subject)})
                </TabCount>
              </TabText>
            </Tab>
          ))}
          
          <FilterContainer>
            <FilterLabel>
              <i className="fas fa-graduation-cap"></i>
              学段
            </FilterLabel>
            <CustomSelect
              options={[
                { value: 'all', label: '全部学段' },
                { value: 'elementary', label: `小学 (${getEducationLevelCount('elementary')})` },
                { value: 'middle', label: `初中 (${getEducationLevelCount('middle')})` },
                { value: 'high', label: `高中 (${getEducationLevelCount('high')})` }
              ]}
              value={activeEducationLevel}
              onChange={(value) => setActiveEducationLevel(value as EducationLevel)}
            />
          </FilterContainer>
        </TabContainer>
        
        {/* 记录列表 */}
        {filteredRecords.length > 0 ? (
          <RecordGrid>
            {filteredRecords.map(record => {
              const subjectColor = getSubjectColor(record.subject);
              const educationLevelColor = getEducationLevelColor(record.educationLevel);
              return (
                <RecordCard 
                  key={record.formulaId}
                  subjectColor={subjectColor}
                  accuracy={record.lastAccuracy}
                >
                  <EducationLevelTag color={educationLevelColor}>
                    <i className={getEducationLevelIcon(record.educationLevel)}></i>
                    {getEducationLevelName(record.educationLevel)}
                  </EducationLevelTag>
                  
                  <DateLabel>
                    <i className="far fa-calendar"></i>
                    {formatDate(record.lastPracticeDate)}
                  </DateLabel>
                  
                  <CardContent>
                    <CardTitle>{record.formulaTitle}</CardTitle>
                    <FormulaContent>
                      <div>{FORMULA_CONTENTS[record.formulaId] || record.formulaTitle}</div>
                    </FormulaContent>
                  </CardContent>
                  
                  <CardFooter>
                    <CardMetrics>
                      <AccuracyLabel value={record.lastAccuracy}>
                        上次正确率：{record.lastAccuracy}%
                      </AccuracyLabel>
                    </CardMetrics>
                    
                    <ViewButton onClick={() => handleRecordClick(record)}>
                      查看详情（{record.totalPractices}） <i className="fas fa-arrow-right"></i>
                    </ViewButton>
                  </CardFooter>
                </RecordCard>
              );
            })}
          </RecordGrid>
        ) : (
          <EmptyState>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              <path d="M12 11v6"></path>
              <path d="M9 14h6"></path>
            </svg>
            {getEmptyStateMessage(activeTab, activeEducationLevel)}
          </EmptyState>
        )}
      </Content>
      
      {/* 详情模态框 */}
      {showDetailModal && selectedRecord && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(3px)'
        }} onClick={() => setShowDetailModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '0 0 24px 0',
            width: '60vw',
            maxWidth: '60vw',
            height: '60vh',
            maxHeight: '60vh',
            overflowY: 'auto',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.18)'
          }} onClick={e => e.stopPropagation()}>
            {/* 蓝色居中标题栏 */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: '#4a89dc',
              color: 'white',
              position: 'relative',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              marginBottom: '16px'
            }}>
              <h3 style={{
                fontSize: '16px',
                margin: 0,
                fontWeight: 500,
                textAlign: 'center'
              }}>
                {selectedRecord?.formulaTitle} - 练习记录
              </h3>
              <button style={{
                background: 'none',
                border: 'none',
                width: '32px',
                height: '32px',
                fontSize: '16px',
                cursor: 'pointer',
                color: 'white',
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }} onClick={() => setShowDetailModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {/* 数据统计卡片（一行显示） */}
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '0 16px',
              marginBottom: '16px'
            }}>
              {/* 最新正确率 */}
              <div style={{ 
                flex: '1',
                background: 'linear-gradient(135deg, rgba(230, 247, 255, 0.5), rgba(240, 245, 255, 0.5))',
                borderLeft: '3px solid #1890ff',
                padding: '8px 10px',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  <i className="fas fa-check-circle" style={{ fontSize: '18px', color: '#1890ff', marginRight: '6px' }}></i>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 700, 
                    color: Math.round(selectedRecord?.records[0].accuracy * 100) >= 80 
                      ? '#52c41a' 
                      : Math.round(selectedRecord?.records[0].accuracy * 100) >= 60 
                        ? '#faad14' 
                        : '#f5222d'
                  }}>
                    {Math.round(selectedRecord?.records[0].accuracy * 100)}%
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#666' }}>
                  最新正确率
                </div>
              </div>
              
              {/* 最高正确率 */}
              <div style={{ 
                flex: '1',
                background: 'linear-gradient(135deg, rgba(246, 255, 237, 0.5), rgba(252, 255, 230, 0.5))',
                borderLeft: '3px solid #52c41a',
                padding: '8px 10px',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  <i className="fas fa-trophy" style={{ fontSize: '18px', color: '#52c41a', marginRight: '6px' }}></i>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 700, 
                    color: Math.round(Math.max(...selectedRecord?.records.map(r => r.accuracy) || [0]) * 100) >= 80 
                      ? '#52c41a' 
                      : Math.round(Math.max(...selectedRecord?.records.map(r => r.accuracy) || [0]) * 100) >= 60 
                        ? '#faad14' 
                        : '#f5222d'
                  }}>
                    {Math.round(Math.max(...selectedRecord?.records.map(r => r.accuracy) || [0]) * 100)}%
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#666' }}>
                  最高正确率
                </div>
              </div>
              
              {/* 较上次趋势 */}
              <div style={{ 
                flex: '1',
                background: 'linear-gradient(135deg, rgba(255, 242, 232, 0.5), rgba(255, 247, 230, 0.5))',
                borderLeft: '3px solid #fa8c16',
                padding: '8px 10px',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  <i className="fas fa-chart-line" style={{ fontSize: '18px', color: '#fa8c16', marginRight: '6px' }}></i>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 700, 
                    color: selectedRecord?.records.length && selectedRecord.records.length > 1 
                      ? (selectedRecord.records[0].accuracy - selectedRecord.records[1].accuracy) > 0 
                        ? '#52c41a' 
                        : (selectedRecord.records[0].accuracy - selectedRecord.records[1].accuracy) < 0 
                          ? '#f5222d' 
                          : '#8c8c8c'  // 当趋势为0时显示灰色
                      : '#8c8c8c'  // 默认为灰色
                  }}>
                    {selectedRecord?.records.length && selectedRecord.records.length > 1 ? 
                      (selectedRecord.records[0].accuracy - selectedRecord.records[1].accuracy) > 0 
                      ? "+" + Math.round((selectedRecord.records[0].accuracy - selectedRecord.records[1].accuracy) * 100) + "%" 
                      : (selectedRecord.records[0].accuracy - selectedRecord.records[1].accuracy) < 0
                        ? Math.round((selectedRecord.records[0].accuracy - selectedRecord.records[1].accuracy) * 100) + "%"
                        : "0%"
                      : "0%"}
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#666' }}>
                  较上次趋势
                </div>
              </div>
              
              {/* 练习次数 */}
              <div style={{ 
                flex: '1',
                background: 'linear-gradient(135deg, rgba(249, 240, 255, 0.5), rgba(239, 219, 255, 0.5))',
                borderLeft: '3px solid #722ed1',
                padding: '8px 10px',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  <i className="fas fa-redo-alt" style={{ fontSize: '18px', color: '#722ed1', marginRight: '6px' }}></i>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#333' }}>
                    {selectedRecord?.records.length}
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#666' }}>
                  练习次数
                </div>
              </div>
            </div>
            
            <div style={{ 
              fontSize: '16px',
              fontWeight: 600,
              color: '#333',
              margin: '16px 0 12px',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '16px',
              gap: '8px'
            }}>
              <i className="fas fa-history" style={{ color: '#4a89dc', fontSize: '15px' }}></i>
              练习记录
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 16px' }}>
              {selectedRecord.records.map(record => (
                <div 
                  key={record.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: '1px solid transparent'
                  }}
                  onClick={() => handleDetailClick(record.id)}
                >
                  <div style={{ fontSize: '14px', color: '#666', fontWeight: 500, width: '90px' }}>
                    {formatDate(record.date)}
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingLeft: '10px',
                    paddingRight: '10px'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      width: '110px',
                      justifyContent: 'center'
                    }}>
                      <div style={{ color: '#999', fontSize: '13px' }}>正确率</div>
                      <div style={{ 
                        marginLeft: '5px',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: Math.round(record.accuracy * 100) >= 80 
                          ? '#52c41a' 
                          : Math.round(record.accuracy * 100) >= 60 
                            ? '#faad14' 
                            : '#f5222d'
                      }}>
                        {Math.round(record.accuracy * 100)}%
                      </div>
                    </div>
                    
                    <div style={{ 
                        width: '1px', 
                        height: '14px', 
                        backgroundColor: '#ddd'
                    }}></div>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      width: '110px',
                      justifyContent: 'center'
                    }}>
                      <div style={{ color: '#999', fontSize: '13px' }}>总题数</div>
                      <div style={{ 
                        marginLeft: '5px',
                        color: '#333', 
                        fontWeight: 600, 
                        fontSize: '14px'
                      }}>
                        {record.questionsCount}题
                      </div>
                    </div>
                    
                    <div style={{ 
                        width: '1px', 
                        height: '14px', 
                        backgroundColor: '#ddd'
                    }}></div>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      width: '95px',
                      justifyContent: 'center'
                    }}>
                      <div style={{ color: '#999', fontSize: '13px' }}>正确</div>
                      <div style={{ 
                        marginLeft: '5px',
                        color: '#52c41a', 
                        fontWeight: 600, 
                        fontSize: '14px'
                      }}>
                        {Math.round(record.accuracy * record.questionsCount)}题
                      </div>
                    </div>
                    
                    <div style={{ 
                        width: '1px', 
                        height: '14px', 
                        backgroundColor: '#ddd'
                    }}></div>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      width: '90px',
                      justifyContent: 'center'
                    }}>
                      <div style={{ color: '#999', fontSize: '13px' }}>用时</div>
                      <div style={{ 
                        marginLeft: '5px',
                        color: '#333', 
                        fontWeight: 600, 
                        fontSize: '14px'
                      }}>
                        {record.timeSpent}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4a89dc',
                    backgroundColor: '#ecf5ff',
                    borderRadius: '50%',
                    marginLeft: '8px'
                  }}>
                    <i className="fas fa-chevron-right" style={{ fontSize: '12px' }}></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default RecordPage; 
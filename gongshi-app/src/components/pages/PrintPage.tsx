import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';

// 接口定义
interface Formula {
  id: string;
  title: string;
  content: string;
  description?: string;
}

// 样式化组件
const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1280px;
  margin: 0 auto;
  padding: 15px;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.white};
`;

const PrintContainer = styled.div`
  margin-top: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PrintOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 10px;
  background-color: ${props => props.theme.colors.background};
`;

const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OptionLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const CheckboxInput = styled.input`
  cursor: pointer;
  width: 18px;
  height: 18px;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`;

const PrintPreview = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 20px;
  background-color: white;
  flex: 1;
`;

const PrintTitle = styled.h2`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.primary};
`;

const FormulaList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
`;

const FormulaCard = styled.div`
  padding: 15px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FormulaTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const FormulaContent = styled.div`
  font-family: 'Times New Roman', Times, serif;
  font-size: 18px;
  padding: 8px 0;
  text-align: center;
`;

const FormulaDescription = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  line-height: 1.4;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
`;

const PrimaryButton = styled(Button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  
  &:hover {
    background-color: ${props => `${props.theme.colors.primary}dd`};
  }
`;

const SecondaryButton = styled(Button)`
  background-color: white;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
`;

// 模拟数据 - 数学公式
const MATH_FORMULAS: Formula[] = [
  {
    id: 'math-1',
    title: '圆的周长',
    content: 'C = 2πr',
    description: '圆的周长等于2倍的圆周率乘以半径，其中C表示周长，r表示半径，π约等于3.14159'
  },
  {
    id: 'math-2',
    title: '圆的面积',
    content: 'S = πr²',
    description: '圆的面积等于圆周率乘以半径的平方，其中S表示面积，r表示半径'
  },
  {
    id: 'math-3',
    title: '勾股定理',
    content: 'a² + b² = c²',
    description: '直角三角形中，两直角边的平方和等于斜边的平方，其中a和b为直角边长度，c为斜边长度'
  },
  {
    id: 'math-4',
    title: '三角形面积',
    content: 'S = ½ah',
    description: '三角形的面积等于底边乘以高的一半，其中a为底边长度，h为高'
  },
  {
    id: 'math-5',
    title: '平行四边形面积',
    content: 'S = ah',
    description: '平行四边形的面积等于底边乘以高，其中a为底边长度，h为高'
  },
  {
    id: 'math-6',
    title: '梯形面积',
    content: 'S = ½(a + b)h',
    description: '梯形的面积等于上下底边和乘以高的一半，其中a和b为两条平行边的长度，h为高'
  }
];

// 物理公式
const PHYSICS_FORMULAS: Formula[] = [
  {
    id: 'physics-1',
    title: '牛顿第二定律',
    content: 'F = ma',
    description: '物体受到的合外力等于物体的质量乘以物体的加速度，其中F表示力，m表示质量，a表示加速度'
  },
  {
    id: 'physics-2',
    title: '重力',
    content: 'G = mg',
    description: '物体的重力等于物体的质量乘以重力加速度，其中G表示重力，m表示质量，g表示重力加速度'
  },
  {
    id: 'physics-3',
    title: '功',
    content: 'W = Fs',
    description: '功等于力乘以力的方向上的位移，其中W表示功，F表示力，s表示位移'
  },
  {
    id: 'physics-4',
    title: '动能',
    content: 'Ek = ½mv²',
    description: '物体的动能等于物体质量乘以速度平方的一半，其中Ek表示动能，m表示质量，v表示速度'
  }
];

// 化学公式
const CHEMISTRY_FORMULAS: Formula[] = [
  {
    id: 'chemistry-1',
    title: '水的电离',
    content: 'H₂O ⇌ H⁺ + OH⁻',
    description: '水分子电离产生氢离子和氢氧根离子'
  },
  {
    id: 'chemistry-2',
    title: '碳酸钠和盐酸反应',
    content: 'Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑',
    description: '碳酸钠和盐酸反应生成氯化钠、水和二氧化碳'
  },
  {
    id: 'chemistry-3',
    title: '光合作用',
    content: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂',
    description: '绿色植物在光的照射下，利用二氧化碳和水合成葡萄糖，同时释放氧气'
  }
];

/**
 * PrintPage组件 - 打印/导出公式页面
 * 
 * 功能：
 * - 选择要打印的公式类别（数学、物理、化学）
 * - 打印预览
 * - 导出PDF或者打印
 */
const PrintPage: React.FC = () => {
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  
  // 状态
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['math']);
  const [title, setTitle] = useState<string>('初中公式汇总');
  const [showDescription, setShowDescription] = useState<boolean>(true);
  
  // 计算要显示的公式
  const formulas = React.useMemo(() => {
    let result: Formula[] = [];
    
    if (selectedSubjects.includes('math')) {
      result = [...result, ...MATH_FORMULAS];
    }
    
    if (selectedSubjects.includes('physics')) {
      result = [...result, ...PHYSICS_FORMULAS];
    }
    
    if (selectedSubjects.includes('chemistry')) {
      result = [...result, ...CHEMISTRY_FORMULAS];
    }
    
    return result;
  }, [selectedSubjects]);
  
  // 处理学科选择
  const handleSubjectChange = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };
  
  // 处理返回
  const handleBack = () => {
    navigate(-1);
  };
  
  // 处理打印
  const handlePrint = () => {
    window.print();
  };
  
  // 添加打印样式
  useEffect(() => {
    // 创建打印样式表
    const style = document.createElement('style');
    style.id = 'print-style';
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #print-content, #print-content * {
          visibility: visible;
        }
        #print-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          padding: 20px;
        }
        @page {
          size: A4;
          margin: 15mm;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      const printStyle = document.getElementById('print-style');
      if (printStyle) {
        document.head.removeChild(printStyle);
      }
    };
  }, []);

  return (
    <Container>
      <Header 
        title="打印公式卡片" 
        showBackButton={true}
        onBack={handleBack}
      />
      
      <PrintContainer>
        <PrintOptions>
          <OptionGroup>
            <OptionLabel>选择学科</OptionLabel>
            <CheckboxGroup>
              <Checkbox>
                <CheckboxInput 
                  type="checkbox" 
                  id="math"
                  checked={selectedSubjects.includes('math')}
                  onChange={() => handleSubjectChange('math')}
                />
                <CheckboxLabel htmlFor="math">数学</CheckboxLabel>
              </Checkbox>
              
              <Checkbox>
                <CheckboxInput 
                  type="checkbox" 
                  id="physics"
                  checked={selectedSubjects.includes('physics')}
                  onChange={() => handleSubjectChange('physics')}
                />
                <CheckboxLabel htmlFor="physics">物理</CheckboxLabel>
              </Checkbox>
              
              <Checkbox>
                <CheckboxInput 
                  type="checkbox" 
                  id="chemistry"
                  checked={selectedSubjects.includes('chemistry')}
                  onChange={() => handleSubjectChange('chemistry')}
                />
                <CheckboxLabel htmlFor="chemistry">化学</CheckboxLabel>
              </Checkbox>
            </CheckboxGroup>
          </OptionGroup>
          
          <OptionGroup>
            <OptionLabel>标题</OptionLabel>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            />
          </OptionGroup>
          
          <OptionGroup>
            <Checkbox>
              <CheckboxInput 
                type="checkbox" 
                id="description"
                checked={showDescription}
                onChange={() => setShowDescription(!showDescription)}
              />
              <CheckboxLabel htmlFor="description">显示公式说明</CheckboxLabel>
            </Checkbox>
          </OptionGroup>
        </PrintOptions>
        
        <PrintPreview ref={printRef} id="print-content">
          <PrintTitle>{title}</PrintTitle>
          
          <FormulaList>
            {formulas.map(formula => (
              <FormulaCard key={formula.id}>
                <FormulaTitle>{formula.title}</FormulaTitle>
                <FormulaContent>{formula.content}</FormulaContent>
                {showDescription && formula.description && (
                  <FormulaDescription>{formula.description}</FormulaDescription>
                )}
              </FormulaCard>
            ))}
          </FormulaList>
        </PrintPreview>
        
        <ButtonGroup>
          <SecondaryButton onClick={handleBack}>
            <i className="fas fa-arrow-left"></i>
            返回
          </SecondaryButton>
          
          <PrimaryButton onClick={handlePrint}>
            <i className="fas fa-print"></i>
            打印
          </PrimaryButton>
        </ButtonGroup>
      </PrintContainer>
    </Container>
  );
};

export default PrintPage; 
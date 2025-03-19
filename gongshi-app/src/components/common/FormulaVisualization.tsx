import React from 'react';
import styled from 'styled-components';

interface FormulaVisualizationProps {
  formulaTitle: string;
  width?: string;
  height?: string;
  className?: string;
}

const VisualizationContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

// 获取公式背景图形的辅助函数
export const getFormulaVisualization = (formulaTitle: string) => {
  // 根据公式标题判断使用哪种图形
  if (formulaTitle.includes('平行四边形') || formulaTitle.includes('平行四')) {
    // 平行四边形面积公式 S = bh
    return `
      <svg width="100%" height="100%" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <polygon points="40,110 160,110 140,40 20,40" fill="rgba(74, 137, 220, 0.08)" stroke="#4a89dc" stroke-width="1.5"/>
        <line x1="40" y1="110" x2="160" y2="110" stroke="#e67e00" stroke-width="2"/>
        <text x="95" y="130" font-size="14" fill="#e67e00" text-anchor="middle">b</text>
        <line x1="40" y1="110" x2="40" y2="40" stroke="#5cb85c" stroke-width="2" stroke-dasharray="4"/>
        <text x="30" y="70" font-size="14" fill="#5cb85c" text-anchor="middle">h</text>
      </svg>
    `;
  } else if (formulaTitle.includes('梯形')) {
    // 梯形面积公式 S = ½h(a+b)
    return `
      <svg width="100%" height="100%" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <polygon points="40,110 160,110 140,40 60,40" fill="rgba(74, 137, 220, 0.08)" stroke="#4a89dc" stroke-width="1.5"/>
        <line x1="40" y1="110" x2="160" y2="110" stroke="#e67e00" stroke-width="2"/>
        <text x="100" y="130" font-size="14" fill="#e67e00" text-anchor="middle">a</text>
        <line x1="60" y1="40" x2="140" y2="40" stroke="#cc5245" stroke-width="2"/>
        <text x="100" y="30" font-size="14" fill="#cc5245" text-anchor="middle">b</text>
        <line x1="100" y1="110" x2="100" y2="40" stroke="#5cb85c" stroke-width="2" stroke-dasharray="4"/>
        <text x="90" y="70" font-size="14" fill="#5cb85c" text-anchor="middle">h</text>
      </svg>
    `;
  } else if (formulaTitle.includes('三角形')) {
    // 三角形面积公式 S = ½ah
    return `
      <svg width="100%" height="100%" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <polygon points="40,110 160,110 100,40" fill="rgba(74, 137, 220, 0.08)" stroke="#4a89dc" stroke-width="1.5"/>
        <line x1="40" y1="110" x2="160" y2="110" stroke="#e67e00" stroke-width="2"/>
        <text x="100" y="130" font-size="14" fill="#e67e00" text-anchor="middle">a</text>
        <line x1="100" y1="110" x2="100" y2="40" stroke="#5cb85c" stroke-width="2" stroke-dasharray="4"/>
        <text x="90" y="70" font-size="14" fill="#5cb85c" text-anchor="middle">h</text>
      </svg>
    `;
  } else if (formulaTitle.includes('圆')) {
    // 圆的面积公式 S = πr²
    return `
      <svg width="100%" height="100%" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="75" r="50" fill="rgba(74, 137, 220, 0.08)" stroke="#4a89dc" stroke-width="1.5"/>
        <line x1="100" y1="75" x2="150" y2="75" stroke="#e67e00" stroke-width="2"/>
        <text x="125" y="65" font-size="14" fill="#e67e00" text-anchor="middle">r</text>
      </svg>
    `;
  } else if (formulaTitle.includes('勾股定理') || formulaTitle.includes('勾股')) {
    // 勾股定理 a² + b² = c²
    return `
      <svg width="100%" height="100%" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <polygon points="40,110 160,110 40,40" fill="rgba(74, 137, 220, 0.08)" stroke="#4a89dc" stroke-width="1.5"/>
        <line x1="40" y1="110" x2="160" y2="110" stroke="#e67e00" stroke-width="2"/>
        <text x="100" y="130" font-size="14" fill="#e67e00" text-anchor="middle">a</text>
        <line x1="40" y1="110" x2="40" y2="40" stroke="#5cb85c" stroke-width="2"/>
        <text x="30" y="75" font-size="14" fill="#5cb85c" text-anchor="middle">b</text>
        <line x1="40" y1="40" x2="160" y2="110" stroke="#cc5245" stroke-width="2" stroke-dasharray="2"/>
        <text x="100" y="65" font-size="14" fill="#cc5245" text-anchor="middle">c</text>
      </svg>
    `;
  } 
  // 物理公式
  else if (formulaTitle.includes('牛顿第二定律') || formulaTitle.includes('F=ma')) {
    // 牛顿第二定律 F = ma
    return `
      <svg width="100%" height="100%" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <!-- 物体 -->
        <rect x="60" y="70" width="50" height="40" fill="rgba(74, 137, 220, 0.08)" stroke="#4a89dc" stroke-width="1.5"/>
        <text x="85" y="95" font-size="14" fill="#4a89dc" text-anchor="middle">m</text>
        
        <!-- 力和加速度箭头 -->
        <line x1="110" y1="90" x2="170" y2="90" stroke="#e67e00" stroke-width="2" marker-end="url(#arrowF)"/>
        <text x="145" y="85" font-size="14" fill="#e67e00" text-anchor="middle">F</text>
        
        <line x1="85" y1="120" x2="140" y2="120" stroke="#5cb85c" stroke-width="2" marker-end="url(#arrowA)"/>
        <text x="105" y="135" font-size="14" fill="#5cb85c" text-anchor="middle">a</text>
        
        <!-- 箭头标记定义 -->
        <defs>
          <marker id="arrowF" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#e67e00"/>
          </marker>
          <marker id="arrowA" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#5cb85c"/>
          </marker>
        </defs>
      </svg>
    `;
  }
  else if (formulaTitle.includes('动能') || formulaTitle.includes('Ek=')) {
    // 动能定理 Ek = 1/2mv²
    return `
      <svg width="100%" height="100%" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <!-- 运动物体 -->
        <circle cx="70" cy="75" r="25" fill="rgba(74, 137, 220, 0.08)" stroke="#4a89dc" stroke-width="1.5"/>
        <text x="70" y="80" font-size="14" fill="#4a89dc" text-anchor="middle">m</text>
        
        <!-- 速度箭头 -->
        <line x1="95" y1="75" x2="160" y2="75" stroke="#e67e00" stroke-width="2" marker-end="url(#arrowV)"/>
        <text x="125" y="65" font-size="14" fill="#e67e00" text-anchor="middle">v</text>
        
        <!-- 动能波浪线 -->
        <path d="M50,110 Q60,100 70,110 Q80,120 90,110 Q100,100 110,110 Q120,120 130,110 Q140,100 150,110" 
              fill="none" stroke="#5cb85c" stroke-width="2" stroke-dasharray="4"/>
        <text x="100" y="130" font-size="14" fill="#5cb85c" text-anchor="middle">Ek</text>
        
        <!-- 箭头标记定义 -->
        <defs>
          <marker id="arrowV" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#e67e00"/>
          </marker>
        </defs>
      </svg>
    `;
  }
  else if (formulaTitle.includes('重力势能') || formulaTitle.includes('Ep=')) {
    // 重力势能 Ep = mgh
    return `
      <svg width="100%" height="100%" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <!-- 参考面 -->
        <line x1="30" y1="120" x2="170" y2="120" stroke="#999" stroke-width="2"/>
        <text x="170" y="130" font-size="12" fill="#999" text-anchor="end">参考面</text>
        
        <!-- 高度箭头 -->
        <line x1="80" y1="120" x2="80" y2="50" stroke="#5cb85c" stroke-width="2" stroke-dasharray="4"/>
        <text x="70" y="85" font-size="14" fill="#5cb85c" text-anchor="middle">h</text>
        
        <!-- 物体 -->
        <circle cx="80" cy="50" r="20" fill="rgba(74, 137, 220, 0.08)" stroke="#4a89dc" stroke-width="1.5"/>
        <text x="80" y="55" font-size="14" fill="#4a89dc" text-anchor="middle">m</text>
        
        <!-- 重力箭头 -->
        <line x1="120" y1="50" x2="120" y2="100" stroke="#e67e00" stroke-width="2" marker-end="url(#arrowG)"/>
        <text x="135" y="75" font-size="14" fill="#e67e00" text-anchor="middle">mg</text>
        
        <!-- 箭头标记定义 -->
        <defs>
          <marker id="arrowG" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#e67e00"/>
          </marker>
        </defs>
      </svg>
    `;
  }
  else if (formulaTitle.includes('电阻') || formulaTitle.includes('欧姆定律') || formulaTitle.includes('U=IR')) {
    // 欧姆定律 U = IR
    return `
      <svg width="100%" height="100%" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <!-- 电源 -->
        <line x1="40" y1="60" x2="40" y2="100" stroke="#4a89dc" stroke-width="2"/>
        <line x1="50" y1="65" x2="50" y2="95" stroke="#4a89dc" stroke-width="3"/>
        <line x1="40" y1="80" x2="50" y2="80" stroke="#4a89dc" stroke-width="1"/>
        <text x="45" y="110" font-size="14" fill="#4a89dc" text-anchor="middle">U</text>
        
        <!-- 电路连接线 -->
        <line x1="50" y1="80" x2="75" y2="80" stroke="#4a89dc" stroke-width="2"/>
        <line x1="125" y1="80" x2="150" y2="80" stroke="#4a89dc" stroke-width="2"/>
        <line x1="150" y1="80" x2="150" y2="40" stroke="#4a89dc" stroke-width="2"/>
        <line x1="150" y1="40" x2="40" y2="40" stroke="#4a89dc" stroke-width="2"/>
        <line x1="40" y1="40" x2="40" y2="60" stroke="#4a89dc" stroke-width="2"/>
        
        <!-- 电阻 -->
        <rect x="75" y="70" width="50" height="20" fill="rgba(74, 137, 220, 0.08)" stroke="#e67e00" stroke-width="2"/>
        <text x="100" y="85" font-size="14" fill="#e67e00" text-anchor="middle">R</text>
        
        <!-- 电流指示箭头 -->
        <circle cx="110" cy="120" r="15" fill="none" stroke="#5cb85c" stroke-width="1.5"/>
        <text x="110" y="125" font-size="14" fill="#5cb85c" text-anchor="middle">I</text>
        <line x1="95" y1="120" x2="125" y2="120" stroke="#5cb85c" stroke-width="1.5" marker-end="url(#arrowI)"/>
        
        <!-- 箭头标记定义 -->
        <defs>
          <marker id="arrowI" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#5cb85c"/>
          </marker>
        </defs>
      </svg>
    `;
  }
  // 化学公式
  else if (formulaTitle.includes('质量守恒') || formulaTitle.includes('化学反应')) {
    // 质量守恒定律
    return `
      <svg width="100%" height="100%" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <!-- 天平 -->
        <line x1="70" y1="90" x2="130" y2="90" stroke="#4a89dc" stroke-width="3"/>
        <line x1="100" y1="90" x2="100" y2="110" stroke="#4a89dc" stroke-width="3"/>
        <path d="M80,110 L120,110 L110,130 L90,130 Z" fill="rgba(74, 137, 220, 0.08)" stroke="#4a89dc" stroke-width="1.5"/>
        
        <!-- 左侧试管/烧杯 -->
        <path d="M60,50 L65,85 L75,85 L80,50" fill="rgba(235, 131, 52, 0.1)" stroke="#e67e00" stroke-width="1.5"/>
        <ellipse cx="70" cy="50" rx="10" ry="5" fill="none" stroke="#e67e00" stroke-width="1.5"/>
        <text x="70" y="70" font-size="10" fill="#e67e00" text-anchor="middle">反应物</text>
        
        <!-- 右侧试管/烧杯 -->
        <path d="M120,50 L125,85 L135,85 L140,50" fill="rgba(92, 184, 92, 0.1)" stroke="#5cb85c" stroke-width="1.5"/>
        <ellipse cx="130" cy="50" rx="10" ry="5" fill="none" stroke="#5cb85c" stroke-width="1.5"/>
        <text x="130" y="70" font-size="10" fill="#5cb85c" text-anchor="middle">生成物</text>
        
        <!-- 反应箭头 -->
        <line x1="85" y1="65" x2="115" y2="65" stroke="#999" stroke-width="2" marker-end="url(#arrowR)"/>
        
        <!-- 箭头标记定义 -->
        <defs>
          <marker id="arrowR" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#999"/>
          </marker>
        </defs>
      </svg>
    `;
  }
  else if (formulaTitle.includes('气体状态方程') || formulaTitle.includes('PV=nRT')) {
    // 理想气体状态方程 PV = nRT
    return `
      <svg width="100%" height="100%" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <!-- 气缸 -->
        <rect x="50" y="50" width="100" height="70" fill="rgba(74, 137, 220, 0.05)" stroke="#4a89dc" stroke-width="1.5"/>
        
        <!-- 活塞 -->
        <rect x="50" y="50" width="100" height="10" fill="rgba(74, 137, 220, 0.2)" stroke="#4a89dc" stroke-width="1.5"/>
        
        <!-- 分子 -->
        <circle cx="70" cy="80" r="5" fill="#e67e00" stroke="none"/>
        <circle cx="90" cy="90" r="5" fill="#e67e00" stroke="none"/>
        <circle cx="110" cy="70" r="5" fill="#e67e00" stroke="none"/>
        <circle cx="130" cy="100" r="5" fill="#e67e00" stroke="none"/>
        <circle cx="80" cy="110" r="5" fill="#e67e00" stroke="none"/>
        <circle cx="120" cy="85" r="5" fill="#e67e00" stroke="none"/>
        
        <!-- 压力箭头 -->
        <line x1="100" y1="30" x2="100" y2="50" stroke="#5cb85c" stroke-width="2" marker-end="url(#arrowP)"/>
        <text x="100" y="25" font-size="14" fill="#5cb85c" text-anchor="middle">P</text>
        
        <!-- 体积标注 -->
        <text x="100" y="130" font-size="14" fill="#4a89dc" text-anchor="middle">V</text>
        
        <!-- 分子数标注 -->
        <text x="170" y="80" font-size="14" fill="#e67e00" text-anchor="middle">n</text>
        
        <!-- 温度标注 -->
        <text x="30" y="80" font-size="14" fill="#cc5245" text-anchor="middle">T</text>
        
        <!-- 箭头标记定义 -->
        <defs>
          <marker id="arrowP" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#5cb85c"/>
          </marker>
        </defs>
      </svg>
    `;
  }
  else if (formulaTitle.includes('化学平衡') || formulaTitle.includes('平衡常数')) {
    // 化学平衡常数
    return `
      <svg width="100%" height="100%" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <!-- 平衡轴 -->
        <line x1="40" y1="75" x2="160" y2="75" stroke="#4a89dc" stroke-width="2"/>
        
        <!-- 双向反应箭头 -->
        <line x1="80" y1="75" x2="120" y2="75" stroke="#999" stroke-width="2"/>
        <path d="M115,70 L125,75 L115,80" fill="none" stroke="#999" stroke-width="2"/>
        <path d="M85,70 L75,75 L85,80" fill="none" stroke="#999" stroke-width="2"/>
        
        <!-- 反应物和生成物容器 -->
        <rect x="40" y="50" width="40" height="50" rx="5" fill="rgba(235, 131, 52, 0.1)" stroke="#e67e00" stroke-width="1.5"/>
        <text x="60" y="85" font-size="12" fill="#e67e00" text-anchor="middle">反应物</text>
        
        <rect x="120" y="50" width="40" height="50" rx="5" fill="rgba(92, 184, 92, 0.1)" stroke="#5cb85c" stroke-width="1.5"/>
        <text x="140" y="85" font-size="12" fill="#5cb85c" text-anchor="middle">生成物</text>
        
        <!-- 平衡常数K标注 -->
        <text x="100" y="40" font-size="16" font-weight="bold" fill="#4a89dc" text-anchor="middle">K</text>
        <path d="M90,35 C95,25 105,25 110,35" fill="none" stroke="#4a89dc" stroke-width="1.5"/>
      </svg>
    `;
  }
  else if (formulaTitle.includes('酸碱') || formulaTitle.includes('pH') || formulaTitle.includes('电离') || formulaTitle.includes('中和')) {
    // 酸碱中和反应
    return `
      <svg width="100%" height="100%" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <!-- pH值刻度 -->
        <rect x="40" y="110" width="120" height="10" fill="rgba(74, 137, 220, 0.08)" stroke="#4a89dc" stroke-width="1"/>
        
        <!-- 刻度颜色渐变 -->
        <linearGradient id="pHGradient" x1="0%" y1="0%" x2="100%" y1="0%">
          <stop offset="0%" stop-color="#cc5245"/>
          <stop offset="50%" stop-color="#e67e00"/>
          <stop offset="100%" stop-color="#5cb85c"/>
        </linearGradient>
        <rect x="40" y="110" width="120" height="10" fill="url(#pHGradient)" fill-opacity="0.5"/>
        
        <!-- 刻度标记 -->
        <line x1="40" y1="120" x2="40" y2="125" stroke="#999" stroke-width="1"/>
        <text x="40" y="135" font-size="10" fill="#cc5245" text-anchor="middle">0</text>
        
        <line x1="100" y1="120" x2="100" y2="125" stroke="#999" stroke-width="1"/>
        <text x="100" y="135" font-size="10" fill="#e67e00" text-anchor="middle">7</text>
        
        <line x1="160" y1="120" x2="160" y2="125" stroke="#999" stroke-width="1"/>
        <text x="160" y="135" font-size="10" fill="#5cb85c" text-anchor="middle">14</text>
        
        <!-- 烧杯1：酸 -->
        <path d="M60,45 L70,90 L90,90 L100,45" fill="rgba(204, 82, 69, 0.1)" stroke="#cc5245" stroke-width="1.5"/>
        <ellipse cx="80" cy="45" rx="20" ry="5" fill="none" stroke="#cc5245" stroke-width="1.5"/>
        <text x="80" y="70" font-size="12" fill="#cc5245" text-anchor="middle">H+</text>
        
        <!-- 烧杯2：碱 -->
        <path d="M120,45 L110,90 L130,90 L140,45" fill="rgba(92, 184, 92, 0.1)" stroke="#5cb85c" stroke-width="1.5"/>
        <ellipse cx="130" cy="45" rx="20" ry="5" fill="none" stroke="#5cb85c" stroke-width="1.5"/>
        <text x="130" y="70" font-size="12" fill="#5cb85c" text-anchor="middle">OH-</text>
        
        <!-- 中和反应指示 -->
        <line x1="95" y1="67" x2="115" y2="67" stroke="#e67e00" stroke-width="1.5" marker-end="url(#arrowN)"/>
        <text x="100" y="40" font-size="12" fill="#e67e00" text-anchor="middle">H+ + OH- → H₂O</text>
        
        <!-- 箭头标记定义 -->
        <defs>
          <marker id="arrowN" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#e67e00"/>
          </marker>
        </defs>
      </svg>
    `;
  }
  
  // 默认返回空图形
  return '';
};

const FormulaVisualization: React.FC<FormulaVisualizationProps> = ({ 
  formulaTitle,
  width = '100%',
  height = '100%',
  className
}) => {
  const svgContent = getFormulaVisualization(formulaTitle);
  
  if (!svgContent) return null; // 如果没有匹配的图形，不渲染任何内容
  
  return (
    <VisualizationContainer 
      className={className}
      style={{ width, height }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default FormulaVisualization; 
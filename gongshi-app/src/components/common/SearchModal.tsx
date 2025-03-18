import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  onFormulaClick?: (formulaId: string) => void;
  relatedTerms?: string[];
  allFormulas: any[]; // 这里使用any是为了简化，实际应该使用Formula类型
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
`;

const SearchBar = styled.div`
  width: 100%;
  background-color: #4a89dc;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
`;

const SearchInput = styled.input`
  flex: 1;
  height: 40px;
  border-radius: 20px;
  border: none;
  padding: 0 15px;
  font-size: 16px;
  background-color: white;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
  }
`;

const SearchContent = styled.div`
  background-color: white;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const SearchHistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
`;

const HistoryText = styled.span`
  color: #333;
  font-size: 16px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #999;
  font-size: 16px;
  cursor: pointer;
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

const SearchHeader = styled.div`
  padding: 15px 20px;
  color: #999;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 1px solid #eee;
`;

const EmptyList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
  font-size: 14px;
  
  i {
    font-size: 48px;
    margin-bottom: 15px;
    color: #ccc;
  }
`;

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
  onFormulaClick,
  relatedTerms = [],
  allFormulas
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [filteredFormulas, setFilteredFormulas] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 在组件挂载和isOpen变化时，从localStorage加载搜索历史
  useEffect(() => {
    const savedHistory = localStorage.getItem('search_history');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
    
    // 当弹窗打开时，自动聚焦到搜索框
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  // 处理搜索提交
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (searchQuery.trim()) {
      // 更新搜索历史
      const newHistory = [searchQuery, ...searchHistory.filter(item => item !== searchQuery)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('search_history', JSON.stringify(newHistory));
      
      // 执行搜索
      onSearch(searchQuery);
    }
  };
  
  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    
    // 实时过滤公式
    if (e.target.value.trim()) {
      const query = e.target.value.toLowerCase();
      const filtered = allFormulas.filter(formula => 
        formula.title.toLowerCase().includes(query) || 
        formula.content.toLowerCase().includes(query)
      );
      setFilteredFormulas(filtered);
    } else {
      setFilteredFormulas([]);
    }
  };
  
  // 处理历史记录点击
  const handleHistoryClick = (term: string) => {
    setSearchQuery(term);
    handleSubmit();
  };
  
  // 删除历史记录项
  const handleDeleteHistory = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = searchHistory.filter(item => item !== term);
    setSearchHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
  };
  
  // 处理关联词点击
  const handleRelatedTermClick = (term: string) => {
    setSearchQuery(term);
    handleSubmit();
  };
  
  // 自动生成关联词
  const generateRelatedTerms = (): string[] => {
    if (!relatedTerms || relatedTerms.length === 0) {
      // 如果没有提供关联词，从所有公式中提取常见词汇
      const commonTerms = [
        "面积", "体积", "周长", "三角形", "圆", "球", "方程", "函数",
        "正弦", "余弦", "力", "压强", "电流", "反应", "质量", "速度"
      ];
      return commonTerms;
    }
    return relatedTerms;
  };
  
  // 处理点击搜索结果
  const handleFormulaClick = (formula: any) => {
    if (onFormulaClick) {
      onFormulaClick(formula.id);
      onClose(); // 关闭搜索弹窗
    }
  };
  
  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <SearchBar>
            <BackButton onClick={onClose}>
              <i className="fas fa-arrow-left"></i>
            </BackButton>
            <SearchInput
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="请输入公式或公式名称"
            />
          </SearchBar>
        </form>
        
        <SearchContent>
          {searchQuery.trim() === '' ? (
            // 显示历史搜索或关联词
            <>
              {searchHistory.length > 0 ? (
                <>
                  <SearchHeader>最近搜索</SearchHeader>
                  {searchHistory.map((term, index) => (
                    <SearchHistoryItem key={index} onClick={() => handleHistoryClick(term)}>
                      <HistoryText>{term}</HistoryText>
                      <DeleteButton onClick={(e) => handleDeleteHistory(term, e)}>
                        <i className="fas fa-times"></i>
                      </DeleteButton>
                    </SearchHistoryItem>
                  ))}
                </>
              ) : (
                <>
                  <SearchHeader>相关搜索</SearchHeader>
                  {generateRelatedTerms().map((term, index) => (
                    <RelatedTermItem key={index} onClick={() => handleRelatedTermClick(term)}>
                      {term}
                    </RelatedTermItem>
                  ))}
                </>
              )}
            </>
          ) : filteredFormulas.length > 0 ? (
            // 显示搜索结果
            <>
              <SearchHeader>搜索结果</SearchHeader>
              {filteredFormulas.map((formula, index) => (
                <RelatedTermItem key={index} onClick={() => handleFormulaClick(formula)}>
                  {formula.title} - {formula.content}
                </RelatedTermItem>
              ))}
            </>
          ) : (
            // 显示没有找到结果
            <EmptyList>
              <i className="fas fa-search"></i>
              <p>没有找到符合"{searchQuery}"的结果</p>
            </EmptyList>
          )}
        </SearchContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default SearchModal; 
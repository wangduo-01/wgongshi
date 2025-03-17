import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSearch, faTimes, faHistory } from '@fortawesome/free-solid-svg-icons';
import Header from '../common/Header';

// 样式化组件
const SearchContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.medium};
  padding: 15px;
  min-height: 800px;
  height: calc(100vh - 40px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const SearchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

const BackButton = styled.div`
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  cursor: pointer;
`;

const SearchInputContainer = styled.div`
  flex: 1;
  margin: 0 15px;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors.background};
  border-radius: 20px;
  padding: 5px 15px;
`;

const SearchIcon = styled.div`
  color: ${props => props.theme.colors.text.light};
  margin-right: 10px;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  flex: 1;
  outline: none;
  font-size: 14px;
  color: ${props => props.theme.colors.text.primary};
`;

const CancelButton = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 14px;
  cursor: pointer;
`;

const SearchContent = styled.div`
  padding: 15px;
  flex: 1;
  overflow-y: auto;
`;

const SectionTitle = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 15px;
`;

const PopularSearches = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const SearchTag = styled.div`
  background-color: ${props => props.theme.colors.background};
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 14px;
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const SearchHistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HistoryContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${props => props.theme.colors.text.primary};
  font-size: 14px;
  cursor: pointer;
`;

const HistoryIcon = styled.div`
  color: ${props => props.theme.colors.text.light};
`;

const DeleteButton = styled.div`
  color: ${props => props.theme.colors.text.light};
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

const ClearHistory = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: 14px;
  cursor: pointer;
  margin-top: 20px;
  padding: 5px 10px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ClearHistoryContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

// 模拟数据
const POPULAR_SEARCHES = [
  '勾股定理',
  '圆的面积',
  '体积公式',
  '一元二次方程'
];

const SEARCH_HISTORY = [
  '三角形面积',
  '圆柱体积',
  '勾股定理'
];

/**
 * SearchPage组件 - 搜索页面
 * 
 * 功能：
 * - 提供搜索输入框
 * - 显示热门搜索标签
 * - 显示搜索历史
 * - 支持删除搜索历史
 */
const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState(SEARCH_HISTORY);
  
  // 处理返回
  const handleBack = () => {
    navigate(-1);
  };
  
  // 处理搜索
  const handleSearch = (query: string) => {
    if (query.trim()) {
      // 这里应该执行实际的搜索逻辑
      console.log('搜索:', query);
      
      // 添加到搜索历史
      if (!history.includes(query)) {
        setHistory([query, ...history]);
      }
    }
  };
  
  // 处理搜索框变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // 处理搜索框提交
  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };
  
  // 处理搜索标签点击
  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    handleSearch(tag);
  };
  
  // 处理历史项点击
  const handleHistoryClick = (item: string) => {
    setSearchQuery(item);
    handleSearch(item);
  };
  
  // 删除单个历史项
  const handleDeleteHistoryItem = (item: string) => {
    setHistory(history.filter(h => h !== item));
  };
  
  // 清空所有历史
  const handleClearHistory = () => {
    setHistory([]);
  };
  
  return (
    <SearchContainer>
      <SearchHeader>
        <BackButton onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </BackButton>
        
        <SearchInputContainer>
          <form onSubmit={handleInputSubmit}>
            <SearchInputWrapper>
              <SearchIcon>
                <FontAwesomeIcon icon={faSearch} />
              </SearchIcon>
              <SearchInput 
                type="text" 
                placeholder="搜索公式" 
                value={searchQuery}
                onChange={handleInputChange}
                autoFocus
              />
            </SearchInputWrapper>
          </form>
        </SearchInputContainer>
        
        <CancelButton onClick={handleBack}>取消</CancelButton>
      </SearchHeader>
      
      <SearchContent>
        <SectionTitle>热门搜索</SectionTitle>
        
        <PopularSearches>
          {POPULAR_SEARCHES.map((term, index) => (
            <SearchTag key={index} onClick={() => handleTagClick(term)}>
              {term}
            </SearchTag>
          ))}
        </PopularSearches>
        
        {history.length > 0 && (
          <>
            <SectionTitle>搜索历史</SectionTitle>
            
            <SearchHistoryList>
              {history.map((item, index) => (
                <HistoryItem key={index}>
                  <HistoryContent onClick={() => handleHistoryClick(item)}>
                    <HistoryIcon>
                      <FontAwesomeIcon icon={faHistory} />
                    </HistoryIcon>
                    <span>{item}</span>
                  </HistoryContent>
                  <DeleteButton onClick={() => handleDeleteHistoryItem(item)}>
                    <FontAwesomeIcon icon={faTimes} />
                  </DeleteButton>
                </HistoryItem>
              ))}
            </SearchHistoryList>
            
            <ClearHistoryContainer>
              <ClearHistory onClick={handleClearHistory}>
                清空搜索历史
              </ClearHistory>
            </ClearHistoryContainer>
          </>
        )}
      </SearchContent>
    </SearchContainer>
  );
};

export default SearchPage; 
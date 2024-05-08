import React, { useState } from 'react'
import styles from './article-menu.module.scss'
import Search from '@/component/article/search'
import Sort from '@/component/article/sort'

export default function Menu({
  onSelect,
  onSearch,
  fetchArticles,
  resetPagination,
  handleSortChange,
  showSort,
  showSearch,
}) {
  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)

  const handleSelectCategory = (category) => {
    onSelect(category) // 更新類別
    resetPagination() // 重置頁碼到第一頁
  }

  const handleSearchChange = async (searchQuery) => {
    if (!searchQuery.trim()) {
      // onSearch([])
      fetchArticles() // 呼叫 fetchArticles 載入所有文章
      return
    }
    // console.log('搜索内容:', searchQuery)
    try {
      const response = await fetch(
        `http://localhost:3005/api/articles/search?keyword=${encodeURIComponent(searchQuery)}`,
      )
      const data = await response.json()
      if (data.status === 'success') {
        onSearch(data.data.articles)
      } else {
        onSearch([]) // 當沒有找到文章或發生錯誤時，清空當前文章列表
      }
    } catch (error) {
      console.error('搜索文章失敗:', error)
    }
  }

  return (
    <>
      {/* 選單 */}
      <div>
        <ul className={styles['menu-articles']}>
          <li className={styles['menu-article']}>
            <button onClick={() => handleSelectCategory(0)}>全部文章</button>
          </li>
          <li
            className={`${styles['menu-article']} ${styles['menu-article-active']}`}
          >
            <button onClick={() => handleSelectCategory(1)}>選購指南</button>
          </li>
          <li className={styles['menu-article']}>
            <button onClick={() => handleSelectCategory(2)}>特殊課程</button>
          </li>
          <li className={styles['menu-article']}>
            <button onClick={() => handleSelectCategory(3)}>最新商品</button>
          </li>
          <li className={styles['menu-article']}>
            <button onClick={() => handleSelectCategory(4)}>最新展演</button>
          </li>
          {/* 搜索功能 */}
          {showSearch && (
            <Search
              isVisible={isVisible}
              onToggleVisibility={toggleVisibility}
              onSearchChange={handleSearchChange}
            />
          )}
          {/* 排序 */}
          {showSort && <Sort handleSortChange={handleSortChange} />}
        </ul>
        <hr />
      </div>
    </>
  )
}

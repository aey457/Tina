import { useRouter } from 'next/router'
import Breadcrumb from '@/component/article/breadcrumb'
import Menu from '@/component/article/menu'
import styles from './detail.module.scss'
import SideContent from '@/component/article/sidecontent'
import CommentsPage from '@/component/article/comment'
// import articlesData from '@/data/articles.json' // 導入資料

// 用於查找特定文章
export async function getServerSideProps(context) {
  //與伺服器要求獲取資料的async函式
  const { id } = context.params

  //api 與伺服器要求獲取資料的async函式
  //
  try {
    const articleRes = await fetch(`http://localhost:3005/api/articles/${id}`)
    const articleData = await articleRes.json()

    if (!articleData || !articleData.data || !articleData.data.article) {
      console.error('未找到具體文章數據')
      return { props: { article: null, randomArticles: [] } }
    }
    const article = articleData.data.article

    const allArticlesRes = await fetch('http://localhost:3005/api/articles')
    const allArticlesData = await allArticlesRes.json()
    const articles = allArticlesData.data.articles

    const randomArticles = articles.sort(() => 0.5 - Math.random()).slice(0, 4)
    return {
      props: {
        article, // 將文章作為 prop 傳遞
        randomArticles, // 傳遞隨機選取的 4 個文章作為 prop
      },
    }
  } catch (error) {
    console.error('取得數據時出錯:', error)
    return { props: { article: null, randomArticles: [] } }
  }
}

export default function ArticleDetailPage({ article, randomArticles }) {
  const router = useRouter()

  const setCurrentPage = () => {} // 假設的設定頁碼函數
  const resetPagination = () => setCurrentPage(1)

  if (!article) {
    return <p>文章未找到</p>
  }

  return (
    <>
      <Breadcrumb />
      <Menu
        onSelect={(category) => router.push(`/article?category=${category}`)}
        resetPagination={resetPagination} // 傳遞 resetPagination 函數
        showSort={false}
        showSearch={false} // 將 showSearch 設置為 false
      />
      {/* 返回按鈕 */}
      <button
        className={styles['back-button']}
        onClick={() => router.push('/article')}
      >
        <img src="/icons/icon-chevron-left.svg" alt="返回" />
        返回
      </button>
      {/* 文章內容 */}
      <div className={styles['article-content']}>
        <div className={styles['main-content']}>
          <img
            className={styles['article-image']}
            src={`/images/article/${article.article_img}`}
            alt={article.article_title}
          />
          <div className={styles['article-text']}>
            <h1>{article.article_title}</h1>
            <time>{article.article_date}</time>
            <p>{article.article_content}</p>
          </div>
        </div>

        {/* 區塊文章 */}
        <div className={styles['side-content']}>
          {randomArticles.map((randomArticle) => (
            <SideContent
              key={randomArticle.article_id}
              id={randomArticle.article_id}
              imageUrl={`/images/article/${randomArticle.article_img}`}
              date={randomArticle.article_date}
              title={randomArticle.article_title}
            />
          ))}
        </div>
        <div className={styles['article-comment']}>
          <CommentsPage />
        </div>
      </div>
    </>
  )
}
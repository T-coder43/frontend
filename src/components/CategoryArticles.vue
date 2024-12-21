<template>
  <div class="articles-container">
    <div class="header">
      <h2 class="header-title">{{ categoryTitle }}</h2>
      <router-link to="/" class="back-home-link">返回主页</router-link>
    </div>
    <div v-if="articles.length > 0" class="articles-column">
      <div v-for="article in articles" :key="article.url" class="article-card">
        <router-link
          :to="{
            name: 'ArticleDetail',
            params: { id: getArticleId(article.url) },
          }"
          class="article-title"
        >
          <h3>{{ article.title }}</h3>
        </router-link>
        <div class="article-meta">
          <span class="created">
            created: {{ formatted_time(article.created) }}
          </span>
        </div>
      </div>
    </div>
    <div v-else class="no-articles">
      <p>该分类下暂无文章。</p>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "CategoryArticles",
  data() {
    return {
      articles: [], // 分类下的文章数据
      categoryTitle: "", // 分类标题
    };
  },
  mounted() {
    this.fetchCategoryData();
  },
  methods: {
    // 获取文章详情
    getArticleDetail(articleUrl) {
      const articleId = this.getArticleId(articleUrl); // 获取文章 ID
      return axios
        .get(`/api/article/${articleId}/`) // 请求文章详情
        .then((response) => {
          const articleData = response.data;
          return articleData.created; // 返回创建时间字段
        })
        .catch((error) => {
          console.error("获取文章详情失败:", error);
          return null; // 请求失败时返回 null
        });
    },
    fetchCategoryData() {
      const categoryId = this.$route.params.categoryId;
      axios
        .get(`/api/category/${categoryId}/`)
        .then((response) => {
          console.log("获取的文章数据:", response.data.articles); // 打印数据查看
          this.articles = response.data.articles || []; // 从返回中获取文章数据
          this.categoryTitle = response.data.title || "未知分类"; // 获取分类标题
          // 为每篇文章请求详情并获取创建时间
          this.articles.forEach((article) => {
            this.getArticleDetail(article.url).then((createdTime) => {
              article.created = createdTime; // 将创建时间添加到文章对象中
            });
          });
        })
        .catch((error) => {
          console.error("获取分类文章数据失败:", error);
        });
    },
    getArticleId(articleUrl) {
      // 解析文章 URL 获取文章 ID
      const match = articleUrl.match(/\/article\/(\d+)\//);
      return match ? match[1] : null;
    },
    formatted_time(iso_date_string) {
      const date = new Date(iso_date_string);
      return date.toLocaleDateString();
    },
  },
};
</script>

<style scoped>
.articles-container {
  padding: 20px;
  background-color: #f9f9f9;
  position: relative;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* 标题和返回按钮容器 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-title {
  font-size: 2rem;
  color: #333;
  margin: 0;
}

/* 返回主页按钮 */
.back-home-link {
  padding: 10px 20px;
  background-color: mediumslateblue;
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.back-home-link:hover {
  background-color: darkslateblue;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

/* 文章列表容器 */
.articles-column {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 文章卡片样式 */
.article-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.article-card:hover {
  background-color: #f0f8ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

/* 文章标题 */
.article-title h3 {
  font-size: 1.6rem;
  color: #007bff;
  margin: 0;
  text-decoration: none;
  transition: color 0.3s ease;
}

.article-title h3:hover {
  color: #0056b3;
}

/* 文章元数据 */
.article-meta {
  font-size: 1rem;
  color: #666;
  margin-top: 10px;
}

/* 没有文章时的提示 */
.no-articles {
  text-align: center;
  color: #777;
  margin-top: 20px;
  font-size: 1rem;
}
</style>

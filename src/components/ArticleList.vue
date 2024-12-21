<template>
  <div class="articles-container">
    <!-- 新增更美观的文章卡片 -->
    <div class="article-card-container">
      <div
        v-for="article in info.results"
        :key="article.url"
        class="article-card"
      >
        <div class="image-container">
          <img
            :src="imageIfExists(article)"
            alt="Article Image"
            class="article-image"
          />
        </div>
        <div class="article-content">
          <div class="article-meta">
            <span v-if="article.category" class="category">
              {{ article.category.title }}
            </span>
            <div class="tag-container">
              <span v-for="tag in article.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
          <router-link
            :to="{ name: 'ArticleDetail', params: { id: article.id } }"
            class="article-title"
          >
            {{ article.title }}
          </router-link>
          <div class="article-date">{{ formatted_time(article.created) }}</div>
        </div>
      </div>
    </div>

    <!-- 分页器 -->
    <div class="paginator">
      <router-link
        v-if="info.previous"
        :to="get_path('previous')"
        class="page-link"
      >
        Prev
      </router-link>
      <span class="current-page">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <router-link v-if="info.next" :to="get_path('next')" class="page-link">
        Next
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ArticleList",
  data() {
    return {
      info: "", // API 响应数据
      currentPage: 1, // 当前页
      totalPages: 1, // 总页数
    };
  },
  mounted() {
    this.get_article_data();
  },
  methods: {
    imageIfExists(article) {
      return article.avatar ? article.avatar.content : "default-image.jpg";
    },
    formatted_time(iso_date_string) {
      const date = new Date(iso_date_string);
      return date.toLocaleDateString();
    },
    get_path(direction) {
      const url = direction === "next" ? this.info.next : this.info.previous;
      return url ? new URL(url).search : "/";
    },
    get_article_data() {
      const params = new URLSearchParams(this.$route.query);
      const queryString = params.toString();
      const url = queryString ? `/api/article/?${queryString}` : "/api/article";
      axios.get(url).then((response) => {
        this.info = response.data;

        // 动态更新当前页和总页数
        const pageParam = this.$route.query.page || 1;
        this.currentPage = parseInt(pageParam, 10);
        this.totalPages = Math.ceil(response.data.count / 4);
      });
    },
  },
  watch: {
    $route() {
      this.get_article_data();
    },
  },
};
</script>

<style scoped>
.articles-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  min-height: calc(100vh - 200px); /* 保证分页器位于底部 */
}

.article-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  flex: 1; /* 占据剩余空间 */
}

.article-card {
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.image-container {
  width: 100%;
  height: 250px; /* 增加图片容器高度 */
  overflow: hidden;
  border-bottom: 2px solid #eee; /* 增加分隔线让布局更协调 */
}

.article-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保图片填满容器并保持比例 */
  transition: transform 0.3s;
}

.article-image:hover {
  transform: scale(1.1); /* 鼠标悬停时的放大效果 */
}

.article-content {
  padding: 15px;
  min-height: 150px; /* 调整内容部分高度，保持卡片比例 */
}

.article-meta {
  display: flex;
  flex-direction: column; /* 将分类和标签分两行显示 */
  gap: 10px;
  margin-bottom: 10px;
}

.category {
  align-self: flex-start;
  background-color: #ff6347;
  color: white;
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.category:hover {
  background-color: #e55342;
}

.tag-container {
  display: flex;
  flex-wrap: wrap; /* 确保多标签换行 */
  gap: 8px; /* 标签之间的间距 */
}

.tag {
  display: inline-block;
  background-color: #4caf50;
  color: white;
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  margin: 2px 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  white-space: nowrap; /* 防止标签文字换行 */
}

.tag:hover {
  background-color: #45a049;
}

.article-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  display: block;
  margin-bottom: 10px;
}

.article-title:hover {
  color: #ff6347;
}

.article-date {
  font-size: 14px;
  color: #666;
}

.paginator {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
}

.page-link {
  font-size: 16px;
  color: #ff6347;
  text-decoration: none;
}

.page-link:hover {
  color: #ff4500;
}

.current-page {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
</style>

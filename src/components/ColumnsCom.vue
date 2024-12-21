<template>
  <div class="columns-container">
    <h2>专栏</h2>
    <!-- 返回首页按钮 -->
    <router-link class="back-home" to="/">返回首页</router-link>

    <div v-if="categories.length > 0">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-card"
      >
        <!-- 显示分类标题并添加跳转 -->
        <router-link
          :to="{
            name: 'CategoryArticles',
            params: { categoryId: category.id },
          }"
          class="category-title"
        >
          <h3>{{ category.title }}</h3>
        </router-link>
        <p>创建时间: {{ formatDate(category.created) }}</p>
      </div>
    </div>
    <div v-else>
      <p>暂无专栏数据。</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ColumnsCom",
  data() {
    return {
      categories: [], // 分类数据
    };
  },
  mounted() {
    // 从 API 获取分类数据
    axios
      .get("/api/category/")
      .then((response) => {
        this.categories = response.data; // 解析返回数据
      })
      .catch((error) => {
        console.error("获取分类数据失败:", error);
      });
  },
  methods: {
    // 格式化日期
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleString(); // 使用本地时间格式化
    },
  },
};
</script>

<style scoped>
/* 容器样式 */
.columns-container {
  padding: 20px;
  background-color: #f9f9f9;
  position: relative;
}

/* 标题样式 */
h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

/* 分类卡片样式 */
.category-card {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

/* 分类卡片悬浮效果 */
.category-card:hover {
  background-color: #f0f8ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px); /* 悬浮时轻微上移 */
}

/* 分类标题样式 */
.category-title h3 {
  font-size: 1.6rem;
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.category-title h3:hover {
  color: #0056b3;
}

/* 分类创建时间 */
.category-card p {
  font-size: 1rem;
  color: #666;
  margin-top: 10px;
}

/* 返回首页按钮 */
.back-home {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: mediumslateblue;
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease; /* 添加过渡效果 */
}

/* 返回首页按钮悬浮效果 */
.back-home:hover {
  background-color: darkslateblue;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px); /* 悬浮时轻微上移 */
}
</style>

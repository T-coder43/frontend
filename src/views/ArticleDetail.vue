<template>
  <BlogHeader />

  <div v-if="article !== null" class="grid-container">
    <!-- 主内容区域 -->
    <div class="main-content">
      <h1 id="title">{{ article.title }}</h1>
      <p id="subtitle">
        本文由 <strong>{{ article.author.username }}</strong> 发布于
        {{ formatted_time(article.created) }}
        <span v-if="isSuperuser">
          <router-link
            :to="{ name: 'ArticleEdit', params: { id: article.id } }"
          >
            更新与删除
          </router-link>
        </span>
      </p>
      <div v-html="article.body_html" class="article-body"></div>
    </div>

    <!-- 侧边目录 -->
    <div class="sidebar">
      <h3>目录</h3>
      <div v-html="article.toc_html" class="toc"></div>
    </div>
  </div>

  <CommentsCom :article="article" />
  <BlogFooter />
</template>

<script>
import BlogHeader from "@/components/BlogHeader.vue";
import BlogFooter from "@/components/BlogFooter.vue";
import CommentsCom from "@/components/Comments.vue";
import axios from "axios";

export default {
  name: "ArticleDetail",
  components: { BlogHeader, BlogFooter, CommentsCom },
  data: function () {
    return {
      article: null,
    };
  },
  mounted() {
    axios
      .get("/api/article/" + this.$route.params.id)
      .then((response) => (this.article = response.data));
  },
  methods: {
    formatted_time: function (iso_date_string) {
      const date = new Date(iso_date_string);
      return date.toLocaleDateString();
    },
  },
  computed: {
    isSuperuser() {
      return localStorage.getItem("isSuperuser.myblog") === "true";
    },
  },
};
</script>

<style scoped>
/* 布局样式 */
.grid-container {
  display: grid;
  grid-template-columns: 4fr 1.5fr;
  gap: 20px;
  padding: 20px;
}

/* 主内容样式 */
.main-content {
  background: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

#title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 10px;
}

#subtitle {
  text-align: center;
  color: gray;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

/* 文章内容样式 */
.article-body {
  line-height: 1.8;
  font-size: 1rem;
  color: #333;
}

/* 侧边栏样式 */
.sidebar {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.sidebar h3 {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #333;
}

.toc ul {
  list-style-type: none;
  padding-left: 0;
}

.toc li {
  margin-bottom: 10px;
}

.toc a {
  color: #007bff;
  text-decoration: none;
}

.toc a:hover {
  text-decoration: underline;
}

/* 图片样式 */
.article-body p img {
  max-width: 100%;
  border-radius: 10px;
  margin: 20px 0;
  box-shadow: gray 0 0 20px;
}
</style>

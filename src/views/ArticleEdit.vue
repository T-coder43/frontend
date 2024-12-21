<template>
  <BlogHeader />
  <div id="article-create">
    <h3>更新文章</h3>
    <form @submit.prevent="submit">
      <!-- 图片上传 -->
      <div class="form-elem">
        <span>图片：</span>
        <input
          v-on:change="onFileChange"
          type="file"
          id="file"
          accept="image/gif, image/jpeg, image/png"
        />
      </div>

      <!-- 标题 -->
      <div class="form-elem">
        <span>标题：</span>
        <input v-model="title" type="text" placeholder="输入标题" />
      </div>

      <!-- 分类 -->
      <div class="form-elem">
        <span>分类：</span>
        <select v-model="selectedCategory" @change="onCategoryChange">
          <option disabled value="">请选择分类</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category"
          >
            {{ category.title }}
          </option>
        </select>
      </div>

      <!-- 标签 -->
      <div class="form-elem">
        <span>标签：</span>
        <input v-model="tags" type="text" placeholder="输入标签，用逗号分隔" />
      </div>

      <!-- 正文 -->
      <div class="form-elem">
        <span>正文：</span>
        <textarea
          v-model="body"
          placeholder="输入正文"
          rows="10"
          cols="80"
        ></textarea>
      </div>

      <!-- 提交和删除按钮 -->
      <div class="form-elem">
        <button v-on:click.prevent="submit" class="submit-btn">提交</button>
      </div>
      <div class="form-elem">
        <button v-on:click.prevent="deleteArticle" class="delete-btn">
          删除
        </button>
      </div>
    </form>
  </div>
  <BlogFooter />
</template>

<script>
import BlogHeader from "@/components/BlogHeader.vue";
import BlogFooter from "@/components/BlogFooter.vue";
import axios from "axios";
import authorization from "@/utils/authorization";

export default {
  name: "ArticleEdit",
  components: { BlogHeader, BlogFooter },
  data: function () {
    return {
      title: "",
      body: "",
      categories: [],
      selectedCategory: null,
      tags: "",
      avatarID: null, // 保存图片 ID
      articleID: null, // 更新文章时需要的文章 ID
    };
  },
  mounted() {
    // 获取分类
    axios
      .get("/api/category/")
      .then((response) => (this.categories = response.data));

    // 获取要更新的文章内容
    const that = this;
    axios
      .get("/api/article/" + that.$route.params.id + "/")
      .then(function (response) {
        const data = response.data;
        that.title = data.title;
        that.body = data.body;
        that.selectedCategory = data.category;
        that.tags = data.tags.join(",");
        that.articleID = data.id;
        that.avatarID = data.avatar_id; // 获取文章的图片
      });
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      let formData = new FormData();
      formData.append("content", file);

      axios
        .post("/api/avatar/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("access.myblog"),
          },
        })
        .then((response) => (this.avatarID = response.data.id));
    },
    submit() {
      const that = this;
      authorization().then(function (response) {
        if (response[0]) {
          let data = {
            title: that.title,
            body: that.body,
            avatar_id: that.avatarID,
            category_id: that.selectedCategory
              ? that.selectedCategory.id
              : null,
            tags: that.tags
              .split(",")
              .map((x) => x.trim())
              .filter((x) => x !== ""),
          };

          const token = localStorage.getItem("access.myblog");
          axios
            .put("/api/article/" + that.articleID + "/", data, {
              headers: { Authorization: "Bearer " + token },
            })
            .then(function (response) {
              that.$router.push({
                name: "ArticleDetail",
                params: { id: response.data.id },
              });
            });
        } else {
          alert("令牌过期，请重新登录。");
        }
      });
    },
    deleteArticle() {
      const that = this;
      const token = localStorage.getItem("access.myblog");
      authorization().then(function (response) {
        if (response[0]) {
          axios
            .delete("/api/article/" + that.articleID + "/", {
              headers: { Authorization: "Bearer " + token },
            })
            .then(() => that.$router.push({ name: "Home" }));
        } else {
          alert("令牌过期，请重新登录。");
        }
      });
    },
  },
};
</script>

<style scoped>
#article-create {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9f9f9;
  background-image: url("../static/backend2.png");
  background-size: cover;
  background-position: center;
  font-family: Arial, sans-serif;
  padding: 20px;
}

form {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  text-align: left;
}

h3 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.form-elem {
  margin-bottom: 20px;
}

.form-elem span {
  display: block;
  font-size: 16px;
  color: #555;
  margin-bottom: 10px;
}

input,
textarea,
select {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
}

textarea {
  resize: none;
}

button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: steelblue;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #4682b4;
}

button.delete-btn {
  background-color: darkred;
}

button.delete-btn:hover {
  background-color: crimson;
}

input[type="file"] {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: auto;
}

.submit-btn {
  background-color: #4caf50;
}

.submit-btn:hover {
  background-color: #45a049;
}
</style>

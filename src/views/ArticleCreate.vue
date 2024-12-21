<template>
  <BlogHeader />
  <div id="article-create">
    <h3>发表文章</h3>
    <form id="image_form">
      <div class="form-elem">
        <span>图片：</span>
        <input
          v-on:change="onFileChange"
          type="file"
          id="file"
          accept="image/gif, image/jpeg, image/png"
        />
      </div>
    </form>
    <form @submit.prevent="submit">
      <div class="form-elem">
        <span>标题：</span>
        <input v-model="title" type="text" placeholder="输入标题" />
      </div>

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

      <div class="form-elem">
        <span>标签：</span>
        <input v-model="tags" type="text" placeholder="输入标签，用逗号分隔" />
      </div>

      <div class="form-elem">
        <span>正文：</span>
        <textarea
          v-model="body"
          placeholder="输入正文"
          rows="10"
          cols="80"
        ></textarea>
      </div>

      <div class="form-elem">
        <button v-on:click.prevent="submit" class="submit-btn">提交</button>
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
  name: "ArticleCreate",
  components: { BlogHeader, BlogFooter },
  data: function () {
    return {
      title: "",
      body: "",
      categories: [],
      selectedCategory: null,
      tags: "",
      avatarID: null,
    };
  },
  mounted() {
    axios
      .get("/api/category/")
      .then((response) => (this.categories = response.data));
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
    categoryStyle(category) {
      if (
        this.selectedCategory !== null &&
        category.id === this.selectedCategory.id
      ) {
        return { backgroundColor: "#4caf50", color: "#fff" };
      }
      return { backgroundColor: "#f1f1f1", color: "#333" };
    },
    chooseCategory(category) {
      if (this.selectedCategory && this.selectedCategory.id === category.id) {
        this.selectedCategory = null;
      } else {
        this.selectedCategory = category;
      }
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
            .post("/api/article/", data, {
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
  background-image: url("../static/1.png");
  background-size: cover;
  background-position: center;
  position: relative;
  padding: 40px 20px;
  font-family: "Arial", sans-serif;
}

#article-create::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Dark overlay for the background */
  z-index: -1;
}

h3 {
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 20px;
  font-weight: 700;
  text-align: center;
}

form {
  background-color: rgba(
    255,
    255,
    255,
    0.9
  ); /* Slightly transparent background */
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
}

.form-elem {
  margin-bottom: 24px;
}

.form-elem span {
  display: block;
  font-size: 1.2rem;
  color: #444;
  margin-bottom: 8px;
}

input,
textarea,
select {
  width: 100%;
  padding: 14px;
  font-size: 1.1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
}

textarea {
  resize: vertical;
}

button {
  width: 100%;
  padding: 14px;
  font-size: 1.1rem;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: #4682b4;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: #357ab7;
  transform: scale(1.05);
}

.category-btn {
  margin-right: 12px;
  padding: 10px 20px;
  font-size: 1.1rem;
  color: #555;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.category-btn:hover {
  background-color: #4caf50;
  color: white;
  border-color: #4caf50;
  transform: scale(1.05);
}

.category-btn.selected {
  background-color: #4caf50;
  color: white;
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
  color: white;
}

.submit-btn:hover {
  background-color: #45a049;
}

select {
  padding: 12px;
  background-color: #f1f1f1;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  cursor: pointer;
}

select:focus {
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
}

@media (max-width: 768px) {
  form {
    padding: 25px;
  }

  h3 {
    font-size: 2rem;
  }

  input,
  textarea,
  select {
    font-size: 1rem;
  }
}
</style>
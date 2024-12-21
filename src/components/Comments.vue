<template>
  <div class="comments-container">
    <h3>发表评论</h3>
    <div class="comment-input">
      <!-- 评论多行文本输入控件 -->
      <textarea
        v-model="message"
        :placeholder="placeholder"
        id="comment-area"
        cols="60"
        rows="5"
      ></textarea>
      <button @click="submit" class="submit-btn">发布</button>
    </div>

    <p class="comment-count">已有 {{ comments.length }} 条评论</p>
    <hr />

    <!-- 渲染所有评论内容 -->
    <div v-for="comment in comments" :key="comment.id" class="comment-box">
      <div class="comment-header">
        <span class="username">{{ comment.author.username }}</span>
        <span class="created">{{ formatted_time(comment.created) }}</span>
        <span v-if="comment.parent">
          回复 <span class="parent">{{ comment.parent.author.username }}</span>
        </span>
      </div>
      <div class="comment-content">{{ comment.content }}</div>
      <button class="reply-btn" @click="replyTo(comment)">回复</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import authorization from "@/utils/authorization";

export default {
  name: "CommentsCom",
  props: { article: Object },
  data: function () {
    return {
      comments: [],
      message: "",
      placeholder: "说点啥吧...",
      parentID: null,
    };
  },
  watch: {
    article() {
      this.comments = this.article !== null ? this.article.comments : [];
    },
  },
  methods: {
    submit() {
      const that = this;
      authorization().then(function (response) {
        if (response[0]) {
          axios
            .post(
              "/api/comment/",
              {
                content: that.message,
                article_id: that.article.id,
                parent_id: that.parentID,
              },
              {
                headers: {
                  Authorization:
                    "Bearer " + localStorage.getItem("access.myblog"),
                },
              }
            )
            .then(function (response) {
              that.comments.unshift(response.data);
              that.message = "";
              alert("留言成功");
            });
        } else {
          alert("请登录后评论。");
        }
      });
    },
    replyTo(comment) {
      this.parentID = comment.id;
      this.placeholder = "对" + comment.author.username + "说:";
    },
    formatted_time: function (iso_date_string) {
      const date = new Date(iso_date_string);
      return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
</script>

<style scoped>
/* 整体布局样式 */
.comments-container {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 15px;
}

.comment-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

/* 输入框样式 */
textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  font-size: 1rem;
  resize: none;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

textarea:focus {
  outline: none;
  border-color: steelblue;
  box-shadow: 0 0 5px rgba(70, 130, 180, 0.5);
}

/* 按钮样式 */
.submit-btn {
  align-self: flex-start;
  background: steelblue;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.submit-btn:hover {
  background: dodgerblue;
}

/* 评论数量样式 */
.comment-count {
  font-size: 1rem;
  color: gray;
}

/* 评论框样式 */
.comment-box {
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.comment-header {
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #555;
}

.username {
  font-weight: bold;
  color: #ff6600;
}

.created {
  margin-left: 10px;
  color: #888;
}

.parent {
  color: #007bff;
}

.comment-content {
  font-size: 1rem;
  margin-bottom: 10px;
  line-height: 1.5;
  color: #333;
}

/* 回复按钮 */
.reply-btn {
  background: lightslategray;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.reply-btn:hover {
  background: darkslategray;
}
</style>

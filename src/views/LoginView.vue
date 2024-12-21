<template>
  <div id="grid">
    <div id="signin">
      <h3>登录账号</h3>
      <form>
        <div class="form-elem">
          <label for="username">请输入您的账号：</label>
          <input
            v-model="signinName"
            type="text"
            id="username"
            placeholder="输入用户名"
          />
        </div>

        <div class="form-elem">
          <label for="password">请输入您的密码：</label>
          <input
            v-model="signinPwd"
            type="password"
            id="password"
            placeholder="输入密码"
          />
        </div>

        <!-- 显示错误信息 -->
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

        <div class="form-elem">
          <button v-on:click.prevent="signin">登录</button>
        </div>
        <div class="register-link">
          <router-link :to="{ name: 'RegisterView' }" class="register">
            没有账号? 前往注册
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import BlogHeader from "@/components/BlogHeader.vue";
export default {
  name: "LoginView",
  data: function () {
    return {
      signinName: "",
      signinPwd: "",
      errorMessage: "", // 用于存储错误信息
    };
  },
  methods: {
    signin() {
      const that = this;
      this.errorMessage = ""; // 清空之前的错误信息
      axios
        .post("/api/token/", {
          username: that.signinName,
          password: that.signinPwd,
        })
        .then(function (response) {
          const storage = localStorage;
          const expiredTime = Date.parse(response.headers.date) + 60000;
          storage.setItem("access.myblog", response.data.access);
          storage.setItem("refresh.myblog", response.data.refresh);
          storage.setItem("expiredTime.myblog", expiredTime);
          storage.setItem("username.myblog", that.signinName);
          axios
            .get("/api/user/" + that.signinName + "/")
            .then(function (response) {
              storage.setItem("isSuperuser.myblog", response.data.is_superuser);
              that.$router.push({ name: "Home" });
            });
        })
        .catch((error) => {
          // 根据后端返回的错误信息设置提示
          if (error.response && error.response.data) {
            this.errorMessage = "用户名或密码错误";
          } else {
            this.errorMessage = "登录失败，请检查网络连接。";
          }
          console.error("登录失败:", error);
        });
    },
  },
};
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: center;
}

body,
html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  height: 100%; /* 确保页面全高布局 */
  overflow: hidden; /* 禁用滚动条 */
}

/* 背景容器样式 */
#grid {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 占满整个视口 */
  background-image: url("../static/back.png"); /* 替换为你的背景图片地址 */
  background-size: cover; /* 图片覆盖整个背景 */
  background-position: center; /* 居中显示图片 */
  background-repeat: no-repeat; /* 防止背景重复 */
}

/* 表单容器样式 */
#signin {
  background-color: rgba(255, 255, 255, 0.9); /* 半透明白色背景 */
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px; /* 控制最大宽度 */
}

/* 标题样式 */
h3 {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

/* 表单元素样式 */
.form-elem {
  margin-bottom: 20px;
}

.form-elem label {
  display: block;
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #4caf50;
}

/* 按钮样式 */
button {
  width: 100%;
  height: 45px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

/* 注册链接样式 */
.register-link {
  text-align: center;
  margin-top: 20px;
}

.register {
  color: #4caf50;
  font-weight: bold;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.register:hover {
  color: #fff;
  background-color: #4caf50;
  padding: 5px 10px;
  border-radius: 5px;
}
</style>

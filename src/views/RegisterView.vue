
<template>
  <BlogHeader />
  <div id="grid-container">
    <div id="signup-form">
      <h2>注册账号</h2>
      <form>
        <div class="form-group">
          <label for="signupName">账号：</label>
          <input
            v-model="signupName"
            type="text"
            id="signupName"
            placeholder="输入用户名"
          />
        </div>
        <div class="form-group">
          <label for="signupPwd">密码：</label>
          <input
            v-model="signupPwd"
            type="password"
            id="signupPwd"
            placeholder="输入密码"
          />
        </div>
        <div class="form-group">
          <label for="confirmPwd">确认密码：</label>
          <input
            v-model="confirmPwd"
            type="password"
            id="confirmPwd"
            placeholder="确认密码"
          />
        </div>
        <div class="form-group">
          <button v-on:click.prevent="signup" class="btn-primary">提交</button>
        </div>
      </form>
      <p v-if="passwordMismatchError" class="error-message">
        两次输入的密码不一致
      </p>
    </div>
  </div>
  <BlogFooter />
</template>

<script>
import axios from "axios";
import BlogHeader from "@/components/BlogHeader.vue";
import BlogFooter from "@/components/BlogFooter.vue";

export default {
  name: "RegisterView",
  components: { BlogHeader, BlogFooter },
  data: function () {
    return {
      signupName: "",
      signupPwd: "",
      confirmPwd: "",
      signupResponse: null,
      passwordMismatchError: false,
    };
  },
  methods: {
    signup() {
      const that = this;
      if (this.signupPwd !== this.confirmPwd) {
        this.passwordMismatchError = true;
        return;
      }
      this.passwordMismatchError = false; // Reset error message if passwords match

      axios
        .post("/api/user/", {
          username: this.signupName,
          password: this.signupPwd,
        })
        .then((response) => {
          this.signupResponse = response.data;
          alert("用户注册成功，快去登录吧！");
          that.$router.push({ name: "LoginView" });
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  },
};
</script>

<style scoped>
#grid-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  /* padding: 20px; */
  max-width: 400px;
  margin: 20px auto;
}

#signup-form {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px; /* 增加顶部外边距 */
  margin-bottom: 20px; /* 增加底部外边距 */
  /* margin-left: 20px;
  margin-right: 20px; */
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-family: "Arial", sans-serif;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-family: "Arial", sans-serif;
  color: #555;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  font-family: "Arial", sans-serif;
}

.btn-primary {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-family: "Arial", sans-serif;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #45a049;
}

.error-message {
  color: red;
  text-align: center;
  font-size: 14px;
  margin-top: -10px;
  margin-bottom: 10px;
}
</style>
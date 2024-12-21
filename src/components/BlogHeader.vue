<template>
  <div id="header">
    <div class="grid">
      <div class="menu">
        <router-link to="/" class="menu-link">首页</router-link>
        <router-link to="/columns" class="menu-link">专栏</router-link>
      </div>
      <h1>My Blog</h1>
      <SearchButton />
    </div>
    <hr />
    <div class="login">
      <div v-if="hasLogin">
        <div class="dropdown">
          <button class="dropbtn">{{ username }}</button>
          <div class="dropdown-content">
            <router-link
              :to="{ name: 'UserCenter', params: { username: username } }"
              >修改密码</router-link
            >
            <router-link :to="{ name: 'ArticleCreate' }" v-if="isSuperuser">
              发表文章
            </router-link>
            <a href="#" @click.prevent="logout">登出</a>
          </div>
        </div>
      </div>
      <div v-else>
        <router-link to="/login" class="login-link">登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import SearchButton from "@/components/SearchButton.vue";
import authorization from "@/utils/authorization";
export default {
  name: "BlogHeader",
  components: { SearchButton },
  data: function () {
    return {
      username: "",
      hasLogin: false,
      isSuperuser: JSON.parse(localStorage.getItem("isSuperuser.myblog")),
    };
  },
  mounted() {
    authorization().then((data) => ([this.hasLogin, this.username] = data));
  },
  methods: {
    refresh() {
      this.username = localStorage.getItem("username.myblog");
    },
    logout() {
      localStorage.removeItem("access.myblog");
      localStorage.removeItem("refresh.myblog");
      localStorage.removeItem("expiredTime.myblog");
      localStorage.removeItem("username.myblog");
      localStorage.removeItem("isSuperuser.myblog");
      this.hasLogin = false;
      this.username = "";
      this.$router.push({ name: "Home" });
    },
  },
};
</script>

<style scoped>
#header {
  text-align: center;
  margin-top: 20px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  align-items: center;
}

.menu {
  text-align: left;
  padding-left: 10px;
}

.menu-link {
  margin: 0 15px;
  color: black;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.menu-link:hover {
  color: mediumslateblue;
}

.login {
  text-align: right;
  padding-right: 5px;
}

.login-link {
  color: #fff;
  background: linear-gradient(145deg, #6a5acd, #483d8b); /* 渐变背景 */
  padding: 10px 20px; /* 增加内边距 */
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 30px; /* 圆角 */
  display: inline-block;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 阴影 */
  transition: all 0.3s ease;
}

.login-link:hover {
  background: linear-gradient(145deg, #483d8b, #6a5acd); /* 反转渐变 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* 增强阴影 */
  transform: translateY(-3px); /* 向上浮动 */
}

.dropbtn {
  background: linear-gradient(145deg, #6a5acd, #483d8b); /* 渐变背景 */
  color: white;
  padding: 10px 20px; /* 提高按钮高度和宽度 */
  font-size: 1rem;
  border: none;
  cursor: pointer;
  border-radius: 30px; /* 更圆的按钮 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 添加阴影 */
  transition: all 0.3s ease;
}

/* 悬停效果 */
.dropbtn:hover {
  background: linear-gradient(145deg, #483d8b, #6a5acd); /* 反转渐变 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* 增强阴影 */
  transform: translateY(-3px); /* 向上轻微浮动 */
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 120px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  text-align: center;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropbtn {
  background-color: darkslateblue;
}
</style>

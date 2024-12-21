<template>
  <BlogHeader ref="header" />
  <div id="user-center">
    <h3>修改密码</h3>
    <form>
      <div class="form-elem">
        <label for="username">用户名：</label>
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="输入用户名"
        />
      </div>

      <div class="form-elem">
        <label for="password">新密码：</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="输入密码"
        />
      </div>

      <div class="form-actions">
        <button class="update-btn" @click.prevent="changeInfo">更新</button>
        <button class="delete-btn" @click.prevent="showingDeleteAlert = true">
          删除用户
        </button>
      </div>

      <div class="delete-alert" v-if="showingDeleteAlert">
        <p>确定删除用户吗？</p>
        <button class="confirm-btn" @click.prevent="confirmDelete">确定</button>
        <button class="cancel-btn" @click.prevent="showingDeleteAlert = false">
          取消
        </button>
      </div>
    </form>
  </div>
  <BlogFooter />
</template>

<script>
import axios from "axios";
import BlogHeader from "@/components/BlogHeader.vue";
import BlogFooter from "@/components/BlogFooter.vue";

import authorization from "@/utils/authorization";

const storage = localStorage;

export default {
  name: "UserCenter",
  components: { BlogHeader, BlogFooter },
  data: function () {
    return {
      username: "",
      password: "",
      token: "",
      showingDeleteAlert: false,
    };
  },
  mounted() {
    this.username = storage.getItem("username.myblog");
  },
  methods: {
    confirmDelete() {
      const that = this;
      authorization().then(function (response) {
        if (response[0]) {
          that.token = storage.getItem("access.myblog");
          axios
            .delete("/api/user/" + that.username + "/", {
              headers: { Authorization: "Bearer " + that.token },
            })
            .then(function () {
              storage.clear();
              that.$router.push({ name: "Home" });
            });
        }
      });
    },
    changeInfo() {
      const that = this;
      authorization().then(function (response) {
        if (!response[0]) {
          alert("登录已过期，请重新登录");
          return;
        }
        if (that.password.length > 0 && that.password.length < 6) {
          alert("Password too short.");
          return;
        }
        const oldName = storage.getItem("username.myblog");
        let data = {};
        if (that.username !== "") {
          data.username = that.username;
        }
        if (that.password !== "") {
          data.password = that.password;
        }
        that.token = storage.getItem("access.myblog");
        axios
          .patch("/api/user/" + oldName + "/", data, {
            headers: { Authorization: "Bearer " + that.token },
          })
          .then(function (response) {
            const name = response.data.username;
            storage.setItem("username.myblog", name);
            that.$router.push({
              name: "UserCenter",
              params: { username: name },
            });
            that.$refs.header.refresh();
          });
      });
    },
  },
};
</script>

<style scoped>
#user-center {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

h3 {
  color: #333;
  margin-bottom: 20px;
}

.form-elem {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
}

input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

button {
  display: inline-block;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  color: #fff;
}

.update-btn {
  background-color: #4caf50;
  margin-right: 10px;
}

.delete-btn {
  background-color: #f44336;
}

.update-btn:hover,
.delete-btn:hover {
  opacity: 0.8;
}

.delete-alert {
  margin-top: 20px;
  padding: 10px;
  background-color: #ffe9e9;
  border: 1px solid #f44336;
  border-radius: 5px;
}

.confirm-btn {
  background-color: #f44336;
  margin-right: 10px;
}

.cancel-btn {
  background-color: #9e9e9e;
}

button:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}
</style>

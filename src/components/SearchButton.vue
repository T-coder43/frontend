<template>
  <div class="search">
    <form>
      <input v-model="searchText" type="text" placeholder="请输入搜索内容..." />
      <button v-on:click.prevent="searchArticles">搜索</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "SearchButton",
  data: function () {
    return {
      searchText: "",
    };
  },
  methods: {
    searchArticles() {
      const text = this.searchText.trim();
      if (text) {
        this.$router.push({ name: "Home", query: { search: text } });
      }
    },
  },
};
</script>

<style scoped>
.search {
  padding-top: 22px;
}

* {
  box-sizing: border-box;
}

form {
  position: relative;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

input {
  width: 100%;
  height: 40px;
  padding-left: 15px;
  padding-right: 50px;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #007bff;
}

button {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  padding: 0 20px;
  height: 30px;
  background-color: #007bff;
  color: white;
  font-size: 14px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

button:focus {
  outline: none;
}
</style>

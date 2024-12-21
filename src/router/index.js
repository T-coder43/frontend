import { createWebHistory, createRouter } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import ArticleDetail from "@/views/ArticleDetail.vue";
import LoginView from "@/views/LoginView.vue";
import UserCenter from "@/views/UserCenter.vue";
import ArticleCreate from "@/views/ArticleCreate.vue";
import ArticleEdit from "@/views/ArticleEdit.vue";
import RegisterView from "@/views/RegisterView.vue";
import ColumnsView from "@/views/ColumnsView.vue";
import CategoryArticles from "@/components/CategoryArticles.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: HomeView,
    },
    {
        path: "/article/:id",
        name: "ArticleDetail",
        component: ArticleDetail
    },
    {
        path: "/columns",
        name: "ColumnsView",
        component: ColumnsView
    },
    {
        path: "/login",
        name: "LoginView",
        component: LoginView
    },
    {
        path: "/register",
        name: "RegisterView",
        component: RegisterView
    },
    {
        path: "/user/:username",
        name: "UserCenter",
        component: UserCenter
    },
    {
        path: "/article/create",
        name: "ArticleCreate",
        component: ArticleCreate
    },
    {
        path: "/article/edit/:id",
        name: "ArticleEdit",
        component: ArticleEdit
    },
    {
        path: "/category/:categoryId/articles",
        name: "CategoryArticles",
        component: CategoryArticles,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
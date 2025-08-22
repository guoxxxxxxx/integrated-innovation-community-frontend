<template>
    <div class="article-cover">
        <slot></slot>
    </div>
</template>

<script lang='ts' setup>

</script>

<style scoped>
.article-cover {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url("@/assets/img/header-cover.jpg");
    height: 200px;
    width: 100%;
}

.article-cover::before {
    width: 100%;
    height: 200px;
    background-color: rgba(0, 0, 0, 0.3);
    content: "";
    position: absolute;
}

@keyframes fadeUpInCover {
    0% {
        -webkit-transform: translateY(-70px);
        transform: translateY(-70px);
        opacity: 0%;
    }

    100% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
        opacity: 100%;
    }
}
</style>
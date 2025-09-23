<template>
    <header style="padding-bottom: 0;">
        <ManageComponent/>
    </header>
    <main>
        <router-view />
    </main>
</template>

<script setup>
    import ManageComponent from '@/components/layout/manage.vue';   
</script>

<style scoped>

main{
    margin-top: 44px;
}
</style>
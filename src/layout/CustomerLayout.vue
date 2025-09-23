<template>
    <header :class="{ hidden: isHidden }">
        <HeaderComponent @update-isHidden="updateIsHidden"/>
    </header>
    <main>
        <router-view />
    </main>
</template>

<script setup>
    import HeaderComponent from '@/components/layout/Header.vue';
    import { ref } from 'vue';

    const isHidden = ref(false);
    const updateIsHidden = (value) => {
    isHidden.value = value;
    };
</script>
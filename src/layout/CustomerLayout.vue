<template>
    <header :class="{ hidden: isHidden }">
        <HeaderComponent @update-isHidden="updateIsHidden"/>
    </header>
    <main style="margin-top: 147px;">
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
<template>
    <div class='v-main-wrapper'>
        <v-search-field/>
        <v-table/>
    </div>    
</template>

<script lang='ts'>
import { defineComponent } from '@vue/composition-api'
import vTable from './v-table.vue'
import vSearchField from './v-search-field.vue'
import {mapGetters} from 'vuex'

export default defineComponent({
    name: 'v-main-wrapper',
    components: {
        vTable,
        vSearchField
    },
    computed: {
        ...mapGetters([
            'DATA'
        ])
    }
})
</script>

<style>
.v-main-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 30px;
}
</style>
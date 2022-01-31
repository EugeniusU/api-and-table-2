<template>
    <span>Show only leads with contacts</span>
    <button @click='show'>Show</button>

    <div class='v-table'>
        <div class='header'>
            <div>Название</div>
            <div>Статус</div>
            <div>Ответственный</div>
            <div>Дата создания</div>
            <div>Бюджет</div>
        </div>

        <v-table-item
            v-for='(obj, index) in this.leads'
            :key='index'
            :tableRow='obj'
        >
        </v-table-item>
    </div>    
</template>

<script lang='ts'>
import { defineComponent } from '@vue/composition-api'
import vTableItem from './v-table-item.vue'
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'

export default defineComponent({
    name: 'v-table',
    components: {
       vTableItem
    },
    computed: {
        ...mapGetters([
            'DATA'
        ]),
        ...mapState([
            'leads'
        ]),
        ...mapMutations([
            'APPLY_TO_LEADS'
        ])
    },
    methods: {
        ...mapActions([
            'GET_DATA_FROM_API',
            'GET_LEADS_FROM_API',
            'GET_CONTACTS_FROM_API',
            'GET_CONTACTS_WITH_LEADS_FROM_API'
        ]),
        show() {
            this.GET_CONTACTS_WITH_LEADS_FROM_API().then(console.log)
        }
    },
    mounted() {
        this.GET_LEADS_FROM_API().then(console.log)
        this.GET_CONTACTS_FROM_API().then((res: []) => this.$store.commit('APPLY_TO_LEADS', res))
    }
})
</script>

<style>
.v-table {
    display: flex;
    flex-direction: column;
    align-self: center;
    width: 80%;
    margin-top: 30px;
}

.header {
    display: flex;
    width: 100%;
    justify-content: space-between;
}

.header > div {
    flex-basis: 20%;
}
</style>
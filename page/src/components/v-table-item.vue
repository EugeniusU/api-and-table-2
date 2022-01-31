<template>
    <div class='v-table-item'>

        <div class='info_wrap'>           
            <div class='title'>
                <button class='list_btn' @click='showContact'>
                    <i class='material-icons' v-if='!isShowContact'>add</i>
                    <i class='material-icons' v-if='isShowContact'>remove</i>
                </button>
                <span>
                    {{tableRow.name}}
                </span>    
            </div>
            <div class='info__status'>{{tableRow.statusname.toLowerCase()}}</div>
            <div class='info__user'>
                <i class='material-icons'>account_circle</i>
                <span>{{tableRow.user}}</span>
            </div>
            <div class='info__created_time'>{{new Date(tableRow.createdAt * 1000).toLocaleString()}}</div>
            <div class='info__price'>{{tableRow.budget}}</div>
        </div>

        <router-view name='a' v-if="isShowContact">
            <Contact :tableRow="tableRow"/>
        </router-view>

    </div>    
</template>

<script lang='ts'>
import { defineComponent } from '@vue/composition-api'
import Contact from '../views/Contact.vue'

interface isShow {
    isShowContact: boolean
}


export default defineComponent({
    name: 'v-table-item',
    components: {
        Contact
    },
    data() {
        return {
            isShowContact: false
        } as isShow
    },
    props: {
        tableRow: Object
    },
    methods: {
        showContact: function(): void {
            this.isShowContact = !this.isShowContact;
        }
    }
    
})
</script>

<style>
.v-table-item {
    display: flex;
    flex-direction: column;
    min-height: 30px;
    margin-top: 15px;
}

.info_wrap, .contact_wrap {
    display: flex;
    justify-content: space-between;
    width: 100%;
    min-height: 30px;
}

.contact_wrap {
    display: flex;
    width: calc(20% + 100px);
    justify-content: space-around;
}

.info_wrap > div, .contact > div {
    flex-basis: 20%;
}

.contact > div {
    border: none;
    background: #e7e7e7;
}

.list_btn {
    border: none;
    background: transparent;
    align-self: baseline;
    align-self: center;
}

.title_wrap, .title {
    display: flex;
}

.contact {
    display: flex;
}

.title span, .info__status, .info__user, .info__price, .info__created_time {
    align-self: center;
}

.contact__name, .info__user {
    display: flex;
}

.contact__name span, .info__user span {
    align-self: center;
}

.contact_wrap i {
    align-self: center;
}

.v-table i {
    margin-right: 10px;
}

</style>
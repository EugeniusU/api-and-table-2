<template>
  <div class="contact">
    <div class='contact__name'>
                <i class='material-icons'>account_circle</i>
                <span>{{tableRow.contact.name}}</span>
            </div>
            <i class='material-icons' :title='tableRow.contact.phone'>contact_phone</i>
            <i class='material-icons' :title='tableRow.contact.email'>email</i>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
    name: 'Contact',
    props: {
      tableRow: Object
    }
})
</script>

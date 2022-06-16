<script setup>

import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import ModalBoxConfirm from '@/components/modals/ModalBoxCard.vue'
const emit = defineEmits(['AccLogout'])
const store = useStore()
const user = computed(() => store.state.user.user)
const showEditname = ref(false)
//  const showEditemail = ref(false)
const showEditpassword = ref(false)
const tarif = () => {
  store.commit('basic', { key: 'navig', value: 1 })
}
/*  const pass = () => {
  store.commit('basic', { key: 'navig', value: 3 })
}  */
const logout = () => {
  emit('AccLogout')
}
</script>

<template>
  <modal-box-confirm
    v-model="showEditname"
    button="warning"
    has-button
    has-close
    button-label="сохранить"
  >
    <span class="font-semibold text-base mb-4 relative bottom-1">Изменить имя</span>
    <div>
    <form>
      <div class="form-group">
        <input type="text" class="w-full border border-orange-400 rounded h-[36px] p-2" v-model="user.current_user_name" />
      </div>
      <div class="form-group text-right">
        <button class="bg-orange-400 text-white p-2 rounded-md">Сохранить</button>
      </div>
    </form>
      <div> </div>
    </div>
  </modal-box-confirm>
  <modal-box-confirm
    v-model="showEditpassword"
    button="warning"
    has-button
    has-close
    button-label="сохранить"
  >
    <span class="font-semibold text-base mb-4 relative bottom-1">Изменить пароль</span>
    <div>
      <form
        class="mt-2"
      >
        <div class="form-group">
        <p>Введите старый пароль</p>
        <input
          class="w-full border border-orange-400 rounded h-[36px] p-2"
          type="password"
        >
        </div>
        <div class="form-group">
        <p>Новый пароль</p>
        <input
          class="w-full border border-orange-400 rounded h-[36px] p-2"
          type="password"
        >
        </div>
        <div class="form-group">
        <p>Подтвердите пароль</p>
        <input
          class="w-full border border-orange-400 rounded h-[36px] p-2"
          type="password"
        >
        </div>
      </form>
      <form class="mt-4 ml-5">
        <div class="form-group text-right">
          <button class="bg-orange-400 text-white p-2 rounded-md">Сохранить</button>
        </div>
      </form>
      <div> </div>
    </div>
  </modal-box-confirm>
<form class=" mx-6 overscroll-auto">
  <div class="flex pb-3">
    <form class="text-left w-40">
      <div class="text-center mb-3 mr-5">
        <div class="pr-2">
          <span class="circle-image">
          <img
            :src="user.foto_link"
            class="rounded-[27px] content-center object-cover">
            </span>
        </div>
        <div>
          <input id="iconfile" type="file" class="hidden">
          <label for="iconfile" class="text-[13px] mr-3 justify-center cursor-pointer">изменить фото</label>
          <br>
        </div>
      </div>
    </form>
    <form class="text-left w-64">
      <div class="font-medium text-[roboto] mb-4 text-base landing-[19px]">Тип аккаунта</div>
      <p v-if="user.license_type === 0" class="text-sm font-medium landing-4">Пробный тариф</p>
      <p v-if="user.license_type === 1" class="text-sm font-medium landing-4">Премиум тариф</p>
      <p v-if="user.license_type === 2" class="text-sm font-medium landing-4">Бизнес тариф</p>
      <p class="text-sm mt-2 " v-if="user.license_type === 0" >
        Обновите тарифный план ЛидерТаск для неограниченных возможностей
      </p>
      <p class="mt-1 text-sm font-normal font-[Roboto] landing-5 text-[#606061]"><a>{{ user.date_expired }}({{ user.days_left }})</a></p>
      <div class="mt-2">
        <button class="border-gray-400 font-normal border rounded-md p-2.5 text-gray-600 mt-2 text-sm landing-4"
              type="button"
              @click="tarif()"
      >
        Управление тарифом
      </button>
      </div>
      <div class="mt-6">
        <p class="text-base font-medium mb-2 text-[#4C4C4D]">Имя</p>
        <form class="mb-2">
        <div class="text-sm landing-4 font-normal">{{user.current_user_name}}</div>
          <button type="button" class="mt-2 text-[13px] landing-[13px] text-[#007BE5]" @click="showEditname = true">Изменить имя</button>
        </form>
        <div class="mb-2 mt-6">
          <p class="text-base font-medium mb-2 text-[#4C4C4D]">Email</p>
          <div contenteditable="true" class="text-[13px] landing-[13px] text-[#007BE5]">{{ user.current_user_email }}</div>
         <!-- <button type="button" class="mt-2 text-base text-blue-600" @click="showEditemail = true">Изменить email</button> -->
        </div>
        <div class="mb-2 mt-6">
        <form>
          <p class="text-base font-medium mb-2 text-[#4C4C4D]">Пароль</p>
          <button type="button" class="mt-2 text-[13px] landing-[13px] text-[#007BE5]" @click="showEditpassword = true">Изменить пароль</button>
        </form>
        </div>
        <div class="mb-2 mt-6">
        <form >
          <button class="bg-orange-400 text-white mt-2 text-base p-2 rounded-md"
                  @click="logout()">
            Выйти из аккаунта</button>
        </form>
        </div>
      </div>
    </form>

  </div>

</form>
</template>
<style scoped>

.circle-image{
  display: inline-block;
  border-radius: 10px;

}
.circle-image img{
  width: 106px;
  height: 106px;
}
</style>

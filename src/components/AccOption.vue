<script setup>

import { computed } from 'vue'
import { useStore } from 'vuex'
import { PATCH_SETTINGS } from '@/store/actions/navigator.js'

const store = useStore()
const settings = computed(() => {
  return store.state.navigator.navigator.settings
})

const updateSettings = () => {
  store.dispatch(
    PATCH_SETTINGS,
    {
      show_completed_tasks: settings.value.show_completed_tasks ? 1 : 0,
      add_task_to_begin: settings.value.add_task_to_begin ? 1 : 0,
      cal_number_of_first_week: settings.value.cal_number_of_first_week ? 1 : 0,
      cal_show_week_number: settings.value.cal_show_week_number ? 1 : 0,
      nav_show_tags: settings.value.nav_show_tags,
      nav_show_overdue: settings.value.nav_show_overdue ? 1 : 0,
      nav_show_summary: settings.value.nav_show_summary ? 1 : 0,
      nav_show_emps: settings.value.nav_show_emps,
      nav_show_markers: settings.value.nav_show_markers,
      language: settings.value.language,
      stopwatch: settings.value.stopwatch,
      cal_work_time: settings.value.cal_work_time,
      reminders_in_n_minutes: settings.value.reminders_in_n_minutes,
      cal_work_week: settings.value.cal_work_week,
      compact_mode: settings.value.compact_mode
    }
  )
}
</script>
    <template>
    <form class="px-5">
        <div class="my-2">
            <div class="flex mt-2">
              <div class="checkbox">
              <input type="checkbox" id="opt_1" :checked="settings.add_task_to_begin===true"  v-model="settings.add_task_to_begin" @change="updateSettings()" class="custom-checkbox-orange" />
              <label class="text-base" for="opt_1">Добавлять задачи в начало списка</label>
              </div>
             <!--   <a class="ml-2" v-if="settings.add_task_to_begin === true">Вкл.</a>
                <a class="ml-2" v-if="settings.add_task_to_begin === false">Выкл.</a> -->
            </div>
        </div>
        <div class="my-2 mt-4">
            <div class="flex mt-2">
              <div class="checkbox">
                <input type="checkbox" id="opt_2" v-model="settings.cal_number_of_first_week" @change="updateSettings()" class="custom-checkbox-orange outline-none" />
                <label class="text-base" for="opt_2">Первая неделя с 1 января</label>
              </div>
             <!--   <a class="ml-2" v-if="settings.cal_number_of_first_week === true">Вкл.</a>
                <a class="ml-2" v-if="settings.cal_number_of_first_week === false">Выкл.</a> -->
            </div>
        </div>
        <div class="my-2 mt-4">
            <div class="flex mt-2">
              <div class="checkbox">
                <input type="checkbox" id="opt_3" v-model="settings.cal_show_week_number" @change="updateSettings()" class="custom-checkbox-orange outline-none" />
                <label class="text-base" for="opt_3">Показывать номера недель в календаре</label>
              </div>
            <!--    <a class="ml-2" v-if="settings.cal_show_week_number === true">Вкл.</a>
                <a class="ml-2" v-if="settings.cal_show_week_number === false">Выкл.</a> -->
            </div>
        </div>
        <div class="my-2 mt-4">
            <div class="flex mt-2">
              <div class="checkbox">
                <input type="checkbox" id="opt_4" v-model="settings.nav_show_overdue" @change="updateSettings()" class="custom-checkbox-orange outline-none" />
                <label class="text-base" for="opt_4">Показывать раздел Просрочено</label>
              </div>
            <!--    <a class="ml-2" v-if="settings.nav_show_overdue === true">Вкл.</a>
                <a class="ml-2" v-if="settings.nav_show_overdue === false">Выкл.</a> -->
            </div>
        </div>
        <div class="my-2 mt-4">
            <div class="flex mt-2">
              <div class="checkbox">
                <input type="checkbox" id="opt_5" class="custom-checkbox-orange outline-none">
                <label class="text-base" for="opt_5">Показывать количество задач</label>
              </div>
             <!--   <a class="ml-2" v-if="settings.nav_show_summary === 1">Вкл.</a>
                <a class="ml-2" v-if="settings.nav_show_summary === 0">Выкл.</a> -->
            </div>
        </div>
        <div class="my-2 mt-10">
          <p class="text-base font-semibold">Напиоминание о задаче за: </p>
          <div class="flex mt-2">
            <select class="border border-gray-300 p-2 w-40 rounded-md text-base" v-model="settings.reminders_in_n_minutes" @change="updateSettings()">
              <option value="0">0 мин</option>
              <option value="10">10 мин</option>
              <option value="15">15 мин</option>
              <option value="30">30 мин</option>
              <option value="60">60 мин</option>
            </select>
          </div>
        </div>
        <div class="my-2 mt-4">
            <p class="text-base font-semibold">Язык</p>
            <div class="flex mt-2">
                <select class="border border-gray-300 p-2 w-40 rounded-md text-base" v-model="settings.language" @change="updateSettings()">
                    <option value="russian">Русский</option>
                    <option value="english">Английский</option>
                </select>
            </div>
        </div>

    </form>
    </template>
<style scoped>
/* для элемента input c type="checkbox" */
.custom-checkbox-orange {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

/* для элемента label, связанного с .custom-checkbox */
.custom-checkbox-orange+label {
  display: inline-flex;
  align-items: center;
  user-select: none;
}

/* создание в label псевдоэлемента before со следующими стилями */
.custom-checkbox-orange+label::before {
  content: '';
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  flex-shrink: 0;
  flex-grow: 0;
  border: 1px solid #adb5bd;
  border-radius: 0.25em;
  margin-right: 0.5em;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 55% 100%;
}

/* стили при наведении курсора на checkbox */
.custom-checkbox-orange:not(:disabled):not(:checked)+label:hover::before {
  border-color: gray;
}

/* стили для активного чекбокса (при нажатии на него) */
.custom-checkbox-orange:not(:disabled):active+label::before {
  border-color: gray;
}

/* стили для чекбокса, находящегося в фокусе */
.custom-checkbox-orange:focus+label::before {
}

/* стили для чекбокса, находящегося в фокусе и не находящегося в состоянии checked */
.custom-checkbox-orange:focus:not(:checked)+label::before {
  border-color: gray;
}

/* стили для чекбокса, находящегося в состоянии checked */
.custom-checkbox-orange:checked+label::before {
  background-color: rgb(251 146 60);
  background-image: url("data:image/svg+xml,%3csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 20'%3e%3cpath fill='%23fff' d='M24.4107 1.30299C25.2766 2.02718 25.3681 3.2892 24.6148 4.1218L11.8142 18.2718C10.8103 19.3815 9.06094 19.4991 7.9062 18.5344L0.902667 12.6839C0.0362917 11.9601 -0.0558157 10.6982 0.69694 9.86518C1.44969 9.0322 2.76226 8.94364 3.62864 9.66738L9.58691 14.6447L21.4789 1.49931C22.2321 0.666707 23.5447 0.578813 24.4107 1.30299z'/%3e%3c/svg%3e");
}

/* стили для чекбокса, находящегося в состоянии disabled */
.custom-checkbox-orange:disabled+label::before {
  background-color: #e9ecef;
}
</style>

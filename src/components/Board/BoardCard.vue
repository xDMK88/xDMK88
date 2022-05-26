<template>
  <div
    class="bg-white shadow rounded-xl p-3"
    @click="selectCard(card)"
  >
    <div
      v-if="haveCover"
      class="rounded display-inline mb-4"
      :style="{ background: card.cover_color, height: `${coverHeight}px` }"
    >
      <!-- сюда сделать загрузку картинки -->
      <div>&nbsp;</div>
    </div>
    <div>
      <div class="flex items-start justify-between">
        <div>
          <p
            class="text-[#444444] font-['Tahoma'] text-sm"
          >
            {{ card.name }}
          </p>
          <p
            v-if="card.comment"
            class="text-[#555555] font-['Tahoma'] whitespace-pre-line text-xs mt-1"
          >
            {{ card.comment }}
          </p>
        </div>
        <!-- кнопка три точки -->
        <div
          v-if="!readOnly"
          class="hover:-m-px hover:border border-black"
          @click="showCardMenu(card, $event)"
        >
          <svg
            class="m-0.5"
            width="16"
            height="16"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9.35445 16.1053C8.37341 16.1053 7.57812 15.31 7.57812 14.3289C7.57812 13.3479 8.37341 12.5526 9.35445 12.5526C10.3355 12.5526 11.1308 13.3479 11.1308 14.3289C11.1308 15.31 10.3355 16.1053 9.35445 16.1053ZM9.35445 10.7763C8.37341 10.7763 7.57812 9.981 7.57812 8.99996C7.57813 8.01892 8.37341 7.22364 9.35445 7.22364C10.3355 7.22364 11.1308 8.01892 11.1308 8.99996C11.1308 9.981 10.3355 10.7763 9.35445 10.7763ZM7.57813 3.67098C7.57813 4.65202 8.37341 5.4473 9.35445 5.4473C10.3355 5.4473 11.1308 4.65202 11.1308 3.67098C11.1308 2.68995 10.3355 1.89466 9.35445 1.89466C8.37341 1.89466 7.57813 2.68995 7.57813 3.67098Z"
              fill="black"
              fill-opacity="0.5"
            />
          </svg>
        </div>
      </div>
    </div>
    <div
      v-if="showDate || cost || card.has_files || card.has_msgs"
      class="flex mt-4 justify-between"
    >
      <div class="flex flex-wrap">
        <!-- выводим дату -->
        <div
          v-if="showDate"
          class="flex items-center m-0.5"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.6599 2.665C4.6599 2.29773 4.95764 2 5.3249 2C5.69217 2 5.9899 2.29773 5.9899 2.665V3.14001H11.6914V2.665C11.6914 2.29773 11.9891 2 12.3564 2C12.7237 2 13.0214 2.29773 13.0214 2.665V3.14001H14.16C14.9995 3.14001 15.68 3.82054 15.68 4.66001V14.54C15.68 15.3795 14.9995 16.06 14.16 16.06H3.52C2.68053 16.06 2 15.3795 2 14.54V4.66001C2 3.82054 2.68053 3.14001 3.52 3.14001H4.6599V2.665ZM11.6914 4.18501V4.945C11.6914 5.31227 11.9891 5.61 12.3564 5.61C12.7237 5.61 13.0214 5.31227 13.0214 4.945V4.18501H14.16C14.4223 4.18501 14.635 4.39768 14.635 4.66001V14.54C14.635 14.8023 14.4223 15.015 14.16 15.015H3.52C3.25766 15.015 3.045 14.8023 3.045 14.54V4.66001C3.045 4.39768 3.25766 4.18501 3.52 4.18501H4.6599V4.945C4.6599 5.31227 4.95764 5.61 5.3249 5.61C5.69217 5.61 5.9899 5.31227 5.9899 4.945V4.18501H11.6914ZM5.03906 8.86067C5.03906 8.45005 5.37193 8.11719 5.78254 8.11719C6.19315 8.11719 6.52602 8.45005 6.52602 8.86067C6.52602 9.27128 6.19315 9.60414 5.78254 9.60414C5.37193 9.60414 5.03906 9.27128 5.03906 8.86067ZM8.17969 8.86067C8.17969 8.45005 8.51256 8.11719 8.92317 8.11719C9.33378 8.11719 9.66665 8.45005 9.66665 8.86067C9.66665 9.27128 9.33378 9.60414 8.92317 9.60414C8.51256 9.60414 8.17969 9.27128 8.17969 8.86067ZM11.8957 8.11719C11.4851 8.11719 11.1522 8.45005 11.1522 8.86067C11.1522 9.27128 11.4851 9.60414 11.8957 9.60414C12.3063 9.60414 12.6392 9.27128 12.6392 8.86067C12.6392 8.45005 12.3063 8.11719 11.8957 8.11719ZM5.78254 11.1572C5.37193 11.1572 5.03906 11.49 5.03906 11.9006C5.03906 12.3113 5.37193 12.6441 5.78254 12.6441C6.19315 12.6441 6.52602 12.3113 6.52602 11.9006C6.52602 11.49 6.19315 11.1572 5.78254 11.1572ZM8.92317 11.1572C8.51255 11.1572 8.17969 11.49 8.17969 11.9007C8.17969 12.3113 8.51255 12.6441 8.92317 12.6441C9.33378 12.6441 9.66665 12.3113 9.66665 11.9007C9.66665 11.49 9.33378 11.1572 8.92317 11.1572ZM11.1522 11.9007C11.1522 11.49 11.4851 11.1572 11.8957 11.1572C12.3063 11.1572 12.6392 11.49 12.6392 11.9007C12.6392 12.3113 12.3063 12.6441 11.8957 12.6441C11.4851 12.6441 11.1522 12.3113 11.1522 11.9007Z"
              fill="black"
              fill-opacity="0.5"
            />
          </svg>
          <span class="text-[11px] leading-[11px] text-[#777777] font-['Tahoma'] mx-0.5">
            {{ date }}
          </span>
        </div>
        <!-- выводим бюджет -->
        <div
          v-if="cost"
          class="flex items-center m-0.5"
        >
          <svg
            width="14"
            height="10"
            viewBox="0 0 14 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2.25924 1.44448C2.10208 1.44448 1.95135 1.50691 1.84021 1.61805C1.72908 1.72918 1.66665 1.87991 1.66665 2.03707V7.963C1.66665 8.12016 1.72908 8.27089 1.84021 8.38202C1.95135 8.49316 2.10208 8.55559 2.25924 8.55559H11.7407C11.8979 8.55559 12.0486 8.49316 12.1597 8.38202C12.2709 8.27089 12.3333 8.12016 12.3333 7.963V2.03707C12.3333 1.87991 12.2709 1.72918 12.1597 1.61805C12.0486 1.50691 11.8979 1.44448 11.7407 1.44448H2.25924ZM1.00216 0.779994C1.33556 0.446595 1.78774 0.259295 2.25924 0.259295H11.7407C12.2122 0.259295 12.6644 0.446596 12.9978 0.779994C13.3312 1.11339 13.5185 1.56558 13.5185 2.03707V7.963C13.5185 8.43449 13.3312 8.88668 12.9978 9.22008C12.6644 9.55347 12.2122 9.74078 11.7407 9.74078H2.25924C1.78774 9.74078 1.33556 9.55348 1.00216 9.22008C0.668764 8.88668 0.481463 8.43449 0.481463 7.963V2.03707C0.481463 1.56558 0.668764 1.11339 1.00216 0.779994Z"
              fill="#7E7E80"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.99998 3.81485C6.34542 3.81485 5.8148 4.34548 5.8148 5.00004C5.8148 5.6546 6.34542 6.18522 6.99998 6.18522C7.65454 6.18522 8.18517 5.6546 8.18517 5.00004C8.18517 4.34548 7.65454 3.81485 6.99998 3.81485ZM4.62961 5.00004C4.62961 3.69092 5.69086 2.62967 6.99998 2.62967C8.3091 2.62967 9.37035 3.69092 9.37035 5.00004C9.37035 6.30916 8.3091 7.37041 6.99998 7.37041C5.69086 7.37041 4.62961 6.30916 4.62961 5.00004Z"
              fill="#7E7E80"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3.6712 0.304403C3.89264 0.396125 4.03702 0.612206 4.03702 0.851887C4.03702 1.63771 3.72485 2.39136 3.16919 2.94702C2.61352 3.50268 1.85988 3.81485 1.07406 3.81485C0.834374 3.81485 0.618293 3.67047 0.526571 3.44903C0.434849 3.2276 0.485549 2.97271 0.655029 2.80323L3.0254 0.432861C3.19488 0.263381 3.44976 0.212681 3.6712 0.304403ZM12.9259 7.37041C12.4544 7.37041 12.0022 7.55771 11.6688 7.89111C11.3354 8.2245 11.1481 8.67669 11.1481 9.14818C11.1481 9.47546 10.8828 9.74078 10.5555 9.74078C10.2283 9.74078 9.96294 9.47546 9.96294 9.14818C9.96294 8.36236 10.2751 7.60872 10.8308 7.05305C11.3864 6.49739 12.1401 6.18522 12.9259 6.18522C13.2532 6.18522 13.5185 6.45053 13.5185 6.77781C13.5185 7.10509 13.2532 7.37041 12.9259 7.37041Z"
              fill="#7E7E80"
            />
          </svg>

          <span class="text-[11px] leading-[11px] text-[#777777] font-['Tahoma'] mx-0.5">
            {{ cost }}
          </span>
        </div>
      </div>
      <!-- Иконки справа -->
      <div
        v-if="card.has_files || card.has_msgs"
        class="flex items-center"
      >
        <!-- Иконка сообщений -->
        <svg
          v-if="card.has_msgs"
          class="m-0.5"
          width="16"
          height="16"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.33005 5.94862H10.7258C11.0641 5.94862 11.3491 5.66404 11.3491 5.32609C11.3491 4.98815 11.0641 4.70356 10.7258 4.70356H5.33005C4.9917 4.70356 4.70678 4.98815 4.70678 5.32609C4.70678 5.66404 4.97389 5.94862 5.33005 5.94862Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            d="M8.92722 7.74506C9.26556 7.74506 9.55049 7.46048 9.55049 7.12253C9.55049 6.78459 9.26556 6.5 8.92722 6.5H5.33005C4.9917 6.5 4.70678 6.78459 4.70678 7.12253C4.70678 7.46048 4.9917 7.74506 5.33005 7.74506H8.92722Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            d="M14.038 9.36364V3.97431C14.038 2.88933 13.1477 2 12.0614 2H3.97666C2.89039 2 2 2.88933 2 3.97431V12.9565C2 13.2055 2.14246 13.419 2.35616 13.5257C2.44519 13.5613 2.53423 13.5791 2.62327 13.5791C2.76573 13.5791 2.9082 13.5257 3.03285 13.4368L5.56155 11.3379H12.0792C13.1477 11.3379 14.038 10.4486 14.038 9.36364ZM4.92047 10.2174L3.24654 11.6047V3.97431C3.24654 3.58301 3.56708 3.26285 3.95885 3.26285H12.0436C12.4353 3.26285 12.7559 3.58301 12.7559 3.97431V9.36364C12.7559 9.75494 12.4353 10.0751 12.0436 10.0751H5.33005C5.16978 10.0751 5.02732 10.1285 4.92047 10.2174Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            d="M14.7682 5.59289C14.4298 5.59289 14.1449 5.87747 14.1449 6.21542C14.1449 6.55336 14.4298 6.83795 14.7682 6.83795C15.1599 6.83795 15.4805 7.15811 15.4805 7.54941V14.7708L14.2517 13.7925C14.1449 13.7036 14.0024 13.6502 13.86 13.6502H7.57383C7.18206 13.6502 6.86152 13.33 6.86152 12.9387V12.4941C6.86152 12.1561 6.57659 11.8715 6.23825 11.8715C5.8999 11.8715 5.61497 12.1561 5.61497 12.4941V12.9387C5.61497 14.0237 6.50536 14.913 7.59163 14.913H13.6641L15.712 16.585C15.8188 16.6739 15.9613 16.7273 16.1037 16.7273C16.1928 16.7273 16.2818 16.7095 16.3709 16.6739C16.5845 16.5672 16.727 16.3538 16.727 16.1047V7.5672C16.7448 6.48222 15.8544 5.59289 14.7682 5.59289Z"
            fill="black"
            fill-opacity="0.5"
          />
        </svg>
        <!-- Иконка файлов -->
        <svg
          v-if="card.has_files"
          class="m-0.5"
          width="16"
          height="16"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.38349 14.5571C4.30581 15.4707 5.51496 15.9219 6.7241 15.9219C7.93325 15.9219 9.1424 15.4651 10.0647 14.5516L15.863 8.80845C17.179 7.50497 17.179 5.38264 15.863 4.07916C15.2275 3.4497 14.3783 3.09877 13.4785 3.09877C12.5786 3.09877 11.7294 3.44413 11.0939 4.07916L5.76804 9.35435C4.98069 10.1342 4.98069 11.4098 5.76804 12.1897C6.55539 12.9696 7.84327 12.9696 8.63062 12.1897L12.1343 8.71932C12.3987 8.45751 12.3987 8.03416 12.1343 7.77235C11.87 7.51054 11.4426 7.51054 11.1783 7.77235L7.68017 11.2483C7.41585 11.5101 6.98843 11.5101 6.7241 11.2483C6.45978 10.9865 6.45978 10.5631 6.7241 10.3013L12.0443 5.0317C12.4268 4.65291 12.9329 4.44681 13.4785 4.44681C14.0183 4.44681 14.5301 4.65291 14.9126 5.0317C15.6999 5.81156 15.6999 7.08719 14.9126 7.86705L9.10865 13.6102C7.79265 14.9136 5.64993 14.9136 4.33393 13.6102C3.69843 12.9807 3.34974 12.1396 3.34974 11.2483C3.34974 10.357 3.69843 9.51589 4.33956 8.88643L10.1322 3.14333C10.3965 2.88152 10.3965 2.45817 10.1322 2.19636C9.86788 1.93455 9.44047 1.93455 9.17614 2.19636L3.38349 7.93946C2.48928 8.81959 2 9.99495 2 11.2483C2 12.4961 2.48928 13.6714 3.38349 14.5571Z"
            fill="black"
            fill-opacity="0.5"
          />
        </svg>
      </div>
    </div>
    <div
      v-if="card.user"
      class="flex mt-4 mx-0.5 items-center"
      :class="{ 'mt-2': showDate || cost || card.has_files || card.has_msgs }"
    >
      <img
        v-if="employeesByEmail[card.user]"
        class="w-4 h-4 rounded-full mr-1"
        :src="employeesByEmail[card.user].fotolink"
        alt="Avatar"
      >
      <span class="text-[13px] leading-[13px] text-[#757575] font-['Tahoma']">
        {{ getEmpNameByEmail(card.user) }}
      </span>
    </div>
  </div>
</template>

<script>
//  import Popper from 'vue3-popper'
import { SELECT_CARD } from '@/store/actions/cards'
export default {
  //  components: {
  //  Popper
  //  },
  props: {
    card: {
      type: Object,
      default: () => ({})
    },
    showDate: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    employees () {
      return this.$store.state.employees.employees
    },
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    },
    // делаем картинки маленькими - ограничиваем по высоте и ширине
    coverSize () {
      if (this.card.cover_size_x > 0 && this.card.cover_size_y > 0) {
        const size = { x: this.card.cover_size_x, y: this.card.cover_size_y }
        const maxWidth = 220
        const maxHeight = 220
        const ratio = size.x / size.y
        if (size.x < size.y) {
          if (size.y > maxHeight) {
            size.y = maxHeight
            size.x = Math.ceil(size.y * ratio)
          }
        } else {
          if (size.x > maxWidth) {
            size.x = maxWidth
            size.y = Math.ceil(size.x / ratio)
          }
        }
        return size
      }
      return { x: 0, y: 0 }
    },
    coverHeight () {
      if (
        this.card.uid_cover_file !== '00000000-0000-0000-0000-000000000000' &&
        this.card.cover_size_x > 0 &&
        this.card.cover_size_y > 0
      ) {
        const minCoverHeight = 40
        return minCoverHeight < this.coverSize.y
          ? this.coverSize.y
          : minCoverHeight
      } else if (this.card.cover_color !== '#A998B6') {
        const colorHeight = 24
        return colorHeight
      }
      return 0
    },
    haveCover () {
      return this.coverHeight > 0
    },
    cost () {
      if (this.card.cost > 0) {
        const fractional = this.card.cost % 100
        const value = Math.floor(this.card.cost / 100)
        let valString = ''
        let valueString = value.toString()
        while (valueString) {
          valString = valueString.slice(-3) + ' ' + valString
          valueString = valueString.slice(0, -3)
        }
        valString = valString.trim()
        if (fractional > 0) {
          const frString = (fractional < 10 ? '0' : '') + fractional
          return `${valString}.${frString}`
        }
        return valString
      }
      return ''
    },
    date () {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      // добавляем Z в конец, чтобы он посчитал что это UTC время
      let dateMoveString = this.card.date_move
      if (dateMoveString[dateMoveString.length - 1] !== 'Z') {
        dateMoveString = dateMoveString + 'Z'
      }
      const dateMove = new Date(dateMoveString)
      const dateMoveTime = dateMove.toLocaleString('default', {
        hour: 'numeric',
        minute: 'numeric'
      })
      dateMove.setHours(0, 0, 0, 0)

      const oneDay = 1000 * 60 * 60 * 24
      const diffInTime = today.getTime() - dateMove.getTime()
      const diffInDays = Math.round(diffInTime / oneDay)

      if (diffInDays === 0) { // сегодня
        return dateMoveTime
      }
      if (diffInDays === 1) { // вчера
        return 'Вчера'
      }
      if (diffInDays > 1 && diffInDays < 8) { // на неделе
        const dateMoveWeekday = dateMove.toLocaleString('default', { weekday: 'short' })
        return dateMoveWeekday.slice(0, 1).toUpperCase() + dateMoveWeekday.slice(1)
      }
      const month = dateMove.toLocaleString('default', { month: 'short' }).slice(0, 3)
      const dayNum = dateMove.getDate()
      const day = (dayNum < 10 ? '0' : '') + dayNum
      if (today.getFullYear() !== dateMove.getFullYear()) {
        return `${day} ${month} ${dateMove.getFullYear()}`
      }
      return `${day} ${month}`
    }
  },
  methods: {
    print (val) {
      console.log(val)
    },
    selectCard (card) {
      this.$store.commit(SELECT_CARD, card)
      this.$store.commit('basic', { key: 'propertiesState', value: 'card' })
      this.$store.dispatch('asidePropertiesToggle', true)
    },
    getEmpNameByEmail (userEmail) {
      return this.employeesByEmail[userEmail.toLowerCase()]?.name ?? userEmail
    },
    showCardMenu (card, e) {
      console.log('showCardMenu', card, e)
    }
  }
}
</script>

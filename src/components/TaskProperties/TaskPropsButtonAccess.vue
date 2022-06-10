<template>
  <Popper
    class="popper-access light"
    arrow
    trigger="hover"
    placement="bottom"
    :disabled="!canEdit"
  >
    <template
      #content="{ close }"
      class="bottom"
    >
      <div class="popper">
        <div
          class="opacity-75 font-semibold title-popover-main btn-access-popover"
          @click="close"
        >
          <button
            class="btn-clear-popover"
            @click="onCancel"
          >
            Отменить
          </button>
          <button
            class="btn-save-popover"
            @click="onSave"
          >
            <span class="title-z-popover">Сохранить</span>
          </button>
        </div>
        <div>
          <div class="container-employee-popover">
            <div
              v-for="emp in employees"
              :key="emp.uid"
            >
              <div
                v-if="emp.uid !== currentUserUid"
                class="list-employee-access"
                @click="showSaveButtons = true"
              >
                <img
                  :src="emp.fotolink"
                  class="mr-1 border-fotolink border-solid border-2 border-sky-500"
                  width="30"
                  height="30"
                >
                <input
                  :id="emp.uid"
                  type="checkbox"
                  name="check_access_employee"
                  class="custom-checkbox"
                  :checked="isCheckedEmail(emp.email)"
                  @click="onCheckEmail(emp.email)"
                >
                <label
                  class="employee-name-custom"
                  :for="emp.uid"
                >
                  <div class="popover-employee-email">
                    <div style="color: black">{{ emp.name }}</div>
                    {{ emp.email }}
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div
      v-if="accessEmails.length > 0"
      style="position: relative"
    >
      <div v-if="accessEmails.length > 1">
        <div
          v-for="(userEmail, index) in accessEmails"
          :key="index"
          class="mt-3 tags-custom-access dark:bg-gray-800 dark:text-gray-100 project-hover-close"
          :class="{ 'cursor-pointer': canEdit, 'cursor-default': !canEdit }"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 91 92"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M73.9839 48.8864C73.9839 50.6954 72.5056 52.1754 70.6989 52.1754C68.8921 52.1754 67.4139 50.6954 67.4139 48.8864V44.4723C67.4139 40.8379 64.4738 37.8943 60.8439 37.8943H13.5399C9.90998 37.8943 6.9699 40.8379 6.9699 44.4723V78.7765C6.9699 82.4109 9.90998 85.3545 13.5399 85.3545H46.2096C48.026 85.3545 49.4986 86.827 49.4986 88.6435C49.4986 90.4599 48.026 91.9324 46.2096 91.9324H13.5399C6.29648 91.9324 0.399902 86.0287 0.399902 78.7765V44.4723C0.399902 37.2201 6.29648 31.3164 13.5399 31.3164H17.4819V19.7227C17.4819 9.06645 26.335 0.400002 37.1919 0.400002C48.0488 0.400002 56.9019 9.06645 56.9019 19.7227V31.3164H60.8439C68.0873 31.3164 73.9839 37.2201 73.9839 44.4723V48.8864ZM50.3319 31.3164H24.0519V19.7227C24.0519 12.7008 29.9485 6.97795 37.1919 6.97795C44.4353 6.97795 50.3319 12.7008 50.3319 19.7227V31.3164ZM39.6617 74.5013C39.2039 72.1608 37.9572 70.1461 36.2429 68.7334C35.9442 68.4873 35.8725 68.0521 36.0635 67.7155C38.5384 63.3546 35.4507 57.5131 30.3371 57.5369C25.2466 57.5131 22.1379 63.3545 24.6108 67.7154C24.8018 68.0521 24.7301 68.4873 24.4312 68.7331C22.713 70.1458 21.4486 72.1606 21.0126 74.5013L20.0665 79.3638C19.9824 79.796 20.3133 80.1975 20.7536 80.1975H39.9207C40.3609 80.1975 40.6919 79.796 40.6078 79.3638L39.6617 74.5013ZM28.1445 64.3525C28.1445 63.1087 29.1324 62.0889 30.3371 62.0889C33.2526 62.2133 33.2526 66.4917 30.3371 66.616C29.1324 66.616 28.1445 65.5962 28.1445 64.3525ZM26.0807 75.6703C25.6477 75.6703 25.3161 75.2764 25.4414 74.8619C26.9349 69.9202 33.7153 69.9202 35.2088 74.8619C35.334 75.2764 35.0024 75.6703 34.5695 75.6703H26.0807ZM64.4788 74.5013C64.021 72.1608 62.7743 70.1461 61.06 68.7334C60.7613 68.4873 60.6896 68.0521 60.8806 67.7155C63.3555 63.3546 60.2678 57.5131 55.1542 57.5369C50.0637 57.5131 46.955 63.3545 49.4279 67.7154C49.6189 68.0521 49.5472 68.4873 49.2483 68.7331C47.5301 70.1458 46.2657 72.1606 45.8297 74.5013L44.8836 79.3638C44.7995 79.796 45.1304 80.1975 45.5707 80.1975H64.7378C65.178 80.1975 65.509 79.796 65.4249 79.3638L64.4788 74.5013ZM52.9616 64.3525C52.9616 63.1087 53.9495 62.0889 55.1542 62.0889C58.0697 62.2133 58.0697 66.4917 55.1542 66.616C53.9495 66.616 52.9616 65.5962 52.9616 64.3525ZM50.8978 75.6703C50.4648 75.6703 50.1332 75.2764 50.2585 74.8619C51.752 69.9202 58.5324 69.9202 60.0259 74.8619C60.1511 75.2764 59.8195 75.6703 59.3866 75.6703H50.8978ZM85.8771 68.7334C87.5914 70.1461 88.8381 72.1608 89.2959 74.5013L90.242 79.3638C90.3261 79.796 89.9951 80.1975 89.5549 80.1975H70.3878C69.9475 80.1975 69.6166 79.796 69.7006 79.3638L70.6468 74.5013C71.0828 72.1606 72.3472 70.1458 74.0654 68.7331C74.3643 68.4873 74.4359 68.0521 74.245 67.7154C71.7721 63.3545 74.8808 57.5131 79.9713 57.5369C85.0849 57.5131 88.1726 63.3546 85.6977 67.7155C85.5067 68.0521 85.5784 68.4873 85.8771 68.7334ZM79.9713 62.0889C78.7666 62.0889 77.7787 63.1087 77.7787 64.3525C77.7787 65.5962 78.7666 66.616 79.9713 66.616C82.8868 66.4917 82.8868 62.2133 79.9713 62.0889ZM75.0756 74.8619C74.9503 75.2764 75.2819 75.6703 75.7149 75.6703H84.2037C84.6366 75.6703 84.9682 75.2764 84.843 74.8619C83.3495 69.9202 76.5691 69.9202 75.0756 74.8619Z"
              fill="black"
              fill-opacity="0.5"
            />
          </svg>
          <span class="rounded">{{ getEmpNameByEmail(userEmail) }}</span>
          <button
            v-if="userEmail === currentUserEmail"
            class="btn-close-popover"
            @click="removeAccess(userEmail)"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.17983 5.00341L9.76317 1.42841C9.92009 1.27149 10.0082 1.05866 10.0082 0.836743C10.0082 0.614825 9.92009 0.401996 9.76317 0.245076C9.60625 0.0881567 9.39342 0 9.1715 0C8.94958 0 8.73675 0.0881567 8.57983 0.245076L5.00483 3.82841L1.42983 0.245076C1.27291 0.0881567 1.06008 -1.65342e-09 0.838165 0C0.616247 1.65342e-09 0.403418 0.0881567 0.246499 0.245076C0.0895788 0.401996 0.00142217 0.614825 0.00142217 0.836743C0.00142217 1.05866 0.0895788 1.27149 0.246499 1.42841L3.82983 5.00341L0.246499 8.57841C0.168392 8.65588 0.106397 8.74805 0.0640893 8.8496C0.0217821 8.95115 0 9.06007 0 9.17008C0 9.28009 0.0217821 9.38901 0.0640893 9.49056C0.106397 9.59211 0.168392 9.68427 0.246499 9.76174C0.323968 9.83985 0.416135 9.90185 0.517685 9.94415C0.619234 9.98646 0.728156 10.0082 0.838165 10.0082C0.948175 10.0082 1.0571 9.98646 1.15865 9.94415C1.2602 9.90185 1.35236 9.83985 1.42983 9.76174L5.00483 6.17841L8.57983 9.76174C8.6573 9.83985 8.74947 9.90185 8.85102 9.94415C8.95257 9.98646 9.06149 10.0082 9.1715 10.0082C9.28151 10.0082 9.39043 9.98646 9.49198 9.94415C9.59353 9.90185 9.6857 9.83985 9.76317 9.76174C9.84127 9.68427 9.90327 9.59211 9.94558 9.49056C9.98788 9.38901 10.0097 9.28009 10.0097 9.17008C10.0097 9.06007 9.98788 8.95115 9.94558 8.8496C9.90327 8.74805 9.84127 8.65588 9.76317 8.57841L6.17983 5.00341Z" fill="#7E7E80"/>
            </svg>
          </button>
        </div>
      </div>
      <div v-else>
        <div
          class="mt-3 tags-custom-access dark:bg-gray-800 dark:text-gray-100 project-hover-close"
          :class="{ 'cursor-pointer': canEdit, 'cursor-default': !canEdit }"
        >
          <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1331 13.4091C14.4963 13.4091 14.7935 13.1115 14.7935 12.7478V8.8604C14.7935 7.4024 13.6081 6.21551 12.1518 6.21551H11.3593V3.88469C11.3593 1.74233 9.57946 0 7.39676 0C5.21405 0 3.43421 1.74233 3.43421 3.88469V6.21551H2.6417C1.18546 6.21551 0 7.4024 0 8.8604V14.757C0 16.215 1.18546 17.4019 2.6417 17.4019H10.2097C10.5749 17.4019 10.8709 17.1059 10.8709 16.7407C10.8709 16.3755 10.5749 16.0795 10.2097 16.0795H2.6417C1.91193 16.0795 1.32085 15.4877 1.32085 14.757V8.8604C1.32085 8.12975 1.91193 7.53796 2.6417 7.53796H12.1518C12.8816 7.53796 13.4727 8.12975 13.4727 8.8604V12.7478C13.4727 13.1115 13.7699 13.4091 14.1331 13.4091ZM4.75506 6.21551H10.0385V3.88469C10.0385 2.47298 8.853 1.32245 7.39676 1.32245C5.94052 1.32245 4.75506 2.47298 4.75506 3.88469V6.21551Z" fill="black" fill-opacity="0.5"/>
          </svg>
          <span class="rounded">{{ getEmpNameByEmail(accessEmails[0]) }}</span>
          <button
            v-if="accessEmails[0] === currentUserEmail"
            class="btn-close-popover"
            @click="removeAccess(accessEmails[0])"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.17983 5.00341L9.76317 1.42841C9.92009 1.27149 10.0082 1.05866 10.0082 0.836743C10.0082 0.614825 9.92009 0.401996 9.76317 0.245076C9.60625 0.0881567 9.39342 0 9.1715 0C8.94958 0 8.73675 0.0881567 8.57983 0.245076L5.00483 3.82841L1.42983 0.245076C1.27291 0.0881567 1.06008 -1.65342e-09 0.838165 0C0.616247 1.65342e-09 0.403418 0.0881567 0.246499 0.245076C0.0895788 0.401996 0.00142217 0.614825 0.00142217 0.836743C0.00142217 1.05866 0.0895788 1.27149 0.246499 1.42841L3.82983 5.00341L0.246499 8.57841C0.168392 8.65588 0.106397 8.74805 0.0640893 8.8496C0.0217821 8.95115 0 9.06007 0 9.17008C0 9.28009 0.0217821 9.38901 0.0640893 9.49056C0.106397 9.59211 0.168392 9.68427 0.246499 9.76174C0.323968 9.83985 0.416135 9.90185 0.517685 9.94415C0.619234 9.98646 0.728156 10.0082 0.838165 10.0082C0.948175 10.0082 1.0571 9.98646 1.15865 9.94415C1.2602 9.90185 1.35236 9.83985 1.42983 9.76174L5.00483 6.17841L8.57983 9.76174C8.6573 9.83985 8.74947 9.90185 8.85102 9.94415C8.95257 9.98646 9.06149 10.0082 9.1715 10.0082C9.28151 10.0082 9.39043 9.98646 9.49198 9.94415C9.59353 9.90185 9.6857 9.83985 9.76317 9.76174C9.84127 9.68427 9.90327 9.59211 9.94558 9.49056C9.98788 9.38901 10.0097 9.28009 10.0097 9.17008C10.0097 9.06007 9.98788 8.95115 9.94558 8.8496C9.90327 8.74805 9.84127 8.65588 9.76317 8.57841L6.17983 5.00341Z" fill="#7E7E80"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div
      v-else
      ref="btnRef"
      class="mt-3 tags-custom-access dark:bg-gray-800 dark:text-gray-100"
      :class="{ 'cursor-pointer': canEdit, 'cursor-default': !canEdit }"
    >
      <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1331 13.4091C14.4963 13.4091 14.7935 13.1115 14.7935 12.7478V8.8604C14.7935 7.4024 13.6081 6.21551 12.1518 6.21551H11.3593V3.88469C11.3593 1.74233 9.57946 0 7.39676 0C5.21405 0 3.43421 1.74233 3.43421 3.88469V6.21551H2.6417C1.18546 6.21551 0 7.4024 0 8.8604V14.757C0 16.215 1.18546 17.4019 2.6417 17.4019H10.2097C10.5749 17.4019 10.8709 17.1059 10.8709 16.7407C10.8709 16.3755 10.5749 16.0795 10.2097 16.0795H2.6417C1.91193 16.0795 1.32085 15.4877 1.32085 14.757V8.8604C1.32085 8.12975 1.91193 7.53796 2.6417 7.53796H12.1518C12.8816 7.53796 13.4727 8.12975 13.4727 8.8604V12.7478C13.4727 13.1115 13.7699 13.4091 14.1331 13.4091ZM4.75506 6.21551H10.0385V3.88469C10.0385 2.47298 8.853 1.32245 7.39676 1.32245C5.94052 1.32245 4.75506 2.47298 4.75506 3.88469V6.21551Z" fill="black" fill-opacity="0.5"/>
      </svg>

      <span class="rounded">Доступ</span>
    </div>
  </Popper>
</template>

<script>
import Popper from 'vue3-popper'

export default {
  components: {
    Popper
  },
  props: {
    currentUserUid: {
      type: String,
      default: ''
    },
    accessEmails: {
      type: Array,
      default: () => []
    },
    canEdit: Boolean
  },
  emits: ['changeAccess'],
  data: () => ({
    showSaveButtons: false,
    checkEmails: []
  }),
  computed: {
    employees () {
      return this.$store.state.employees.employees
    },
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    },
    currentUserEmail () {
      return this.employees[this.currentUserUid]?.email
    }
  },
  watch: {
    accessEmails: {
      immediate: true,
      handler: function (val) {
        this.checkEmails = [...val]
      }
    }
  },
  methods: {
    print (val) {
      console.log(val)
    },
    onCancel () {
      this.checkEmails = [...this.accessEmails]
    },
    onSave () {
      this.$emit('changeAccess', this.checkEmails)
    },
    getEmpNameByEmail (userEmail) {
      return this.employeesByEmail[userEmail.toLowerCase()]?.name ?? userEmail
    },
    removeAccess (userEmail) {
      this.onCheckEmail(userEmail)
      this.onSave()
    },
    isCheckedEmail (userEmail) {
      const index = this.checkEmails.findIndex(
        (email) => email.toLowerCase() === userEmail.toLowerCase()
      )
      return index !== -1
    },
    onCheckEmail (userEmail) {
      const index = this.checkEmails.findIndex(
        (email) => email.toLowerCase() === userEmail.toLowerCase()
      )
      if (index === -1) {
        this.checkEmails.push(userEmail)
      } else {
        this.checkEmails.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
.popper-access .popper {
  top: 5% !important;
}
.bottom {
  position: absolute;
  top: 40%;
  left: 45%;
}
.title-popover-main {
  background-color: white;
  display: table;
  /* width: 100%; */
  opacity: 1;
  line-height: 14px;
  position: relative;
  height: 34px;
  margin: 0 auto;
}
.btn-access-popover {
  display: table;
}
.btn-clear-popover {
  width: 90px;
  height: 25px;
  font-size: 11px;
  color: gray;
  float: left;
  margin-right: 5px;
  border-radius: 7px;
  border: 1px solid gray;
}
.btn-save-popover {
  width: 90px;
  height: 25px;
  color: gray;
  border-radius: 7px;
  margin: 0 auto;
  display: table;
  font-size: 11px;
  border: 1px solid gray;
}
.title-z-popover {
  margin-top: 7px;
  cursor: pointer;
}
.container-employee-popover {
  height: 220px;
  overflow-y: auto;
  /* margin-top: 10px; */
  min-width: 220px;
}
.container-employee-popover::-webkit-scrollbar {
  width: 0px;
}
.container-employee-popover::-webkit-scrollbar-track {
  background-color: #e4e4e4;
  border-radius: 100px;
}
.container-employee-popover::-webkit-scrollbar-thumb {
  background-color: #d4aa70;
  border-radius: 100px;
}
.list-employee-access {
  display: flex;
  margin-bottom: 2px;
  margin-right: 5px;
  font-size: 12px;
}
.list-employee-access:hover {
  cursor: pointer;
}
.list-employee-access input[type='checkbox'],
.list-employee-access input[type='radio'] {
  margin-right: 10px;
  margin-top: 13px;
}
.list-employee-access img {
  height: 30px;
  border-radius: 5px;
  margin-right: 10px;
  margin-top: 5px;
}
.border-fotolink {
  border-radius: 25%;
  border: none;
}
.custom-checkbox {
  position: absolute;
  z-index: -1;
  opacity: 0;
}
.custom-checkbox + label {
  display: inline-flex;
  align-items: center;
  position: relative;
  user-select: none;
}
.custom-checkbox + label::after {
  content: '';
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  flex-shrink: 0;
  flex-grow: 0;
  position: absolute;
  right: 0;
  border-radius: 0.25em;
  margin-right: 0.5em;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 55% 100%;
}
/* стили при наведении курсора на checkbox */
.custom-checkbox:not(:disabled):not(:checked) + label:hover::after {
  border-color: #b3d7ff;
}
/* стили для активного состояния чекбокса (при нажатии на него) */
.custom-checkbox:not(:disabled):active + label::after {
  border-color: #b3d7ff;
}
/* стили для чекбокса, находящегося в фокусе */
.custom-checkbox:focus + label::after {
}
/* стили для чекбокса, находящегося в фокусе и не находящегося в состоянии checked */
.custom-checkbox:focus:not(:checked) + label::after {
}
.custom-checkbox:checked + label::after {
  background-image: url("data:image/svg+xml,%3csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 20'%3e%3cpath fill='%23000' d='M24.4107 1.30299C25.2766 2.02718 25.3681 3.2892 24.6148 4.1218L11.8142 18.2718C10.8103 19.3815 9.06094 19.4991 7.9062 18.5344L0.902667 12.6839C0.0362917 11.9601 -0.0558157 10.6982 0.69694 9.86518C1.44969 9.0322 2.76226 8.94364 3.62864 9.66738L9.58691 14.6447L21.4789 1.49931C22.2321 0.666707 23.5447 0.578813 24.4107 1.30299z'/%3e%3c/svg%3e");
}
/* стили для чекбокса, находящегося в состоянии disabled */
.custom-checkbox:disabled + label::after {
  background-color: #e9ecef;
}
.employee-name-custom {
  cursor: pointer;
  width: 100%;
}
.popover-employee-email {
  position: relative;
  top: -2px;
  color: #7d7d91;
  width: 100%;
  font-size: 12px;
  line-height: 18px;
  margin-bottom: 0px;
}
.tags-custom-access {
  padding: 4px 6px 4px 4px;
  border-radius: 5px;
  margin: 2px 2px 2px 2px;
  font-size: 12px;
  float: left;
  position: relative;
  display: flex;
  background: #f4f5f7;
}
.tags-custom-access svg {
  position: relative;
  top: 3px;
  float: left;
  display: flex;
  font-size: 18px;
  width: 17px;
  height: 17px;
  margin-right: 5px;
  color: #9e9e9e;
}
.btn-close-popover
{
  margin-right: 5px;
  margin-left: 5px;
  font-size: 11px;
  display: none;
  position: absolute;
  left: -2px;
  width: 16px;
  height: 20px;
  top: 5px;
  color: #3F3F4O;
  -webkit-transition: all 0.2s ease-in;
  -moz-transition: all 0.2s ease-in;
  -o-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
  background: #F4F5F7;
  animation-delay: -2s;
  opacity: 0;
  z-index: 9999;
  animation: ani 2.5s forwards;
}
.btn-close-popover svg
{
  width: 15px;
  height: 15px;
  left: 0;
  top: 0;
  padding: 2px;
}
</style>

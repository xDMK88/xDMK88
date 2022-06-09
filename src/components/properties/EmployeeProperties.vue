<template>
  <div>
    <ModalBoxDelete
      v-show="showConfirm"
      title="Удалить сотрудника"
      :text="`Вы действительно хотите удалить сотрудника ${selectedEmployeeName}?`"
      @cancel="showConfirm = false"
      @yes="removeEmployee"
    />
    <div class="flex justify-end">
      <div
        class="cursor-pointer"
        @click="closeProperties"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.1798 10.0034L14.7632 6.42841C14.9201 6.27149 15.0082 6.05866 15.0082 5.83674C15.0082 5.61483 14.9201 5.402 14.7632 5.24508C14.6062 5.08816 14.3934 5 14.1715 5C13.9496 5 13.7368 5.08816 13.5798 5.24508L10.0048 8.82841L6.42983 5.24508C6.27291 5.08816 6.06008 5 5.83817 5C5.61625 5 5.40342 5.08816 5.2465 5.24508C5.08958 5.402 5.00142 5.61483 5.00142 5.83674C5.00142 6.05866 5.08958 6.27149 5.2465 6.42841L8.82983 10.0034L5.2465 13.5784C5.16839 13.6559 5.1064 13.748 5.06409 13.8496C5.02178 13.9511 5 14.0601 5 14.1701C5 14.2801 5.02178 14.389 5.06409 14.4906C5.1064 14.5921 5.16839 14.6843 5.2465 14.7617C5.32397 14.8399 5.41614 14.9018 5.51768 14.9442C5.61923 14.9865 5.72816 15.0082 5.83817 15.0082C5.94818 15.0082 6.0571 14.9865 6.15865 14.9442C6.2602 14.9018 6.35236 14.8399 6.42983 14.7617L10.0048 11.1784L13.5798 14.7617C13.6573 14.8399 13.7495 14.9018 13.851 14.9442C13.9526 14.9865 14.0615 15.0082 14.1715 15.0082C14.2815 15.0082 14.3904 14.9865 14.492 14.9442C14.5935 14.9018 14.6857 14.8399 14.7632 14.7617C14.8413 14.6843 14.9033 14.5921 14.9456 14.4906C14.9879 14.389 15.0097 14.2801 15.0097 14.1701C15.0097 14.0601 14.9879 13.9511 14.9456 13.8496C14.9033 13.748 14.8413 13.6559 14.7632 13.5784L11.1798 10.0034Z"
            fill="#7E7E80"
          />
        </svg>
      </div>
    </div>
    <div class="flex">
      <div
        v-if="empFoto"
        class="flex-none w-[93px] h-[93px] bg-cover bg-center bg-origin-content bg-clip-content rounded-[8px] border border-black/10"
        :style="{
          'background-image': `url(${empFoto})`
        }"
      />
      <div class="grow overflow-hidden ml-[20px]">
        <input
          v-model="currEmpName"
          type="text"
          placeholder="Имя сотрудника"
          class="p-0 font-roboto font-bold font-[18px] leading-[21px] text-[#424242] w-full border-none focus:ring-0 focus:outline-none"
          @blur="changeEmpName"
        >
        <div
          class="mt-[15px] font-roboto font-[16px] leading-[19px] font-medium text-[#4c4c4d]"
        >
          Email
        </div>
        <div
          class="mt-[10px] w-full font-roboto font-[14px] leading-[20px] text-[#606061] overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {{ selectedEmployee.email }}
        </div>
      </div>
    </div>
    <div class="mt-[20px] flex gap-[4px]">
      <PopMenu
        class="grow"
        :disabled="!isCanChangeDepartments"
      >
        <div
          class="group grow flex items-center gap-[4px] pl-[5px] pr-[9px] h-[30px] bg-[#f4f5f7] rounded-[6px] font-roboto text-[#575758] text-[12px] font-medium"
          :class="{'cursor-pointer': isCanChangeDepartments}"
        >
          <svg
            :class="{'group-hover:hidden': selectedEmployeeDep && isCanChangeDepartments}"
            width="20"
            height="20"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.9998 6.54762C14.5894 6.54762 14.1957 6.71067 13.9055 7.00091C13.6153 7.29114 13.4522 7.68478 13.4522 8.09524C13.4522 8.50569 13.6153 8.89933 13.9055 9.18957C14.1957 9.4798 14.5894 9.64286 14.9998 9.64286C15.4103 9.64286 15.8039 9.4798 16.0942 9.18957C16.3844 8.89933 16.5475 8.50569 16.5475 8.09524C16.5475 7.68478 16.3844 7.29114 16.0942 7.00091C15.8039 6.71067 15.4103 6.54762 14.9998 6.54762ZM11.9046 8.09524C11.9046 7.27433 12.2307 6.48704 12.8112 5.90657C13.3916 5.3261 14.1789 5 14.9998 5C15.8207 5 16.608 5.3261 17.1885 5.90657C17.769 6.48704 18.0951 7.27433 18.0951 8.09524C18.0951 8.91615 17.769 9.70343 17.1885 10.2839C16.608 10.8644 15.8207 11.1905 14.9998 11.1905C14.1789 11.1905 13.3916 10.8644 12.8112 10.2839C12.2307 9.70343 11.9046 8.91615 11.9046 8.09524ZM22.351 7.32143C22.0432 7.32143 21.748 7.44372 21.5303 7.66139C21.3126 7.87907 21.1903 8.1743 21.1903 8.48214C21.1903 8.78998 21.3126 9.08522 21.5303 9.30289C21.748 9.52057 22.0432 9.64286 22.351 9.64286C22.6589 9.64286 22.9541 9.52057 23.1718 9.30289C23.3895 9.08522 23.5117 8.78998 23.5117 8.48214C23.5117 8.1743 23.3895 7.87907 23.1718 7.66139C22.9541 7.44372 22.6589 7.32143 22.351 7.32143ZM19.6427 8.48214C19.6427 8.12648 19.7127 7.7743 19.8489 7.44571C19.985 7.11712 20.1845 6.81855 20.4359 6.56706C20.6874 6.31557 20.986 6.11608 21.3146 5.97997C21.6432 5.84386 21.9954 5.77381 22.351 5.77381C22.7067 5.77381 23.0589 5.84386 23.3875 5.97997C23.7161 6.11608 24.0146 6.31557 24.2661 6.56706C24.5176 6.81855 24.7171 7.11712 24.8532 7.44571C24.9893 7.7743 25.0594 8.12648 25.0594 8.48214C25.0594 9.20044 24.774 9.88931 24.2661 10.3972C23.7582 10.9051 23.0693 11.1905 22.351 11.1905C21.6327 11.1905 20.9439 10.9051 20.4359 10.3972C19.928 9.88931 19.6427 9.20044 19.6427 8.48214ZM6.48793 8.48214C6.48793 8.1743 6.61022 7.87907 6.8279 7.66139C7.04557 7.44372 7.34081 7.32143 7.64865 7.32143C7.95649 7.32143 8.25172 7.44372 8.4694 7.66139C8.68707 7.87907 8.80936 8.1743 8.80936 8.48214C8.80936 8.78998 8.68707 9.08522 8.4694 9.30289C8.25172 9.52057 7.95649 9.64286 7.64865 9.64286C7.34081 9.64286 7.04557 9.52057 6.8279 9.30289C6.61022 9.08522 6.48793 8.78998 6.48793 8.48214ZM7.64865 5.77381C6.93035 5.77381 6.24148 6.05915 5.73357 6.56706C5.22566 7.07497 4.94031 7.76385 4.94031 8.48214C4.94031 9.20044 5.22566 9.88931 5.73357 10.3972C6.24148 10.9051 6.93035 11.1905 7.64865 11.1905C8.36694 11.1905 9.05582 10.9051 9.56373 10.3972C10.0716 9.88931 10.357 9.20044 10.357 8.48214C10.357 7.76385 10.0716 7.07497 9.56373 6.56706C9.05582 6.05915 8.36694 5.77381 7.64865 5.77381ZM9.31311 21.6408C8.96314 21.8714 8.55724 22.0031 8.1385 22.0217C7.71975 22.0402 7.30379 21.9451 6.93475 21.7463C6.56572 21.5476 6.25738 21.2526 6.04247 20.8927C5.82756 20.5329 5.7141 20.1215 5.71412 19.7024V14.6726C5.71412 14.57 5.75489 14.4716 5.82745 14.399C5.9 14.3265 5.99841 14.2857 6.10103 14.2857H9.22025C9.29083 13.7191 9.51748 13.1833 9.8749 12.7381H6.10103C5.58796 12.7381 5.09591 12.9419 4.73311 13.3047C4.37032 13.6675 4.1665 14.1596 4.1665 14.6726V19.7024C4.1663 20.3687 4.33818 21.0237 4.66549 21.6041C4.99279 22.1845 5.46443 22.6705 6.03472 23.0151C6.60501 23.3596 7.25461 23.5511 7.92062 23.5709C8.58663 23.5907 9.24646 23.4381 9.83621 23.128C9.59452 22.6586 9.41851 22.1582 9.31311 21.6408ZM20.1635 23.128C20.7532 23.4381 21.413 23.5907 22.0791 23.5709C22.7451 23.5511 23.3947 23.3596 23.965 23.0151C24.5352 22.6705 25.0069 22.1845 25.3342 21.6041C25.6615 21.0237 25.8334 20.3687 25.8332 19.7024V14.6726C25.8332 14.1596 25.6294 13.6675 25.2666 13.3047C24.9038 12.9419 24.4117 12.7381 23.8986 12.7381H20.1248C20.4819 13.1835 20.7085 13.7192 20.7794 14.2857H23.8986C24.0013 14.2857 24.0997 14.3265 24.1722 14.399C24.2448 14.4716 24.2856 14.57 24.2856 14.6726V19.7024C24.2856 20.1215 24.1721 20.5329 23.9572 20.8927C23.7423 21.2526 23.434 21.5476 23.0649 21.7463C22.6959 21.9451 22.2799 22.0402 21.8612 22.0217C21.4424 22.0031 21.0365 21.8714 20.6866 21.6408C20.5812 22.1581 20.4051 22.6586 20.1635 23.128ZM12.2915 12.7381C11.7784 12.7381 11.2864 12.9419 10.9236 13.3047C10.5608 13.6675 10.357 14.1596 10.357 14.6726V20.4762C10.357 21.7076 10.8461 22.8885 11.7168 23.7592C12.5875 24.6299 13.7685 25.119 14.9998 25.119C16.2312 25.119 17.4121 24.6299 18.2828 23.7592C19.1535 22.8885 19.6427 21.7076 19.6427 20.4762V14.6726C19.6427 14.1596 19.4389 13.6675 19.0761 13.3047C18.7133 12.9419 18.2212 12.7381 17.7082 12.7381H12.2915ZM11.9046 14.6726C11.9046 14.57 11.9454 14.4716 12.0179 14.399C12.0905 14.3265 12.1889 14.2857 12.2915 14.2857H17.7082C17.8108 14.2857 17.9092 14.3265 17.9818 14.399C18.0543 14.4716 18.0951 14.57 18.0951 14.6726V20.4762C18.0951 21.2971 17.769 22.0844 17.1885 22.6649C16.608 23.2453 15.8207 23.5714 14.9998 23.5714C14.1789 23.5714 13.3916 23.2453 12.8112 22.6649C12.2307 22.0844 11.9046 21.2971 11.9046 20.4762V14.6726Z"
              fill="#606061"
            />
          </svg>
          <svg
            v-if="selectedEmployeeDep && isCanChangeDepartments"
            class="hidden"
            :class="{'group-hover:block': selectedEmployeeDep && isCanChangeDepartments}"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            @click.stop="setDepartment(0)"
          >
            <path
              d="M11.1798 10.0034L14.7632 6.42841C14.9201 6.27149 15.0082 6.05866 15.0082 5.83674C15.0082 5.61483 14.9201 5.402 14.7632 5.24508C14.6062 5.08816 14.3934 5 14.1715 5C13.9496 5 13.7368 5.08816 13.5798 5.24508L10.0048 8.82841L6.42983 5.24508C6.27291 5.08816 6.06008 5 5.83817 5C5.61625 5 5.40342 5.08816 5.2465 5.24508C5.08958 5.402 5.00142 5.61483 5.00142 5.83674C5.00142 6.05866 5.08958 6.27149 5.2465 6.42841L8.82983 10.0034L5.2465 13.5784C5.16839 13.6559 5.1064 13.748 5.06409 13.8496C5.02178 13.9511 5 14.0601 5 14.1701C5 14.2801 5.02178 14.389 5.06409 14.4906C5.1064 14.5921 5.16839 14.6843 5.2465 14.7617C5.32397 14.8399 5.41614 14.9018 5.51768 14.9442C5.61923 14.9865 5.72816 15.0082 5.83817 15.0082C5.94818 15.0082 6.0571 14.9865 6.15865 14.9442C6.2602 14.9018 6.35236 14.8399 6.42983 14.7617L10.0048 11.1784L13.5798 14.7617C13.6573 14.8399 13.7495 14.9018 13.851 14.9442C13.9526 14.9865 14.0615 15.0082 14.1715 15.0082C14.2815 15.0082 14.3904 14.9865 14.492 14.9442C14.5935 14.9018 14.6857 14.8399 14.7632 14.7617C14.8413 14.6843 14.9033 14.5921 14.9456 14.4906C14.9879 14.389 15.0097 14.2801 15.0097 14.1701C15.0097 14.0601 14.9879 13.9511 14.9456 13.8496C14.9033 13.748 14.8413 13.6559 14.7632 13.5784L11.1798 10.0034Z"
              fill="#7E7E80"
            />
          </svg>
          {{ selectedEmployeeDep || 'Вне отдела' }}
        </div>
        <template #menu>
          <PopMenuItem
            v-for="(dep, index) in allDepartments"
            :key="index"
            @click="setDepartment(index)"
          >
            {{ dep.name }}
          </PopMenuItem>
        </template>
      </PopMenu>
      <PopMenu v-if="isCanDeleteEmp">
        <div class="flex-none flex items-center justify-center h-[30px] w-[30px] bg-[#F4F5F7] rounded-[6px] cursor-pointer">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 14C11.1046 14 12 14.8954 12 16C12 17.1046 11.1046 18 10 18C8.89543 18 8 17.1046 8 16C8 14.8954 8.89543 14 10 14Z"
              fill="#7F7F80"
            />
            <path
              d="M10 8C11.1046 8 12 8.89543 12 10C12 11.1046 11.1046 12 10 12C8.89543 12 8 11.1046 8 10C8 8.89543 8.89543 8 10 8Z"
              fill="#7F7F80"
            />
            <path
              d="M10 2C11.1046 2 12 2.89543 12 4C12 5.10457 11.1046 6 10 6C8.89543 6 8 5.10457 8 4C8 2.89543 8.89543 2 10 2Z"
              fill="#7F7F80"
            />
          </svg>
        </div>
        <template #menu>
          <PopMenuItem
            icon="delete"
            @click="showConfirm = true"
          >
            Удалить
          </PopMenuItem>
        </template>
      </PopMenu>
    </div>
  </div>
</template>

<script>
import * as EMPLOYEE from '@/store/actions/employees'
import { NAVIGATOR_REMOVE_EMPLOYEE } from '@/store/actions/navigator'
import ModalBoxDelete from '@/components/Common/ModalBoxDelete.vue'
import PopMenu from '@/components/modals/PopMenu.vue'
import PopMenuItem from '@/components/modals/PopMenuItem.vue'

export default {
  components: {
    ModalBoxDelete,
    PopMenu,
    PopMenuItem
  },
  data () {
    return {
      showConfirm: false,
      currEmpName: ''
    }
  },
  computed: {
    selectedEmployee () {
      return this.$store.state.employees.selectedEmployee
    },
    selectedEmployeeName () {
      return this.selectedEmployee?.name || ''
    },
    selectedEmployeeDep () {
      const dep = this.$store.state.departments.deps[this.selectedEmployee?.uid_dep]
      return dep?.name || ''
    },
    empFoto () {
      const fotolink = this.selectedEmployee?.fotolink
      if (!fotolink) return undefined
      if (fotolink.endsWith('&size=b')) {
        const foto = fotolink.slice(0, -('&size=b'.length))
        return foto + '&size=l'
      }
      return fotolink
    },
    isSelectedEmployeeCurrentUser () {
      const user = this.$store.state.user.user
      return user.current_user_uid === this.selectedEmployee.uid
    },
    isCanChangeDepartments () {
      const employees = this.$store.state.employees.employees
      const user = this.$store.state.user.user
      const userType = employees[user.current_user_uid].type
      return userType === 1
    },
    isCanDeleteEmp () {
      const employees = this.$store.state.employees.employees
      const user = this.$store.state.user.user
      const userType = employees[user.current_user_uid].type
      const userAdmin = userType === 1 || userType === 2
      // текущий пользователь админ
      // тот которого удаляем не суперадмин
      // тот которого удаляем не текущий пользователь
      return userAdmin && this.selectedEmployee.type !== 1 && !this.isSelectedEmployeeCurrentUser
    },
    allDepartments () {
      const deps = Object.values(this.$store.state.departments.deps)
      deps.sort((item1, item2) => {
        // сначала по порядку
        if (item1.order > item2.order) return 1
        if (item1.order < item2.order) return -1
        // если одинаковый, то по имени
        if (item1.name > item2.name) return 1
        if (item1.name < item2.name) return -1
        return 0
      })
      deps.unshift({
        uid: '00000000-0000-0000-0000-000000000000',
        name: 'Вне отдела'
      })
      return deps
    }
  },
  watch: {
    selectedEmployeeName: {
      immediate: true,
      handler: function (val) {
        this.currEmpName = val
      }
    }
  },
  methods: {
    print (msg, param) {
      console.log(msg, param)
    },
    removeEmployee () {
      this.showConfirm = false
      this.$store.dispatch(EMPLOYEE.REMOVE_EMPLOYEE_REQUEST, this.selectedEmployee)
        .then(() => {
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.commit(NAVIGATOR_REMOVE_EMPLOYEE, this.selectedEmployee)
        })
    },
    closeProperties () {
      this.$store.dispatch('asidePropertiesToggle', false)
    },
    changeEmpName () {
      const title = this.currEmpName.trim()
      if (title && this.selectedEmployee.name !== title) {
        this.$store.dispatch(EMPLOYEE.CHANGE_EMPLOYEE_NAME, {
          email: this.selectedEmployee.email,
          name: title
        })
          .then((resp) => {
            console.log('changeEmpName', resp)
          })
      }
    },
    setDepartment (index) {
      const dep = this.allDepartments[index]
      if (this.selectedEmployee?.uid_dep !== dep.uid) {
        const data = {
          uidDepartmentOld: this.selectedEmployee.uid_dep,
          uidDepartmentNew: dep.uid,
          uidEmp: this.selectedEmployee.uid,
          emailEmp: this.selectedEmployee.email,
          depOld: this.$store.state.departments.deps[this.selectedEmployee.uid_dep],
          depNew: this.$store.state.departments.deps[dep.uid]
        }
        this.$store.dispatch(EMPLOYEE.CHANGE_EMPLOYEE_DEP, data)
          .then((resp) => {
            console.log('setDepartment', resp, data)
          })
      }
    }
  }
}
</script>

<style scoped>
</style>

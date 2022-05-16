import store from '@/store/index.js'

function dateToLabelFormat (calendarDate) {
  const day = calendarDate.getDate()
  const month = calendarDate.toLocaleString('default', { month: 'short' })
  return day + ' ' + month
}

function pad2 (n) {
  return (n < 10 ? '0' : '') + n
}

function dateToTimeFormat (date) {
  const hours = pad2(date.getHours())
  const seconds = pad2(date.getSeconds())
  return hours + ':' + seconds
}

export function getInspectorMessage (type, task) {
  if (!task) {
    return 'Я не могу понять, что это за задача, такого не должно быть'
  }
  switch (type) {
    case 1: return 'Вы согласны со сроком? Все будет готово до ' + dateToLabelFormat(new Date(task.customer_date_end)) + '? И до ' + dateToTimeFormat(new Date(task.customer_date_end)) + ' завершите задачу?'
    case 2: return 'Вы не ответили после того как получили задачу от ' + store?.state?.employees?.employees[task.uid_customer]?.name + '. Пожалуйста напишите вопросы если есть, или нажмите:'
    case 3: return 'Вы просрочили задачу - напишите причину почему задача еще не выполнена и когда ожидать выполнения? А лучше свяжитесь с заказачиком и обсудите эту ситуацию'
    case 4: return 'Как у вас дела? Пожалуйста, приложите результат!'
  }
}

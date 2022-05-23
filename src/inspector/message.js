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
    case 4: return store?.state?.employees?.employees[task.uid_performer]?.name + ', как идут дела? Пожалуйста, приложите промежуточные результаты.'
    case 5: return 'Я позвонил исполнителю на номер ' + store?.state?.employees?.employees[task.uid_performer]?.phone.split(' ')[0] + '.'
    case 6: return 'Я отправил смс исполнителю на номер ' + store?.state?.employees?.employees[task.uid_performer]?.phone.split(' ')[0] + '.'
    case 7: return 'Вы завершили задачу в срок получаете 15 баллов на ваш бонусный счет.'
    case 8: return 'Вы просрочили задачу и ничего не написали даже после дедлайна, пожалуйста позвоните руководителю и обьясните причину. С вас снимается 15 баллов за такое грубое нарушение.'
    case 9: return 'Я уже хотел связаться с ' + store?.state?.employees?.employees[task.uid_perfomer]?.name + ', но в базе нет номера телефона исполнителя. Пожалуйста, добавьте номер телефона исполнителю.'
  }
}

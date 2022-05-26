[![.github/workflows/action-build.yml](https://github.com/LeaderTask/Web/actions/workflows/action-build.yml/badge.svg?branch=projects-and-emps&event=push)](https://github.com/LeaderTask/Web/actions/workflows/action-build.yml)
# [Leadertask Web v2.0](https://app.leadertask.ru)

[![Leadertask Web v2.0](images/leadertask_web2.png)](https://app.leadertask.ru)

**Leadertask Web 2.0** next version of existing leadertask web.

### Installation

1. Clone the repo (Vue3 project)
   ```sh
      git clone https://github.com/LeaderTask/Web.git
    ```
2. Install NPM packages
    ```sh
        npm install
    ```
3. Run the development server 
    ```sh
        npm run serve 
    ```
### Folders 
    ```sh
      Web/src:

      App.vue         // Main component
      assets
      colors.js       // tailwind theme colors 
      components      
      config.js       // config
      css
      main.js         // init App main component and define auth headers
      menu.js         
      router          // routes
      store           // vuex store
      views           // main views assembled from components

    ```
### API Documentation 
[https://web.leadertask.com/docs/ver1](https://web.leadertask.com/docs/ver1)

## Правила написания кода

1. Вёрстку делаем на Tailwind - не используем CSS по максимуму
2. Если используем CSS то делаем это в `<style scoped>` и обосновано (например CSS для динамических значений, потому что в Tailwind это не сделать или если нам одни и теже классы повторять много раз делаем CSS класс а внутри @apply из классов Tailwind)
3. Для компонентов Vue используем стандартную модель (обычно api а не script=setup): template script style - именно в таком порядке
4. Перед тем как что-то запушить в Git делаем fetch и скачиваем изменения, для того чтобы уменьшить количество мерджей
5. Делаем коммиты как можно чаще, сделал - залил, а не скопом за весь день - когда сделали коммит сообщаем чтобы все его запулили сразу
6. Не коммитим функции на будущее, не должно быть недоделок, мертвый код удаляем - чтобы коллеги не путались
7. Не коммитим диагностические функции - не засираем консоль, если считаете что в консоли должно что-то появляться постоянно, то объясните коллегам зачем (согласуйте)
8. Если что-то пишите - пользуйтесь lint-fix и prettier, чтобы ваш код был в едином стиле, хорошо отформатирован и не содержал ошибок
9. В `template` не должно быть никаких расчетов и никакой многострочной логики, всё это делать внутри `script` в computed, data или methods, а здесь только из вызов или отображение

'use strict';

class Tasks {
   constructor({ wrapper, tasksContent, comletedTasks, allTasks, }) {
      this.wrapper = document.querySelector(wrapper);
      this.tasksContent = this.wrapper.querySelector(tasksContent);
      this.comletedTasks = this.wrapper.querySelector(comletedTasks);
      this.allTasks = document.getElementsByName(allTasks);
      this.object = null;
   }

   localStorage() {
      let tasks = [];
      this.allTasks.forEach((v) => {
         tasks.push({
            text: v.children[1].children[0].value,
            status: v.matches('.completed')
         });
      });
      localStorage.setItem('task', JSON.stringify(tasks));
      console.dir(tasks);
   }

   loadStorage() {
      document.addEventListener('DOMContentLoaded', () => {
         this.object = localStorage.getItem('task');
         this.object = JSON.parse(this.object);

         if (this.object != null) {
            this.allTasks = Array.prototype.slice.call(this.allTasks);

            for (let i = 1; i < this.object.length; i++) {
               this.allTasks.push(this.allTasks[0].cloneNode(true));
            }

            for (let i = 0; i < this.object.length; i++) {
               this.allTasks[i].children[1].children[0].setAttribute('value', this.object[i].text);
               if (this.object[i].status) {
                  this.addClass(this.allTasks[i], 'completed');
                  this.transferElement(this.allTasks[i]);
                  this.addClass(this.allTasks[i].children[0], 'fa-circle-check');
                  this.removeClass(this.allTasks[i].children[2], 'fa-circle-plus');
                  this.addClass(this.allTasks[i].children[2], 'fa-circle-minus');
               } else {
                  this.allTasks[0].parentElement.append(this.allTasks[i]);
               }
            }
         }
      });
   }

   addTask() {
      this.wrapper.addEventListener('click', (even) => {
         let target = even.target;
         if (target.matches('.tasks__content__add')) {
            if (target.parentElement.matches('.completed')) {
               this.removeElement(target.parentElement);
            } else {
               let copy = target.parentElement.cloneNode(true);
               copy.children[1].lastElementChild.value = ''
               target.parentElement.parentElement.append(copy);
            }
            this.localStorage();
         }
      });
   }

   transferTasks() {
      this.wrapper.addEventListener('click', (even) => {
         let target = even.target;
         if (target.matches('.tasks__content__finish')) {
            if (target.nextElementSibling.children[0].value && target.parentNode.parentNode.childElementCount >= 2) {
               this.addReadonly(target.nextElementSibling.children[0]);
               this.addClass(target.parentElement, 'completed');
               this.addClass(target, 'fa-circle-check');
               this.removeClass(target.nextElementSibling.nextElementSibling, 'fa-circle-plus');
               this.addClass(target.nextElementSibling.nextElementSibling, 'fa-circle-minus');
               this.transferElement(target.parentElement);

               this.localStorage();
            }
         }
      });
   }

   removeClass(elem, className) {
      elem.classList.remove(className);
   }

   removeElement(elem) {
      elem.remove();
   }

   transferElement(elem) {
      this.comletedTasks.insertAdjacentElement('afterBegin', elem);
   }

   addReadonly(elem) {
      elem.setAttribute('readonly', 'readonly');
   }

   addClass(elem, className) {
      elem.classList.add(className);
   }

   init() {
      console.dir(this);
      this.loadStorage();
      this.addTask();
      this.transferTasks();
   }
}

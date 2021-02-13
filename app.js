// * import
import { initDragDrop } from "./drag&drop.js";

// * selectors
const todoForm = document.querySelector("form");
const todoFilter = document.querySelectorAll(".todo-filter");
const todoFilterBtns = document.querySelectorAll(".todo-filter li");
const todoList = document.querySelector(".todo-list");
const itemsLeft = document.querySelectorAll(".items-left");
const clearBtn = document.querySelector(".clear");
const themeToggleBtn = document.querySelector(".theme-toggle-btn");
const backgroundDesktop = document.querySelector(".background.desktop");
const backgroundMobile = document.querySelector(".background.mobile");

// * items counter
let numberItems = 0;

// * event listeners
document.addEventListener("DOMContentLoaded", getTodos);
window.addEventListener("load", initDragDrop);
todoForm.addEventListener("submit", addTodo);
todoList.addEventListener("click", checkDeleteTodo);
todoFilter.forEach(element => element.addEventListener("click", filterTodo));
clearBtn.addEventListener("click", clearComplete);
themeToggleBtn.addEventListener("click", themeToggle);

// * functions
function addTodo(e) {
  e.preventDefault();
  // check if input is not empty
  let input = e.target.children[1];
  if (input.value !== "") {
    // create todo
    const todo = document.createElement("li");
    todo.className = "todo draggable";
    todo.setAttribute("draggable", true);
    // add checkbox
    const checkbox = document.createElement("div");
    checkbox.classList.add("round");
    todo.append(checkbox);
    // add value
    const todoText = document.createElement("p");
    todoText.innerText = input.value;
    todo.append(todoText);
    // add cross
    const cross = document.createElement("img");
    cross.src = "img/icon-cross.svg";
    cross.classList.add("cross");
    todo.append(cross);
    // add to list
    todoList.append(todo);
    // call the save function to save new data
    saveLocalTodo(input.value);
    // update items left counter
    numberItems += 1;
    updateItemsLeft();
    // clear form  input
    input.value = "";
  } else {
    alert("Your todo can't be empty");
  }
}

function checkDeleteTodo(e) {
  const item = e.target;
  console.log(item);
  const todo = item.parentElement;
  let todos = checkLocalStorage();
  if (item.classList.contains("cross")) {
    removeLocalTodo(todo);
    todo.remove();
    if (!todo.classList.contains("completed")) numberItems -= 1;
  } else if (todo.classList.contains("todo")) {
    if (todo.classList.contains("completed")) {
      todo.classList.remove("completed");
      numberItems += 1;
      todos.forEach(localTodo => {
        if (localTodo.name === todo.children[1].innerText) {
          localTodo.completed = false;
        }
      });
      localStorage.setItem("todos", JSON.stringify(todos));
    } else {
      todo.classList.add("completed");
      numberItems -= 1;
      todos.forEach(localTodo => {
        if (localTodo.name === todo.children[1].innerText) {
          localTodo.completed = true;
        }
      });
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }
  updateItemsLeft();
}

function updateItemsLeft() {
  numberItems < 0 ? (numberItems = 0) : numberItems;
  itemsLeft.forEach(el => (el.innerText = `${numberItems} items left`));
}

function filterTodo(e) {
  // const filterBtns = [...todoFilter.children];
  todoFilterBtns.forEach(btn => btn.classList.remove("selected"));
  const item = e.target;
  item.classList.add("selected");
  const todos = [...todoList.childNodes];
  todos.forEach(todo => {
    if (item.classList.contains("all")) {
      todo.style.display = "flex";
    } else if (item.classList.contains("active")) {
      !todo.classList.contains("completed")
        ? (todo.style.display = "flex")
        : (todo.style.display = "none");
    } else {
      todo.classList.contains("completed")
        ? (todo.style.display = "flex")
        : (todo.style.display = "none");
    }
  });
}

function clearComplete(e) {
  const todos = [...todoList.childNodes];
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].classList.contains("completed")) {
      todos[i].remove();
      removeLocalTodo(todos[i]);
    }
  }
}

function checkLocalStorage() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}

function saveLocalTodo(todo, complete = false) {
  let todos = checkLocalStorage();
  todos.push({ name: todo, completed: complete });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function removeLocalTodo(todo) {
  let todos = checkLocalStorage();
  const todoInput = todo.children[1].innerText;
  let newTodos = todos.filter(currentTodo => currentTodo.name !== todoInput);
  localStorage.setItem("todos", JSON.stringify(newTodos));
}

function getTodos() {
  let todos = checkLocalStorage();
  if (todos !== null) {
    todos.forEach(savedTodo => {
      const todo = document.createElement("li");
      // check if todo is completed
      if (savedTodo.completed === true) {
        todo.className = "todo draggable completed";
      } else {
        todo.className = "todo draggable";
        numberItems += 1;
      }
      todo.setAttribute("draggable", true);
      // add checkbox
      const checkbox = document.createElement("div");
      checkbox.classList.add("round");
      todo.append(checkbox);
      // add value
      const todoText = document.createElement("p");
      todoText.innerText = savedTodo.name;
      todo.append(todoText);
      // add cross
      const cross = document.createElement("img");
      cross.src = "img/icon-cross.svg";
      cross.classList.add("cross");
      todo.append(cross);
      // add to list
      todoList.append(todo);
      // update items left counter
      updateItemsLeft();
    });
  }
}

function themeToggle() {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    themeToggle.src = "img/icon-sun.svg";
    backgroundDesktop.src = "img/bg-desktop-dark.jpg";
    backgroundMobile.src = "img/bg-mobile-dark.jpg";
  } else {
    themeToggle.src = "img/icon-moon.svg";
    backgroundDesktop.src = "img/bg-desktop-light.jpg";
    backgroundMobile.src = "img/bg-mobile-light.jpg";
  }
}

const addTask = document.getElementById("add-task");
const tasks = document.getElementById("tasks");
const overlay = document.querySelector(".overlay");
const popupBox = document.querySelector(".popup-box");
const input = document.getElementById("input");
const btnAddTask = document.getElementById("btn");
const closeIcon = document.querySelector(".close-icon");

// جلب المهام من localStorage عند تحميل الصفحة
window.onload = function () {
  if (localStorage.getItem("tasks")) {
    tasksArr = JSON.parse(localStorage.getItem("tasks"));
    renderTasks();
  }
};

let tasksArr = [];
let index = 0;
let editingTaskId = null; // لتخزين ID المهمة التي يتم تعديلها

// عرض المهام في واجهة المستخدم
function renderTasks() {
  tasks.innerHTML = ""; // تنظيف القائمة قبل إعادة العرض

  tasksArr.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.className = `task-item flex justify-between items-center bg-white border shadow-md ${
      task.completed ? "completed" : ""
    }`;
    taskElement.dataset.id = task.id;
    taskElement.innerHTML = `
      <div class="basis-3/4 py-2 pr-5">
        <h2 class="${task.completed ? "line-through text-gray-500" : ""}">${
      task.title
    }</h2>
        <div class="mt-2">
          <i class="fa-solid fa-calendar-days ml-2"></i>
          <span>${task.date}</span>
        </div>
      </div>
      <div class="basis-3/12 flex justify-center items-center gap-5">
        <button class="remove-btn">
          <i class="fa-solid fa-trash hover:text-red-600 transition duration-300"></i>
        </button>
        <button class="edit-btn">
          <i class="fa-solid fa-pen hover:text-cyan-600 transition duration-300"></i>
        </button>
        <button class="undo-btn text-red-600 ${task.completed ? "" : "hidden"}">
          <i class="fa-solid fa-circle-xmark transition duration-300"></i>
        </button>
        <button class="complete-btn text-green-600 ${
          task.completed ? "hidden" : ""
        }">
          <i class="fa-solid fa-circle-check"></i>
        </button>
      </div>
    `;
    tasks.appendChild(taskElement);
  });
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

// فتح وإغلاق النافذة المنبثقة
function togglePopup() {
  overlay.classList.toggle("open");
  popupBox.classList.toggle("open");
  input.focus();
}

// إغلاق النافذة المنبثقة عند النقر خارجها
function handleClickOutside(e) {
  if (e.target === overlay || e.target === closeIcon) {
    togglePopup();
  }
}

// إضافة مهمة جديدة أو تحديث مهمة موجودة
function addNewTask() {
  const titleTask = input.value;
  if (titleTask === "") return; // تجاهل الإدخالات الفارغة

  const now = new Date();
  if (editingTaskId !== null) {
    // تحديث مهمة حالية
    tasksArr = tasksArr.map((task) => {
      if (task.id === editingTaskId) {
        return {
          ...task,
          title: titleTask,
          date: `${now.getFullYear()}/${
            now.getMonth() + 1
          }/${now.getDate()} - ${now.getHours()}:${now.getMinutes()}`,
        };
      }
      return task;
    });

    editingTaskId = null; // إعادة تعيين ID المهمة بعد التحديث
    btnAddTask.textContent = "اضف مهمة"; // إعادة تعيين نص الزر
  } else {
    // إضافة مهمة جديدة
    tasksArr.push({
      id: index++,
      title: titleTask,
      date: `${now.getFullYear()}/${
        now.getMonth() + 1
      }/${now.getDate()} - ${now.getHours()}:${now.getMinutes()}`,
      completed: false, // تعيين حالة المهمة كمكتملة
    });
  }

  renderTasks();
  togglePopup();
  input.value = "";
}

// حذف مهمة عند النقر على زر الحذف
function handleTaskClick(e) {
  const removeBtn = e.target.closest(".remove-btn");
  if (removeBtn) {
    const taskId = e.target.closest(".task-item").dataset.id;
    tasksArr = tasksArr.filter((task) => task.id !== Number(taskId));
    renderTasks();
  }

  const editBtn = e.target.closest(".edit-btn");
  if (editBtn) {
    const taskId = e.target.closest(".task-item").dataset.id;
    const taskToEdit = tasksArr.find((task) => task.id === Number(taskId));
    if (taskToEdit) {
      // عرض نافذة التعديل مع قيمة العنوان الحالي
      input.input = taskToEdit.title;
      editingTaskId = taskToEdit.id; // تعيين ID المهمة التي يتم تعديلها
      togglePopup(); // إعادة فتح النافذة المنبثقة للتعديل
      btnAddTask.textContent = "حفظ"; // تغيير نص الزر إلى "Save"
    }
  }

  const completeBtn = e.target.closest(".complete-btn");
  if (completeBtn) {
    const taskId = e.target.closest(".task-item").dataset.id;
    tasksArr = tasksArr.map((task) => {
      if (task.id === Number(taskId)) {
        return { ...task, completed: true };
      }
      return task;
    });
    renderTasks();
  }

  const undoBtn = e.target.closest(".undo-btn");
  if (undoBtn) {
    const taskId = e.target.closest(".task-item").dataset.id;
    tasksArr = tasksArr.map((task) => {
      if (task.id === Number(taskId)) {
        return { ...task, completed: false };
      }
      return task;
    });
    renderTasks();
  }
}

// مستمع حدث النقر في المستند لإغلاق النافذة المنبثقة
document.body.addEventListener("click", handleClickOutside);

// مستمع حدث النقر على زر الإضافة
addTask.addEventListener("click", togglePopup);

// مستمع حدث النقر على زر الإضافة للمهمة
btnAddTask.addEventListener("click", addNewTask);

// مستمع حدث عند الضغط على "Enter" في حقل الإدخال
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addNewTask();
  }
});

// مستمع حدث النقر على المهام
tasks.addEventListener("click", handleTaskClick);

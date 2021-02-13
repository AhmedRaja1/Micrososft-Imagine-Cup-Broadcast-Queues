export const initDragDrop = () => {
  const draggables = document.querySelectorAll(".draggable");
  const list = document.querySelector(".todo-list");
  console.log(draggables);

  draggables.forEach(draggable => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });
    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
    });
  });

  list.addEventListener("dragover", e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(list, e.clientY);
    console.log(afterElement);
    const draggable = document.querySelector(".dragging");
    console.log(draggable);
    if (afterElement == null) {
      list.appendChild(draggable);
    } else {
      list.insertBefore(draggable, afterElement);
    }
  });

  function getDragAfterElement(list, y) {
    const draggableElements = [
      ...list.querySelectorAll(".draggable:not(.dragging)")
    ];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height;
        console.log(offset);
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }
};

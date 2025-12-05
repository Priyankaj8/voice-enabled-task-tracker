import React from "react";
import { useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { updateTask, deleteTask } from "../store";
import { Edit2, Trash2, Calendar } from "lucide-react";

export default function KanbanBoard({ tasks, onEdit, getPriorityColor }) {
  const dispatch = useDispatch();

  const columns = {
    todo: {
      name: "To Do",
      items: tasks.filter((t) => t.status === "To Do"),
    },
    inprogress: {
      name: "In Progress",
      items: tasks.filter((t) => t.status === "In Progress"),
    },
    done: {
      name: "Done",
      items: tasks.filter((t) => t.status === "Done"),
    },
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const newStatus =
        destination.droppableId === "todo"
          ? "To Do"
          : destination.droppableId === "inprogress"
          ? "In Progress"
          : "Done";

      dispatch(updateTask({ id: draggableId, updates: { status: newStatus } }));
    }
  };

  const handleDelete = (e, taskId) => {
    e.stopPropagation(); // Prevent drag from triggering
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(taskId));
    }
  };

  const handleEdit = (e, task) => {
    e.stopPropagation(); // Prevent drag from triggering
    onEdit(task);
  };

  const getPriorityColorLocal = (priority) => {
    if (getPriorityColor) return getPriorityColor(priority);
    
    switch(priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(columns).map(([colId, col]) => (
          <div key={colId} className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3">
              {col.name} ({col.items.length})
            </h3>
            <Droppable droppableId={colId}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`min-h-[300px] transition-colors ${
                    snapshot.isDraggingOver ? 'bg-blue-50 rounded' : ''
                  }`}
                >
                  {col.items.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className={`bg-white p-4 mb-3 rounded-lg shadow border transition-all ${
                            snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400 rotate-2' : ''
                          }`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {/* Header with Title and Action Buttons */}
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900 flex-1 pr-2">
                              {task.title}
                            </h4>
                            <div className="flex gap-1 flex-shrink-0">
                              <button
                                onClick={(e) => handleEdit(e, task)}
                                className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition"
                                title="Edit task"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={(e) => handleDelete(e, task._id)}
                                className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition"
                                title="Delete task"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Description */}
                          {task.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          {/* Footer with Priority and Due Date */}
                          <div className="flex justify-between items-center text-sm">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColorLocal(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                            {task.dueDate && (
                              <span className="flex items-center gap-1 text-gray-500">
                                <Calendar size={14} />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
}
import { Task, TaskStatus } from "../types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import React, { useCallback, useEffect, useState } from "react";
import { object } from "zod";
import KanbanColumnHeader from "./kanban-column-header";
import KanbanCard from "./kanban-card";

interface DataKanbanProps {
  data: Task[];
}

export const DataKanban = ({ data }: DataKanbanProps) => {
  const boards: TaskStatus[] = [
    TaskStatus.BACKLOG,
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.IN_REVIEW,
    TaskStatus.DONE,
  ];

  type TaskState = {
    [key in TaskStatus]: Task[];
  };

  const [tasks, setTasks] = useState<TaskState>(() => {
    const initialTasks: TaskState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });

    // sort initial tasks by position
    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort(
        (a, b) => a.position - b.position
      );
    });

    return initialTasks;
  });

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    let updatesPayload: {
      $id: string;
      status: TaskStatus;
      position: number;
    }[] = [];

    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };

      // safely remove task from source column
      const sourceColumn = [...newTasks[sourceStatus]];
      const [movedTask] = sourceColumn.splice(source.index, 1);

      // if there is no moved task (shouldn't happen, but just in case), return the previous state
      if (!movedTask) {
        console.log("No task found at the source index");
        return prevTasks;
      }

      // create new task object with potentially updated status
      const updatedMovedTask =
        sourceStatus !== destStatus
          ? { ...movedTask, status: destStatus }
          : movedTask;

      // update the source column
      newTasks[sourceStatus] = sourceColumn;

      // add the task to the destination column
      const destColumn = [...newTasks[destStatus]];
      destColumn.splice(destination.index, 0, updatedMovedTask);
      newTasks[destStatus] = destColumn;

      // prepare minimal update payloads
      updatesPayload = [];

      // always update the moved task
      updatesPayload.push({
        $id: updatedMovedTask.$id,
        status: destStatus,
        position: Math.min((destination.index + 1) * 1000, 1000000),
      });

      // update position for affected tasks in the destination column
      newTasks[destStatus].forEach((task, index) => {
        if (task && task.$id !== updatedMovedTask.$id) {
          const newPosition = Math.min((index + 1) * 1000, 1000000);
          if (task.position !== newPosition) {
            updatesPayload.push({
              $id: task.$id,
              status: destStatus,
              position: newPosition,
            });
          }
        }
      });

      // if the task moved between columns, update positions in the source column
      if (sourceStatus !== destStatus) {
        newTasks[sourceStatus].forEach((task, index) => {
          if (task) {
            const newPosition = Math.min((index + 1) * 1000, 1000000);
            if (task.position !== newPosition) {
              updatesPayload.push({
                $id: task.$id,
                status: sourceStatus,
                position: newPosition,
              });
            }
          }
        });
      }

      return newTasks;
    });
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
              <Droppable droppableId={board}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] py-1.5"
                  >
                    {tasks[board].map((task, index) => (
                      <Draggable
                        key={task.$id}
                        draggableId={task.$id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

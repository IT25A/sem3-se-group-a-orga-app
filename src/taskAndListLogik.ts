import {lists, backlog, updateAppData} from './persistence/state';
//export let lists: List[] = []
/*export let backlog: Backlog = {
  id: "backlog",
  title: 'Backlog',
  description: 'This is the backlog list',
  createdAt: new Date(),
  tasks: []
};*/

export type Backlog = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  tasks: Task[];
}


export function generateUniqueId(): string {
  return crypto.randomUUID();
}

// Hier folgt alles zu Listen

export type List = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  tasks: string[];
}

export type Priority = 'klein' | 'mittel' | 'hoch';
export type Complexity = 'einfach' | 'mittel' | 'schwierig';
export type TimeEstimate = 'kurz' | 'mittel' | 'lang';


function createList(title: string, description: string): List {
  let newList: List = {
    id: generateUniqueId(),
    title,
    description,
    createdAt: new Date(),
    tasks: []
  }
  return newList;
}
export async function addList(title: string, description: string): Promise<void> {
  const newList = createList(title, description);
  lists.push(newList);
  await updateAppData(lists, backlog);
}

export async function deleteList(id: string): Promise<void> {
  const index = lists.findIndex(list => list.id === id);
  if (index === -1) {
    return;
  }
  // Remove the list ID from every task that references it
  for (const task of backlog.tasks) {
    const taskListIndex = task.lists.indexOf(id);

    if (taskListIndex !== -1) {
      task.lists.splice(taskListIndex, 1);
    }
  }
  //remove list itself
  lists.splice(index, 1);
  await updateAppData(lists, backlog);
}

export async function renameList(id: string, newTitle: string): Promise<void> {
  const list = lists.find(list => list.id === id);
  if (list) {
    list.title = newTitle;
    await updateAppData(lists, backlog);
  }
}

export async function changeListDescription(id: string, newDescription: string): Promise<void> {
  const list = lists.find(list => list.id === id);
  if (list) {
    list.description = newDescription;
    await updateAppData(lists, backlog);
  }
} 

export async function deleteListsRecursivly(listId: string): Promise<void> {
  const listIndex = lists.findIndex(list => list.id === listId);
  if (listIndex !== -1) {
    if (lists[listIndex].tasks.length > 0) {
      const list = lists[listIndex];
      for (const task of [...list.tasks]) { //hier wird über eine Kopie iteriert, weil sonst Tasks übersprungen werden...
        const taskIndexBacklog = backlog.tasks.findIndex(tasks => tasks.id === task);
        if (taskIndexBacklog !== -1) {
          if (backlog.tasks[taskIndexBacklog].lists.length === 2) { // wenn task nur in dieser Liste und im Backlog ist, dann wird sie gelöscht, sonst nur aus der Liste entfernt
            await deleteTask(task);
          } else {
            backlog.tasks[taskIndexBacklog].lists =
              backlog.tasks[taskIndexBacklog].lists.filter(id => id !== listId);
          }
        }
      }
    }
    lists.splice(listIndex, 1);
    await updateAppData(lists, backlog);
  }
} 
//[start]
export function calculateProgress(listId: string){
  let done: number = 0;
  const listIndex = lists.findIndex(list => list.id === listId);
  const list = lists[listIndex]
  const total= list.tasks.length;
  if (!list || list.tasks.length === 0) {
    return 0;
  }

  for(const taskId of list.tasks){
    const task = backlog.tasks.find(task => task.id === taskId);
    if(task && task.completed){
      done++;
    }
  }
  return Math.round((done / total) * 100);
}

//Jetzt folgt alles zu Aufgaben

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate?: Date;
  createdAt: Date;
  priority: Priority;
  complexity: Complexity;
  timeEstimate: TimeEstimate;
  completed: boolean;
  lists: string[];
};

export async function createTask({
  title,
  description,
  priority,
  complexity,
  timeEstimate,
  dueDate
}: {
  title: string;
  description: string;
  priority?: Priority;
  complexity?: Complexity;
  timeEstimate?: TimeEstimate;
  dueDate?: Date;
}): Promise<Task> {
  const newTask: Task = {
    id: generateUniqueId(),
    title,
    description,
    dueDate: dueDate ?? undefined,
    createdAt: new Date(),
    priority: priority ?? 'mittel',
    complexity: complexity ?? 'mittel',
    timeEstimate: timeEstimate ?? 'mittel',
    completed: false,
    lists: [backlog.id]
  };
  backlog.tasks.push(newTask);
  await updateAppData(lists, backlog);
  return newTask;
}

export async function addTaskToList(taskId: string, listId: string): Promise<void> {
  const task = backlog.tasks.find(task => task.id === taskId);
  const list = lists.find(list => list.id === listId);
  if (task && list) {
    if (!task.lists.includes(listId)) {
      task.lists.push(listId);
    }
    if (!list.tasks.some(t => t === taskId)) {
      list.tasks.push(taskId);
    }
    await updateAppData(lists, backlog);
  }
} 

export async function deleteTask(taskId: string): Promise<void> {
  const taskIndex = backlog.tasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    const task = backlog.tasks[taskIndex];
    for (const listId of task.lists) {
      const list = lists.find(list => list.id === listId);
      if (list) {
        const indexInList = list.tasks.findIndex(t => t === taskId);
        if (indexInList !== -1) {
          list.tasks.splice(indexInList, 1);
        }
      }
    }
    backlog.tasks.splice(taskIndex, 1);
    await updateAppData(lists, backlog);
  }
}

export async function removeTaskFromList(taskId: string, listId: string): Promise<void> {
  const list = lists.find(list => list.id === listId);
  const task = backlog.tasks.find(task => task.id === taskId);

  if(list && task){
      const taskIndex = list.tasks.findIndex(task => task === taskId);
      const listIndex = task.lists.findIndex(list => list === listId);
      if(taskIndex !== -1 && listIndex !== -1){
        list.tasks.splice(taskIndex, 1);
        task.lists.splice(listIndex, 1)
      }
  }
  await updateAppData(lists, backlog);
}

export async function editTaskTitle(taskId: string, newTitle: string): Promise<void> {
  const task = backlog.tasks.find(task => task.id === taskId);
  if (task) {
    task.title = newTitle;
    await updateAppData(lists, backlog);
  }
}
  
export async function editTaskDescription(taskId: string, newDescription: string): Promise<void> {
  const task = backlog.tasks.find(task => task.id === taskId);
  if (task) {
    task.description = newDescription;
    await updateAppData(lists, backlog);
  }
}

export async function editTaskDueDate(taskId: string, newDueDate?: Date): Promise<void> {
  const task = backlog.tasks.find(task => task.id === taskId);
  if (task) {
    task.dueDate = newDueDate;
    await updateAppData(lists, backlog);
  }
}

export async function editTaskPriority(taskId: string, newPriority: Priority): Promise<void> {
  const task = backlog.tasks.find(task => task.id === taskId);
  if (task) {
    task.priority = newPriority;
    await updateAppData(lists, backlog);
  }
}

export async function editTaskComplexity(taskId: string, newComplexity: Complexity): Promise<void> {
  const task = backlog.tasks.find(task => task.id === taskId);
  if (task) {
    task.complexity = newComplexity;
    await updateAppData(lists, backlog);
  }
}

export async function editTaskTimeEstimate(taskId: string, newTimeEstimate: TimeEstimate): Promise<void> {
  const task = backlog.tasks.find(task => task.id === taskId);
  if (task) {
    task.timeEstimate = newTimeEstimate;
    await updateAppData(lists, backlog);
  }
}

export async function editTaskCompleted(taskId: string, completed: boolean): Promise<void> {
  const task = backlog.tasks.find(task => task.id === taskId);
  if (task) {
    task.completed = completed;
    await updateAppData(lists, backlog);
  }
}
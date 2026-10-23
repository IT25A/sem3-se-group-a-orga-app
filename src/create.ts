/* 
Hier soll die Logik zum erstellen von Listen und Aufgaben implementiert werden.
*/
export let lists: List[] = []
export let backlog: List = {
  id: "backlog",
  title: 'Backlog',
  description: 'This is the backlog list',
  createdAt: new Date(),
  tasks: []
};

function generateUniqueId(): string {
  return crypto.randomUUID();
}

// Hier folgt alles zu Listen

type List = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  tasks: Task[];
}

export type Priority = 'klein' | 'mittel' | 'hoch';
export type Complexity = 'einfach' | 'mittel' | 'schwierig';
export type TimeEstimate = 'kurz' | 'mittel' | 'lang';


export function createList(title: string, description: string): List {
  let newList: List = {
    id: generateUniqueId(),
    title,
    description,
    createdAt: new Date(),
    tasks: []
  }
  return newList;
}
export function addList(title: string, description: string): void {
  const newList = createList(title, description);
  lists.push(newList);
}

export function deleteList(id: string): void {
  const index = lists.findIndex(list => list.id === id);
  if (index !== -1) {
    lists.splice(index, 1);
  }
}

export function renameList(id: string, newTitle: string): void {
  const list = lists.find(list => list.id === id);
  if (list) {
    list.title = newTitle;
  }
}

export function changeListDescription(id: string, newDescription: string): void {
  const list = lists.find(list => list.id === id);
  if (list) {
    list.description = newDescription;
  }
} 

//Jetzt folgt alles zu Aufgaben

type Task = {
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

export function createTask({
  title,
  description,
  dueDate,
  priority,
  complexity,
  timeEstimate
}: {
  title: string;
  description: string;
  dueDate?: Date;
  priority?: Priority;
  complexity?: Complexity;
  timeEstimate?: TimeEstimate;
}): Task {
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
  return newTask;
}

export function addTaskToList(taskId: string, listId: string): void {
  const task = backlog.tasks.find(task => task.id === taskId);
  const list = lists.find(list => list.id === listId);

  if (task && list) {
    if (!task.lists.includes(listId)) {
      task.lists.push(listId);
    }
    if (!list.tasks.some(t => t.id === taskId)) {
      list.tasks.push(task);
    }
  }
} 
/* 
Hier soll die Logik zum erstellen von Listen und Aufgaben implementiert werden.
*/
export let lists: List[] = []

type List = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  tasks: Task[];
}

type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  createdAt: Date;
  priority: Priority;
  complexity: Complexity;
  timeEstimate: TimeEstimate;
  completed: boolean;
};


type Priority = 'klein' | 'mittel' | 'hoch';
type Complexity = 'einfach' | 'mittel' | 'schwierig';
type TimeEstimate = 'kurz' | 'mittel' | 'lang';


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

function generateUniqueId(): string {
  return crypto.randomUUID();
}

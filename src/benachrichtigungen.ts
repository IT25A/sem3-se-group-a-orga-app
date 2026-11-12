import {backlog} from "./persistence/state.ts";

export function iftasksexists(){

    const anzahl = backlog.tasks.length
    if (anzahl>5) {
        alert("du hast viele Aufgaben angelegt")
    }
}
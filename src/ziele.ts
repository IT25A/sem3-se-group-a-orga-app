
import { ziellog, updateZiellog } from "./persistence/state";
import type { Ziel } from "./displayZiele";
import { calculateProgress } from "./taskAndListLogik";

export async function addZiel(ziel: Ziel): Promise<void> {
    const newZiele = [...(ziellog ?? []), ziel];
    await updateZiellog(newZiele);
}

export async function removeZiel(zielId: string): Promise<void> {
    const newZiele = (ziellog ?? []).filter(
        ziel => ziel.id !== zielId
    );

    await updateZiellog(newZiele);
}

export function calculateZielListsProgress(ziel: Ziel): number{
    let zielProgressSum = 0;
    ziel.lists.forEach(element => {
        zielProgressSum += calculateProgress(element);
    });
    return zielProgressSum / ziel.lists.length
}
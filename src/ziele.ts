
import { ziellog, updateZiellog } from "./persistence/state";
import type { Ziel } from "./displayZiele";

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

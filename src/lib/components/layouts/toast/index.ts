export { default as Toasts } from "./toast.svelte";

import { get, writable } from "svelte/store";
export const toasts = writable([]);

export function pushToast(message: string, type: "danger" | "success" | "warning" | "info") {
    toasts.set([...get(toasts), [message, type]]);
    setTimeout(() => toasts.set(get(toasts).slice(1)), 5000);
}
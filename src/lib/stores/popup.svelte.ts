import type { Snippet } from "svelte";

export interface AlertOptions {
  id?: string;
  title?: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
}

export interface ConfirmOptions {
  id?: string;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface CustomOptions {
  id?: string;
  component: Snippet;
}

interface BasePopup {
  id: string;
}

export interface AlertPopup extends BasePopup {
  type: "normalAlert" | "successAlert" | "errorAlert" | "warningAlert";
  title?: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
}

export interface ConfirmPopup extends BasePopup {
  type: "confirm";
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface CustomPopup extends BasePopup {
  type: "custom";
  component: Snippet;
}

export type PopupItem = AlertPopup | ConfirmPopup | CustomPopup;

class PopupStore {
  items = $state<PopupItem[]>([]);

  generateId(): string {
    return crypto.randomUUID();
  }

  private add(item: PopupItem): void {
    const index = this.items.findIndex((p) => p.id === item.id);
    if (index !== -1) {
      this.items[index] = item;
    } else {
      this.items.push(item);
    }
  }

  alert(options: AlertOptions): AlertPopup {
    const item: AlertPopup = {
      id: options.id ?? this.generateId(),
      type: "normalAlert",
      ...options
    };
    this.add(item);
    return item;
  }

  success(options: AlertOptions): AlertPopup {
    const item: AlertPopup = {
      id: options.id ?? this.generateId(),
      type: "successAlert",
      ...options
    };
    this.add(item);
    return item;
  }

  error(options: AlertOptions): AlertPopup {
    const item: AlertPopup = {
      id: options.id ?? this.generateId(),
      type: "errorAlert",
      ...options
    };
    this.add(item);
    return item;
  }

  warning(options: AlertOptions): AlertPopup {
    const item: AlertPopup = {
      id: options.id ?? this.generateId(),
      type: "warningAlert",
      ...options
    };
    this.add(item);
    return item;
  }

  confirm(options: ConfirmOptions): ConfirmPopup {
    const item: ConfirmPopup = {
      id: options.id ?? this.generateId(),
      type: "confirm",
      ...options
    };
    this.add(item);
    return item;
  }

  custom(options: CustomOptions): CustomPopup {
    const item: CustomPopup = {
      id: options.id ?? this.generateId(),
      type: "custom",
      ...options
    };
    this.add(item);
    return item;
  }

  remove(id?: string): void {
    if (this.items.length === 0) return;
    if (id) {
      this.items = this.items.filter((item) => item.id !== id);
    } else {
      this.items = this.items.slice(0, -1);
    }
  }
}

export const popup = new PopupStore();

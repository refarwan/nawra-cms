class PageTitleStore {
  title = $state<string | null>(null);

  set(title: string): void {
    this.title = title;
  }

  reset(): void {
    this.title = null;
  }
}

export const pageTitleStore = new PageTitleStore();

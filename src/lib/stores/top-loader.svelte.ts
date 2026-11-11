class TopLoaderStore {
  activeCount = $state(0);

  get isActive(): boolean {
    return this.activeCount > 0;
  }

  start(): void {
    this.activeCount += 1;
  }

  done(force = false): void {
    if (force || this.activeCount <= 1) {
      this.activeCount = 0;
    } else {
      this.activeCount -= 1;
    }
  }

  async load<T>(action: Promise<T> | (() => Promise<T>)): Promise<T> {
    this.start();
    try {
      const promise = typeof action === "function" ? action() : action;
      return await promise;
    } finally {
      this.done();
    }
  }
}

export const topLoader = new TopLoaderStore();

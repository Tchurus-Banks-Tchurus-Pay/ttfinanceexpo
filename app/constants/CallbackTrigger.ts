interface CallbackRegister {
  name: string;
  callback: () => Promise<void>;
}

export class CallbackTrigger {
  private static callbacks: CallbackRegister[] = [];

  static addCallback(name: string, callback: () => Promise<void>) {
    if (this.callbacks.find((cb) => cb.name === name)) {
      return;
    }
    this.callbacks.push({ name, callback });
  }

  static removeCallback(name: string) {
    this.callbacks = this.callbacks.filter((cb) => cb.name !== name);
  }

  static async triggerCallback(name: string, ...args: any[]) {
    const cb = this.callbacks.find((cb) => cb.name === name);
    if (cb) {
      console.log(`Triggering callback ${name}`);
      await cb.callback();
      console.log(`Finished callback ${name}`);
    }
  }

  static async triggerAll() {
    this.callbacks.forEach(async (cb) => await cb.callback());
  }
}

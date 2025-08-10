import { PluginState } from '@/types';

export interface CoreState {
  currentDate: Date;
}

// type CoreTransaction =
//   | Transaction<{ date: Date }>
//   | Transaction<{ direction: 'next' | 'previous' }>;

export class CorePluginState extends PluginState<CoreState> {
  apply(transaction: any): CorePluginState {
    const newValue = { ...this.value };

    switch (transaction.type) {
      case 'SELECT_DATE': {
        if (transaction.payload?.date) {
          newValue.currentDate = new Date(transaction.payload.date);
        }
        break;
      }
      case 'CHANGE_MONTH': {
        if (transaction.payload?.direction === 'next') {
          newValue.currentDate.setMonth(newValue.currentDate.getMonth() + 1);
        } else if (transaction.payload?.direction === 'previous') {
          newValue.currentDate.setMonth(newValue.currentDate.getMonth() - 1);
        }
        break;
      }
    }
    return new CorePluginState(newValue);
  }

  toJSON(): CoreState {
    return {
      currentDate: this.value.currentDate,
    };
  }

  static fromJSON(value: CoreState): CorePluginState {
    return new CorePluginState(value);
  }
}

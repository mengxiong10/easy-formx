import * as React from 'react';

export interface Ictx {
  addField: (value: any) => void;
  removeField: (value: any) => void;
  labelPosition: 'left'|'right'|'top';
  labelSuffix: string;
  labelWidth?: number|string;
}

export const { Provider, Consumer } = React.createContext<Ictx>({} as any);

import * as React from 'react';

export type LabelPosition = 'right' | 'left' | 'top';
export type LabelWidth = string | number;

export interface FormxContextValue {
  labelPosition?: LabelPosition;
  labelWidth?: LabelWidth;
  labelSuffix?: string;
  disabled?: boolean;
}

const FormxContext = React.createContext<FormxContextValue>({} as FormxContextValue);

export default FormxContext;

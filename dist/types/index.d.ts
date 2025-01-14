import { default as default_2 } from 'react';
import { EventHandler } from 'react';
import { JSX as JSX_2 } from 'react/jsx-runtime';
import { ReactNode } from 'react';
import { SyntheticEvent } from 'react';

declare type AnyProps = Record<string, any>;

export declare const classnames: (...classes: any[]) => string;

export declare const Dynamic: <T extends default_2.ElementType>(props: DynamicProps<T>) => default_2.ReactElement;

declare type DynamicProps<T extends default_2.ElementType> = {
    component: T;
} & default_2.ComponentPropsWithRef<T>;

export declare const formatAddress: (address: string, city: string, postcode: string, options?: any) => string | JSX_2.Element;

export declare const formatAge: (date: Date | string) => number;

export declare const formatDate: (date: Date | string, locale?: string) => string;

export declare const formatDateShort: (date: Date | string, locale?: string) => string;

export declare const formatDecimal: (value: number, options?: {}, locale?: string) => string;

export declare const formatMoney: (amount: number, currency?: string, locale?: string) => string;

export declare const mergeEventHandlers: <T extends SyntheticEvent>(...handlers: (EventHandler<T> | undefined)[]) => EventHandler<T>;

export declare const mergeProps: (slotProps: AnyProps, childProps: AnyProps) => {
    [x: string]: any;
};

export declare const mergeRefs: (...refs: any[]) => (node: any) => void;

export declare const Page: ({ title, themeColor, children, isLoading, fallback, }: {
    title?: string;
    themeColor?: string;
    children?: ReactNode;
    isLoading?: boolean;
    fallback?: ReactNode;
}) => ReactNode;

export declare const url: (path: string, params?: {}) => string;

export declare const useControllableState: <T>(initialValue?: T, controlledValue?: T, setControlledValue?: (value: T) => void) => [T, (value: T | ((prevValue: T) => T)) => void];

export declare const useLocalStorage: <T extends unknown>(key: string, initialValue?: any) => [T, (value: T) => void];

export { }

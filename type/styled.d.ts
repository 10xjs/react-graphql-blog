import 'styled-components';

declare module 'styled-components' {
  export type StyledComponentAttributes<S> = S extends StyledComponentBase<
    infer C,
    infer T,
    infer O,
    infer A
  >
    ? JSX.LibraryManagedAttributes<
        S,
        StyledComponentProps<C, T, O, A> & {
          as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
        }
      >
    : never;
}

export type PropsWithChildrenFunction<TProps, TParams> = TProps & {
  children?(params: TParams): React.ReactNode;
};

import 'next';

declare module 'next' {
  type PageProps<TParams = {}, TSearchParams = {}> = {
    params: TParams;
    searchParams: TSearchParams;
  };
}
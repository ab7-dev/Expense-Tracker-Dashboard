declare module 'react-dom/client' {
  import { Container } from 'react-dom';
  interface Root {
    render(children: import('react').ReactNode): void;
    unmount(): void;
  }
  export function createRoot(container: Element | DocumentFragment, options?: { identifierPrefix?: string }): Root;
  export function hydrateRoot(container: Element | Document, initialChildren: import('react').ReactNode): Root;
}

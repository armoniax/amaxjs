declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.png';
declare module '*.ico';
declare module 'react-redux';
declare interface Window {
  React: any;
}
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}

declare interface Window {}

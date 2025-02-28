// import { ReactElement } from "react";

// interface LayoutProps {
//   children: ReactElement<any, any> | any;
// }
// const Layout = ({ children }: LayoutProps) => {
//   return (
//     <>
//       <span>Componente public</span>
//       {children}
//     </>
//   );
// };

// export default Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

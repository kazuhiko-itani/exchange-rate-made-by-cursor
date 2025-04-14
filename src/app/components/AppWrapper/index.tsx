"use client";

import { ReactNode, Fragment } from "react";
import { Header } from "../Header";
import { usePathname } from "next/navigation";

export function AppWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage) {
    return <Fragment>{children}</Fragment>;
  }

  return (
    <Fragment>
      <Header />
      {children}
    </Fragment>
  );
}

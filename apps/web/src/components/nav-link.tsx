'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import type{ ComponentProps } from "react";

interface NaviLinkProps extends ComponentProps<typeof Link>{}

export function NavLink(props: NaviLinkProps) {
  const pathname = usePathname();

  const isCurrent = props.href.toString() === pathname;
console.log({
  href: props.href.toString(),
  pathname,
  isCurrent
})
  return <Link data-current={isCurrent} {...props}/>
}
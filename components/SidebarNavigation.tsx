"use client";
import { Folders, Folder, Boxes, Code } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Collection } from "@/actions/collections";
import { usePathname } from "next/navigation";
import { EndpointDialog } from "./EndpointDialog";

interface SidebarNavigationProps {
  collections: Collection[];
}

export function SidebarNavigation({ collections }: SidebarNavigationProps) {
  const pathname = usePathname();
  const url = pathname || "/";

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={
                    url === "/collections" || url === "/collections/new"
                  }
                  asChild
                >
                  <Link href="/collections">
                    <Folders />
                    <span>Collections</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={url.includes("/items")}
                  className="data-[active=true]:bg-violet-500 data-[active=true]:text-white"
                  asChild
                >
                  <Link href="/items">
                    <Boxes />
                    <span>Items</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Collections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {collections.map((collection) => (
                <SidebarMenuItem key={collection.id}>
                  <SidebarMenuButton
                    isActive={url.includes(`/collections/${collection.id}`)}
                    asChild
                  >
                    <Link href={`/collections/${collection.id}`}>
                      <Folder />
                      <span>{collection.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>API endpoints</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <EndpointDialog
                  endpoint={`${process.env.NEXT_PUBLIC_DOMAIN}/api/collections`}
                >
                  <SidebarMenuButton>
                    <Code />
                    <span>GET collections</span>
                  </SidebarMenuButton>
                </EndpointDialog>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <EndpointDialog
                  endpoint={`${process.env.NEXT_PUBLIC_DOMAIN}/api/items`}
                >
                  <SidebarMenuButton>
                    <Code />
                    <span>GET items</span>
                  </SidebarMenuButton>
                </EndpointDialog>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

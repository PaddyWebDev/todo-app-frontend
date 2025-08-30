import { ClipboardCheck, LucideIcon, User,  FileText } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface routeProps {
  label: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
}

export default function useRoutes() {
  const pathName = usePathname();

  const routes: routeProps[] = useMemo(
    () => [
      {
        label: "Notes",
        href: "/auth/Notes",
        icon: FileText,
        active: pathName === "/auth/Notes",
      },
      {
        label: "Todo",
        href: "/auth/Todo",
        icon: ClipboardCheck,
        active: pathName === "/auth/Todo",
      },
      {
        label: "Profile",
        href: "/auth/Profile",
        icon: User,
        active: pathName === "/auth/Profile",
      },
    ],
    [pathName]
  );

  return routes;
}

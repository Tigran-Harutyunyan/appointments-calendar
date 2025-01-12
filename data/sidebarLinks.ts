import { CalendarCheck, HomeIcon, Settings, Users2 } from "lucide-vue-next";

export const dashboardLinks = [
    {
        id: 0,
        name: "Event Types",
        href: "/dashboard",
        icon: HomeIcon,
    },
    {
        id: 1,
        name: "Meetings",
        href: "/dashboard/meetings",
        icon: Users2,
    },
    {
        id: 2,
        name: "Availablity",
        href: "/dashboard/availability",
        icon: CalendarCheck,
    },
    {
        id: 3,
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];
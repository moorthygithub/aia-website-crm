import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  AudioWaveform,
  Blocks,
  BookOpen,
  Building2,
  Command,
  Frame,
  GalleryVerticalEnd,
  Globe,
  HelpCircle,
  Image,
  LayoutGrid,
  Mail,
  Settings,
  Settings2,
  Users,
  Youtube,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

const NAVIGATION_CONFIG = {
  COMMON: {
    POPUPLIST: {
      title: "PopUp List",
      url: "/popup-list",
      icon: LayoutGrid,
      isActive: false,
    },
    BANNERLIST: {
      title: "Banner",
      url: "/banner-list",
      icon: Image,
      isActive: false,
    },
    COMPANYLIST: {
      title: "Company",
      url: "/company-list",
      icon: Building2,
      isActive: false,
    },
    COUNTRYLIST: {
      title: "Country List",
      url: "/country-list",
      icon: Globe,
      isActive: false,
    },
    NEWSLETTERLIST: {
      title: "Newsletter List",
      url: "/newsletter-list",
      icon: Mail,
      isActive: false,
    },
    LECTUREYOUTUBELIST: {
      title: "Lecture Youtube",
      url: "/lecture-youtube",
      icon: Youtube,
      isActive: false,
    },
    STUDENTLIST: {
      title: "Student List",
      url: "/student-list",
      icon: Users,
      isActive: false,
    },
    FAQLIST: {
      title: "FAQ",
      url: "/faq-list",
      icon: HelpCircle,
      isActive: false,
    },
    BLOGLIST: {
      title: "Blog",
      url: "/blog-list",
      icon: BookOpen,
      isActive: false,
    },
    SETTINGS: {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      isActive: false,
    },
    GALLERYLIST: {
      title: "Gallery",
      url: "/gallery-list",
      icon: Frame,
      isActive: false,
    },
  },

  REPORTS: {
    SETTINGS: {
      title: "Settings",
      url: "/settings",
      icon: Blocks,
      isActive: false,
    },
  },
};

const USER_ROLE_PERMISSIONS = {
  1: {
    navMain: [
      // "POPUPLIST",
      // "BANNERLIST",
      "COMPANYLIST",
      "COUNTRYLIST",
      // "LETUREYOUTUBELIST",
      "STUDENTLIST",
      // "NEWSLETTERLIST",
      // "FAQLIST",
      // "GALLERYLIST",
      "BLOGLIST",
      // "SETTINGS",
    ],
    navMainReport: ["SUMMARY", "DOWNLOADS", "OTHER", "SETTINGS"],
  },

  2: {
    navMain: [
      "DASHBOARD",
      "POPUPLIST",
      "BANNERLIST",
      "COMPANYLIST",
      "COUNTRYLIST",
      "LETUREYOUTUBELIST",
      "STUDENTLIST",
      "NEWSLETTERLIST",
      "MEMBERSHIP",
      "DONOR",
      "RECEIPT",
      "SCHOOL",
      "FAQLIST",
      "BLOGLIST",
    ],
    navMainReport: ["SUMMARY", "DOWNLOADS", "OTHER", "SETTINGS"],
  },

  3: {
    navMain: [
      "DASHBOARD",
      "POPUPLIST",
      "BANNERLIST",
      "COMPANYLIST",
      "COUNTRYLIST",
      "LETUREYOUTUBELIST",
      "STUDENTLIST",
      "NEWSLETTERLIST",
      "MEMBERSHIP",
      "DONOR",
      "RECEIPT",
      "SCHOOL",
      "FAQLIST",
      "BLOGLIST",
    ],
    navMainReport: ["SUMMARY", "DOWNLOADS", "OTHER", "SETTINGS"],
  },

  4: {
    navMain: [
      "DASHBOARD",
      "POPUPLIST",
      "BANNERLIST",
      "COMPANYLIST",
      "COUNTRYLIST",
      "LETUREYOUTUBELIST",
      "STUDENTLIST",
      "NEWSLETTERLIST",
      "MEMBERSHIP",
      "DONOR",
      "RECEIPT",
      "SCHOOL",
      "FAQLIST",
      "BLOGLIST",
    ],
    navMainReport: ["SUMMARY", "DOWNLOADS", "OTHER", "SETTINGS"],
  },

  // 5: {
  //   navMain: ["DASHBOARD", "CHAPTER"],
  //   navMainReport: [
  //     "SETTINGS",
  //     "RECEIPT_ZERO",
  //     "RECEIPT_CHANGE_DONOR",
  //     "RECEIPT_MULTIPLE",
  //     "FOLDER",
  //     "MULTIALLOTMENT",
  //   ],
  // },
};

const LIMITED_MASTER_SETTINGS = {
  title: "Master Settings",
  url: "#",
  isActive: false,
  icon: Settings2,
  items: [
    {
      title: "Chapters",
      url: "/master/chapter",
    },
  ],
};

const useNavigationData = (userType) => {
  return useMemo(() => {
    const permissions =
      USER_ROLE_PERMISSIONS[userType] || USER_ROLE_PERMISSIONS[1];

    const buildNavItems = (permissionKeys, config, customItems = {}) => {
      return permissionKeys
        .map((key) => {
          if (key === "MASTER_SETTINGS_LIMITED") {
            return LIMITED_MASTER_SETTINGS;
          }
          return config[key];
        })
        .filter(Boolean);
    };

    const navMain = buildNavItems(
      permissions.navMain,
      // { ...NAVIGATION_CONFIG.COMMON, ...NAVIGATION_CONFIG.MODULES },
      { ...NAVIGATION_CONFIG.COMMON }
      // { MASTER_SETTINGS_LIMITED: LIMITED_MASTER_SETTINGS }
    );

    // const navMainReport = buildNavItems(
    //   permissions.navMainReport,
    //   NAVIGATION_CONFIG.REPORTS
    // );

    return { navMain };
  }, [userType]);
};

const TEAMS_CONFIG = [
  {
    name: "AIA",
    logo: GalleryVerticalEnd,
    plan: "",
  },
  {
    name: "Acme Corp.",
    logo: AudioWaveform,
    plan: "Startup",
  },
  {
    name: "Evil Corp.",
    logo: Command,
    plan: "Free",
  },
];

export function AppSidebar({ ...props }) {
  const [openItem, setOpenItem] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const { navMain, navMainReport } = useNavigationData(user?.user_type);
  const initialData = {
    user: {
      name: user?.name || "User",
      email: user?.email || "user@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: TEAMS_CONFIG,
    navMain,
    navMainReport,
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={initialData.teams} />
      </SidebarHeader>
      <SidebarContent className="sidebar-content">
        <NavMain
          items={initialData.navMain}
          openItem={openItem}
          setOpenItem={setOpenItem}
        />
        {/* <NavMainReport
          items={initialData.navMainReport}
          openItem={openItem}
          setOpenItem={setOpenItem}
        /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={initialData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export { NAVIGATION_CONFIG, USER_ROLE_PERMISSIONS };

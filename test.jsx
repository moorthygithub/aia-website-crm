import React from "react";
import {
  User,
  BookOpen,
  Building2,
  Mail,
  Settings,
  Users,
  Code,
} from "lucide-react";

const headerIcons = {
  user: User,
  student: BookOpen,
  company: Building2,
  email: Mail,
  settings: Settings,
  team: Users,
  project: Code,
};

const PageHeader = ({
  icon = "user",
  title = "Page Title",
  description = "Add a description here",
  bgColor = "from-blue-50 to-blue-100",
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-600",
}) => {
  const IconComponent = headerIcons[icon] || User;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${bgColor} p-8 mb-8 border border-white/50 shadow-sm`}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/30 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-1/2 w-60 h-60 bg-white/20 rounded-full blur-3xl -ml-30 -mb-20"></div>

      {/* Content */}
      <div className="relative z-10 flex items-start gap-4">
        {/* Icon Container */}
        <div
          className={`p-3.5 rounded-xl ${iconBgColor} flex-shrink-0 shadow-sm`}
        >
          <IconComponent className={`w-6 h-6 ${iconColor}`} />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Demo Component
const Demo = () => {
  const examples = [
    {
      icon: "company",
      title: "Add New Company",
      description: "Fill in the details below to create a new company profile",
      bgColor: "from-blue-50 to-blue-100",
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: "student",
      title: "Add New Student",
      description:
        "Fill in the student details below to register them in the system",
      bgColor: "from-emerald-50 to-emerald-100",
      iconBgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      icon: "email",
      title: "Contact Support",
      description: "Get in touch with our support team for assistance",
      bgColor: "from-purple-50 to-purple-100",
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: "team",
      title: "Manage Team Members",
      description: "Add, edit, or remove team members from your organization",
      bgColor: "from-orange-50 to-orange-100",
      iconBgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      icon: "settings",
      title: "Settings",
      description: "Configure your preferences and account settings",
      bgColor: "from-pink-50 to-pink-100",
      iconBgColor: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      icon: "project",
      title: "Create New Project",
      description: "Start a new project and begin collaborating with your team",
      bgColor: "from-indigo-50 to-indigo-100",
      iconBgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Page Header Component
          </h2>
          <p className="text-gray-600">
            Clean and elegant header component with multiple color variants
          </p>
        </div>

        <div className="space-y-6">
          {examples.map((example, index) => (
            <PageHeader
              key={index}
              icon={example.icon}
              title={example.title}
              description={example.description}
              bgColor={example.bgColor}
              iconBgColor={example.iconBgColor}
              iconColor={example.iconColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Demo;

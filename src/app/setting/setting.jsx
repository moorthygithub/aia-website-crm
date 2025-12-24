import { useTheme } from "@/lib/theme-context";

const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-2 max-w-6xl mx-auto ">
      <div className="">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Theme Color
        </p>
        <div className="flex gap-2 flex-wrap">
          {["default", "yellow", "green", "purple", "teal", "gray"].map(
            (color) => {
              const colorsMap = {
                default: "bg-blue-600",
                yellow: "bg-yellow-500",
                green: "bg-green-600",
                purple: "bg-purple-600",
                teal: "bg-teal-600",
                gray: "bg-gray-600",
              };
              const isActive = theme === color;
              return (
                <button
                  key={color}
                  onClick={() => setTheme(color)}
                  className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200
                      ${colorsMap[color]} 
                      ${
                        isActive
                          ? "shadow-md ring-1 ring-offset-1 ring-blue-400 scale-110"
                          : "opacity-80 hover:opacity-100"
                      }`}
                >
                  {isActive && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

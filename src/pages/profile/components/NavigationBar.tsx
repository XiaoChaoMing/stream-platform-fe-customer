import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { memo } from "react";
import { KeyRound, User, CreditCard } from "lucide-react";

const NavigationBar = memo(() => {
  const { t } = useTranslation();
  
  // Define navigation items for the profile
  const navItems = [
    { label: t('Profile'), path: "/profile", icon: <User /> },
    { label: t('Account'), path: "/profile/account", icon: <KeyRound /> },
    { label: t('Payment'), path: "/profile/payment", icon: <CreditCard /> },
  ];

  return (
    <div className="flex flex-col h-fit">
      {/* Navigation bar */}
      <div className="sm:flex sm:flex-col sm:items-start w-fit block items-center pb-1 px-4 sm:mt-4 mt-0 overflow-x-auto">
        {navItems.map(item => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === "/profile"}
            className={({ isActive }) => 
              `flex gap-3 px-5 py-2 w-full min-w-[200px] text-start text-muted-foreground hover:text-foreground font-medium rounded-md transition-colors ${
                isActive 
                  ? "bg-purple-500 text-white border-b-2 border-accent" 
                  : "hover:bg-secondary/50"
              }`
            }
          >
            {item.icon}
            <h1 className="text-md">{item.label}</h1>
          </NavLink>
        ))}
      </div>
    </div>
  );
});

NavigationBar.displayName = "NavigationBar";

export default NavigationBar;

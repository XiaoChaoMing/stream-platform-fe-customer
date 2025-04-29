import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation();
  
  // Define navigation items for the following page
  const navItems = [
    { label: t('Overview'), path: "" },
    { label: t('Live'), path: "/live" },
    { label: t('Videos'), path: "/videos" },
    { label: t('Categories'), path: "/categories" },
    { label: t('Channels'), path: "/channels" },
  ];

  return (
    <div className="flex flex-col items-start gap-3">
      <h1 className="text-4xl font-bold px-4">Following</h1> 
      {/* Navigation bar */}
      
    </div>
  );
};

export default Header;

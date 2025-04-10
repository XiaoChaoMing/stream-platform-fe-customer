import SideBar from "@/components/app/sidebar/SideBar";
import Header from "../components/app/header/header";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout(props: Props) {
  const { children } = props;
  return (
    <div className="wrapper d-flex align-items-stretch">
      <main className="flex min-h-screen flex-col overflow-hidden">
        <Header />
        <div className="relative top-15 flex h-full flex-1 flex-row gap-1">
          <SideBar />
          <div className="content mt-3 w-full overflow-hidden p-3">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

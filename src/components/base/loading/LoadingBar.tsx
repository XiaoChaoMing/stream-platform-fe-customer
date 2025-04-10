import { useStore } from "../../../store";

type Props = {};

const LoadingBar = (_props: Props) => {
  const show = useStore((state) => state.show);

  return show ? (
    <div className="absolute z-[9999] flex h-full w-full flex-row items-center justify-center bg-[var(--color-100)] opacity-50">
      <div>loading...</div>
    </div>
  ) : null;
};

export default LoadingBar;

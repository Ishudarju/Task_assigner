import Header from "@/components/Header";
import Sidebars from "@/components/Sidebars";

const Mainlayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="flex justify-between">
        <div className="hidden md:block h-[100vh] w-[300px]">
          <Sidebars />
        </div>
        <div className="p-5 xl w-screen">{children}</div>
      </div>
    </>
  );
};

export default Mainlayout;

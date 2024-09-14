import Header from "@/components/Header";
import Sidebars from "@/components/Sidebars";



const Mainlayout = ({ children }) => {
  
  return (
    <>
      <Header />
      <div className="flex">
        <div className="hidden md:block h-[100vh] w-[300px]">
          <Sidebars />
        </div>
        <div className="p-5 w-screen md:max-w-[1140px]">{children}</div>
      </div>
    </>
  );
};

export default Mainlayout;

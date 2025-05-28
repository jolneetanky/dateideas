import Sidebar from "./Sidebar";

const NavBar = ({ className }: { className?: string }) => {
  return (
    <div className={`w-full px-[2%] ${className}`}>
      <div className="flex items-center h-full">
        <Sidebar />
      </div>
    </div>
  );
};

export default NavBar;

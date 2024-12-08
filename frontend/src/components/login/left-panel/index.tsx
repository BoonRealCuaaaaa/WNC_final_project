import { Command } from "react-bootstrap-icons";

const LeftPanel = (props) => {
   return (
      <div className={`bg-[#18181B] flex flex-col p-10 justify-between text-white h-full ${props.className}`}>
         <div className="space-y-2">
            <p className="text-lg font-thin">Đồ án WEB nâng cao</p>
            <p className="text-5xl font-bold">INTERNET BANKING</p>
         </div>
         <div className="flex flex-row items-center space-x-3">
            <Command className="text-2xl text-white font-black" />
            <p className="text-lg">Nhóm 7</p>
         </div>
      </div>
   );
};

export default LeftPanel;

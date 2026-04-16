import Title from "../components/Title";
import AddNote from "../components/AddNote";

const LeftHome = () => {
  return (
    <div className="w-full lg:w-1/2 flex flex-col items-center justify-start overflow-auto bg-white shadow-xl">
      <Title />
      <AddNote />
    </div>
  );
};

export default LeftHome;

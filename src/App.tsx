import "./index.css";
import { Toaster } from "./components/ui/sonner";
import { Settings } from "./components/Settings";
import { useEffect, useState } from "react";
import SettingsModal from "./components/SettingsModal";
import { MainProvider } from "./context/MainContext";
import { isFirstLoad } from "./lib/utils";
import ResponseCheck from "./components/ResponseCheck";
import Footer from "./components/Footer";


export function App() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isFirstLoad()) setShowModal(true);
  }, []);
  
  return (
    <MainProvider >
    <div className="min-h-screen mx-auto p-8  xl:w-5xl lg:w-4xl md:w-3xl sm:w-2xl flex flex-col">
      <Settings clickHandler={() => setShowModal((prev) => !prev)}/>
      {showModal && <SettingsModal closeAction={() => setShowModal(false)} />}
        <ResponseCheck />
      <Toaster richColors/>
    <Footer />
    </div>
    </MainProvider>
  );
}

export default App;

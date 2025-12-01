// /client/src/pages/ThirdPartyPage.jsx

import React from "react";
import ThirdParty from "../components/ThirdParty";

const ThirdPartyPage = () => {
  return (
    <div className="w-full h-full p-6 overflow-y-auto">
      <h1 className="text-2xl font-semibold mb-4">Third Party API Demo</h1>
      <ThirdParty />
    </div>
  );
};

export default ThirdPartyPage;

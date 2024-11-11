"use client";

import { useUserStore } from "@/store/userStore";
import { StompSessionProvider } from "react-stomp-hooks";
import Subscribing from "../subscribing";

const StompProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useUserStore((state) => state.user);

  if (user.isActive) {
    return (
      <StompSessionProvider
        url={process.env.NEXT_PUBLIC_WEBSOCKET_BACKEND_URL!}
        //All options supported by @stomp/stompjs can be used here
      >
        <Subscribing />
        {children}
      </StompSessionProvider>
    );
  }

  if (!user.isActive) {
    return <>{children}</>;
  }
};
export default StompProvider;

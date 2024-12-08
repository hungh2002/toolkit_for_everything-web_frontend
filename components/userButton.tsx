"use client";

import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const UserButton = ({ showUserName }: { showUserName: boolean }) => {
  const user = useUserStore((state) => state);
  const updateUser = useUserStore((state) => state.update);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      updateUser.signIn(JSON.parse(localStorage.getItem("user")!));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.isActive]);

  if (user.isActive) {
    return (
      <button onClick={() => updateUser.userTableIsOpen(true)}>
        <label className="flex flex-row">
          <Avatar className="flex flex-row align-middle ">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>${user.userName}</AvatarFallback>
          </Avatar>
          <span className="w-full m-auto dark:text-slate-300">
            {showUserName ? user.userName : ""}
          </span>
        </label>
      </button>
    );
  }

  return (
    <Button onClick={() => updateUser.userTableIsOpen(true)}>
      <h1 className="dark:text-slate-300">Sign in</h1>
    </Button>
  );
};
export default UserButton;

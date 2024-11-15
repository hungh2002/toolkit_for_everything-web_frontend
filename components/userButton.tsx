"use client";

import { User, useUserStore } from "@/store/userStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FormEvent, useEffect } from "react";
import { axios } from "@/config/axios";
import UserAvatar from "./avatar";

const UserButton = () => {
  const user = useUserStore((state) => state.user);
  const signIn = useUserStore((state) => state.signIn);

  const onSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const { status, data } = await axios.post<User>(`/sign-in`, {
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (status == 200) {
      signIn(data);
      localStorage.setItem("user", JSON.stringify(data));
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      signIn(JSON.parse(localStorage.getItem("user")!));
    }
  }, []);

  if (user.isActive) {
    return <UserAvatar />;
  }

  if (!user.isActive) {
    return (
      <Dialog>
        <DialogTrigger>Sign In</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>SIGN IN</DialogTitle>
            <DialogDescription>
              <Link href="/sign-up">sign up</Link>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSignIn}>
            <Label htmlFor="emaiil">Email: </Label>
            <Input id="email" name="email" placeholder="Enter your emai." />

            <Label htmlFor="password">Password: </Label>
            <Input
              id="password"
              name="password"
              placeholder="Enter your password"
            />
            <br />
            <Button type="submit">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
};
export default UserButton;

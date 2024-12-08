"use client";

import { useUserStore } from "@/store/userStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import SignInForm from "./signInForm";
import SignUpForm from "./signUpForm";
import { Card, CardFooter } from "./ui/card";
import { X } from "lucide-react";

const UserTable = () => {
  const user = useUserStore((state) => state);
  const updateUser = useUserStore((state) => state.update);

  if (!user.userTableIsOpen) {
    return <></>;
  }

  if (user.isActive) {
    return (
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <div className="flex flex-row-reverse">
              <Button
                variant="secondary"
                onClick={() => updateUser.userTableIsOpen(false)}
              >
                <X color="#cbd5e1" />
              </Button>
            </div>
            <CardFooter>
              <Button variant="secondary" onClick={updateUser.signOut}>
                Sign out
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    );
  }

  return (
    <Tabs defaultValue="sign-in" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="sign-in">Sign in</TabsTrigger>
        <TabsTrigger value="sign-up">Sign up</TabsTrigger>
      </TabsList>
      <TabsContent value="sign-in">
        <SignInForm />
      </TabsContent>
      <TabsContent value="sign-up">
        <SignUpForm />
      </TabsContent>
    </Tabs>
  );
};
export default UserTable;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axios } from "@/config/axios";
import { User, useUserStore } from "@/store/userStore";
import { FormEvent } from "react";

const SignUp = () => {
  const signIn = useUserStore((state) => state.signIn);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const { status } = await axios.post(`/sign-up`, formData);

    if (status == 200) {
      const signInResponse = await axios.post<User>(`/sign-up`, {
        email: formData.get("email"),
        password: formData.get("password"),
      });

      if (signInResponse.status == 200) {
        signIn(signInResponse.data);
        localStorage.setItem("user", JSON.stringify(signInResponse.data));
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Label htmlFor="emaiil">Email: </Label>
      <Input id="email" name="email" placeholder="Enter your emai." />

      <Label htmlFor="password">Password: </Label>
      <Input id="password" name="password" placeholder="Enter your password" />
      <br />
      <Button type="submit">Submit</Button>
    </form>
  );
};
export default SignUp;

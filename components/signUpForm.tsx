import { axios } from "@/config/axios";
import { useUserStore } from "@/store/userStore";
import { FormEvent } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { X } from "lucide-react";

const SignUpForm = () => {
  const updateUser = useUserStore((state) => state.update);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const { status } = await axios.post(`/sign-up`, formData);

    if (status == 200) {
      const signInResponse = await axios.post(`/sign-in`, {
        email: formData.get("email"),
        password: formData.get("password"),
      });

      if (signInResponse.status == 200) {
        updateUser.signIn(signInResponse.data);
      }
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <Card>
        <div className="flex flex-row-reverse">
          <Button onClick={() => updateUser.userTableIsOpen(false)}>
            <X />
          </Button>
        </div>
        <CardContent>
          <Label>
            Email: <Input name="email" placeholder="Enter your email." />
          </Label>

          <Label>
            Password:
            <Input name="password" placeholder="Enter your password" />
          </Label>
        </CardContent>
        <CardFooter>
          <Button type="submit">Submit</Button>
        </CardFooter>
      </Card>
    </form>
  );
};
export default SignUpForm;

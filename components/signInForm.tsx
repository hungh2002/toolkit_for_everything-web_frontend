import { FormEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { axios } from "@/config/axios";
import { useUserStore } from "@/store/userStore";
import { Card, CardContent, CardFooter } from "./ui/card";
import { X } from "lucide-react";

const SignInForm = () => {
  const updateUser = useUserStore((state) => state.update);

  const onSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const { status, data } = await axios.post(`/sign-in`, {
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (status == 200) {
      updateUser.signIn(data);
    }
  };

  return (
    <form onSubmit={onSignIn}>
      <Card>
        <div className="flex flex-row-reverse">
          <Button
            variant="secondary"
            onClick={() => updateUser.userTableIsOpen(false)}
          >
            <X color="#cbd5e1" />
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
          <Button variant="secondary" type="submit">
            Submit
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
export default SignInForm;

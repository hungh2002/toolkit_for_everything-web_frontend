import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useUserStore } from "@/store/userStore";
import { Button } from "./ui/button";

const UserAvatar = () => {
  const user = useUserStore((state) => state.user);
  const signOut = useUserStore((state) => state.signOut);

  return (
    <Popover>
      <PopoverTrigger>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>USER</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent>
        <Button onClick={signOut}>Sign out</Button>
      </PopoverContent>
    </Popover>
  );
};
export default UserAvatar;

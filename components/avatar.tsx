import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useUserStore } from "@/store/userStore";

const UserAvatar = () => {
  const user = useUserStore((state) => state.user);
  return (
    <Popover>
      <PopoverTrigger>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>USER</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent>{user.userId}</PopoverContent>
    </Popover>
  );
};
export default UserAvatar;

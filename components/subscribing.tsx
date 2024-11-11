import { Channel } from "@/config/type";
import { useUserStore } from "@/store/userStore";
import { useSubscription } from "react-stomp-hooks";

const Subscribing = () => {
  const user = useUserStore((state) => state.user);

  useSubscription(
    `${Channel.TOPIC}/${Channel.ROOM}/${user.id}/${Channel.PAINT}`,
    (message) => console.log(message.body)
  );

  return <></>;
};
export default Subscribing;

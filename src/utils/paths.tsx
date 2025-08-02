import House from "../assets/house.svg";
import Cross from "../assets/cross.svg";
import Connect from "../assets/connect.svg";
import Card from "../assets/card.svg";

export const paths = () => ({
  paths: [
    {
      path: "/",
      text: "navigation.dashboard",
      deepBlueBackground: true,
      Icon: <img src={House} />,
    },
    {
      path: "/new_process",
      text: "navigation.new_process",
      deepBlueBackground: true,
      Icon: <img src={Cross} />,
    },
    {
      path: "/my_actions",
      text: "navigation.my_actions",
      deepBlueBackground: true,
      Icon: <img src={Card} />,
    },
    {
      path: "/my_requests",
      text: "navigation.my_requests",
      deepBlueBackground: true,
      Icon: <img src={Connect} />,
    },
  ],
});

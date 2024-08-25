import { useNavigate } from "react-router-dom";

const useRouter = () => {
  const navigate = useNavigate();

  const goToSearch = () => {
    navigate("/search");
  };
  const goToChat = () => {
    navigate("/chat");
  };
  const goToAlarm = () => {
    navigate("/alarm");
  };
  const goToSignup = () => {
    navigate("/signup");
  };
  const goTologin = () => {
    navigate("/login");
  };
  const goToResetPW = () => {
    navigate("/resetPW");
  };
  const goToSetting = () => {
    navigate("/setting");
  };
  const goToProfileMe = () => {
    navigate("/profile");
  };
  const goToTwofactor = () => {
    navigate("/twoFactor");
  };
  const goToMain = () => {
    navigate("/main");
  };
  const goToProfileUserClick = (nickname: string) => {
    navigate(`/profile?username=${nickname}`);
  };

  return {
    goToSearch,
    goToChat,
    goToAlarm,
    goToSignup,
    goTologin,
    goToResetPW,
    goToProfileMe,
    goToProfileUserClick,
    goToSetting,
    goToMain,
    goToTwofactor,
  };
};

export default useRouter;

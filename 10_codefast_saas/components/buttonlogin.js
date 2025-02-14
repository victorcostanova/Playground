import Link from "next/link";

const ButtonLogin = ({ isLoggedIn, name }) => {
  if (isLoggedIn) {
    return <Link href="/dashboard">Welcome back, {name}</Link>;
  }
  return <button>Login</button>;
};

export default ButtonLogin;

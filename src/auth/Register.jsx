import { useNavigate, Link } from "react-router";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { RiAccountPinCircleFill } from "react-icons/ri";
import { PasswordInput, Input, Button, Stack } from "@mantine/core";
import { MdAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { FaUserAlt } from "react-icons/fa";
import { useDisclosure } from "@mantine/hooks";

function Register() {
  const API = "https://68f8eaf7deff18f212b80afe.mockapi.io/Users";
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [visible, { toggle }] = useDisclosure(false);

  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (!user.username) {
      toast.error("Please fill in Username field", { duration: 1500 });
      return;
    }
    if (!user.email) {
      toast.error("Please fill in Email field", { duration: 1500 });
      return;
    }
    if (!user.password) {
      toast.error("Please fill in Password field", { duration: 1500 });
      return;
    }
    if (!user.confirmPassword) {
      toast.error("Please fill in Confirm Password field", { duration: 1500 });
      return;
    }
    if (user.username.length < 3) {
      toast.error("Username must be at least 3 characters long", {
        duration: 1500,
      });
      return;
    }
    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match", { duration: 1500 });
      return;
    }
    if (user.password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        duration: 1500,
      });
      return;
    }
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(user.email)) {
      toast.error("Please enter a valid email address", {
        duration: 1500,
      });
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(API);
      const existingUsers = response.data;
      const userExists = existingUsers.some(
        (existingUser) => existingUser.username === user.username
      );
      const emailExists = existingUsers.some(
        (existingUser) => existingUser.email === user.email
      );
      if (userExists) {
        toast.error("Username already exists", { duration: 1500 });
        setLoading(false);
        return;
      }
      if (emailExists) {
        toast.error("Email already registered", { duration: 1500 });
        setLoading(false);
        return;
      }
      await axios.post(API, {
        username: user.username,
        email: user.email.toLocaleLowerCase(),
        password: user.password,
        role: "member",
        createAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast.success("Registration successful", { duration: 1500 });
      setLoading(false);
      localStorage.setItem("username", user.username);
      localStorage.setItem("email", user.email);
      localStorage.setItem("role", user.role);
      localStorage.setItem("id", user.id);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Toaster position="top-center" />
      <div className="flex flex-col md:flex-row items-center justify-center h-screen">
        <div className="hidden md:flex flex-col gap-y-5 items-center justify-center bg-gradient-to-bl from-sky-400 to-sky-600 text-white h-full w-1/2 rounded-r-4xl">
          <h1 className="lg:text-2xl 2xl:text-3xl">Welcome</h1>
          <p className="text-center lg:text-xl 2xl:text-2xl w-3/4">
            Create an account to get started!
          </p>
        </div>
        <div className="flex flex-col items-center justify-center bg-white h-full w-1/2">
          <div className="flex flex-col items-center  p-5 gap-5 md:px-10 rounded-xl shadow-md">
            <div className="flex flex-col items-center bg-gradient-to-br from-sky-400 to-sky-600 rounded-full">
              <RiAccountPinCircleFill className="text-6xl p-2 text-neutral-50" />
            </div>
            <h1 className="text-xl font-medium">Register</h1>
            <div className="flex flex-col items-center gap-3">
              <Input
                placeholder="Your Username"
                value={user.username}
                onChange={(e) =>
                  setUser({ ...user, username: e.target.value.trim() })
                }
                leftSection={<FaUserAlt size={14} />}
                variant="filled"
                radius="md"
                size="md"
                className="w-72"
              />{" "}
              <Input
                placeholder="Your email"
                value={user.email}
                onChange={(e) =>
                  setUser({ ...user, email: e.target.value.trim() })
                }
                leftSection={<MdAlternateEmail size={16} />}
                variant="filled"
                radius="md"
                size="md"
                className="w-72"
              />
              <Stack>
                <PasswordInput
                  placeholder="Password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value.trim() })
                  }
                  leftSection={<TbLockPassword size={16} />}
                  visible={visible}
                  onVisibilityChange={toggle}
                  variant="filled"
                  radius="md"
                  size="md"
                  className="w-72"
                />
                <PasswordInput
                  placeholder="Confirm password"
                  value={user.confirmPassword}
                  onChange={(e) =>
                    setUser({ ...user, confirmPassword: e.target.value.trim() })
                  }
                  leftSection={<TbLockPassword size={16} />}
                  visible={visible}
                  onVisibilityChange={toggle}
                  variant="filled"
                  radius="md"
                  size="md"
                  className="w-72"
                />
              </Stack>
              <p className="text-sm text-gray-500">
                already have an account?{" "}
                <Link
                  className="hover:underline cursor-pointer hover:text-sky-600"
                  to="/login"
                >
                  Login
                </Link>
              </p>
              <Button
                variant="filled"
                radius="md"
                size="compact-lg"
                onClick={handleSubmit}
                loading={loading}
                loaderProps={{ type: "dots" }}
                fullWidth={true}
                style={{ width: "50%" }}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;

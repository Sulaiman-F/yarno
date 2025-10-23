import React from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import { useNavigate, Link } from "react-router";
import { useState } from "react";
import { RiAccountPinCircleFill } from "react-icons/ri";
import { PasswordInput, Input, Button } from "@mantine/core";
import { MdAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";

function Login() {
  const API = "https://68f8eaf7deff18f212b80afe.mockapi.io/Users";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    if (!user.email) {
      toast.error("Email is required", { duration: 1500 });
      return;
    }
    if (!user.password) {
      toast.error("Password is required", { duration: 1500 });
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(API);
      const users = response.data;
      const foundEmail = users.find(
        (u) => u.email === user.email.toLocaleLowerCase()
      );
      if (!foundEmail) {
        toast.error("Email not found please register", { duration: 1500 });
        setLoading(false);
        return;
      }
      const correctPassword = foundEmail.password === user.password;
      if (!correctPassword) {
        toast.error("Incorrect password", { duration: 1500 });
        setLoading(false);
        return;
      }
      localStorage.setItem("username", foundEmail.username);
      localStorage.setItem("email", foundEmail.email);
      localStorage.setItem("role", foundEmail.role);
      localStorage.setItem("id", foundEmail.id);
      toast.success("Login successful", { duration: 1500 });
      setLoading(false);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Toaster position="top-center" />
      <div className="flex flex-col md:flex-row items-center justify-center h-screen ">
        <div className="hidden lg:flex flex-col gap-y-5 items-center justify-center bg-gradient-to-br from-sky-400 to-sky-600 text-white h-full w-1/2 rounded-r-4xl">
          <h1 className="lg:text-2xl 2xl:text-3xl">Welcome back!</h1>
          <p className="text-center lg:text-xl 2xl:text-2xl w-3/4">
            Please enter your email and password to access your account.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center bg-white h-full w-1/2">
          <div className="flex flex-col items-center  p-5 gap-5 md:px-10 rounded-xl shadow-md">
            <div className="flex flex-col items-center bg-gradient-to-br from-sky-400 to-sky-600 rounded-full">
              <RiAccountPinCircleFill className="text-6xl p-2 text-neutral-50" />
            </div>
            <h1 className="text-xl font-medium">Login</h1>

            <div className="flex flex-col items-center gap-3">
              <Input
                placeholder="Your email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                leftSection={<MdAlternateEmail size={16} />}
                variant="filled"
                radius="md"
                size="md"
                className="w-72"
              />

              <PasswordInput
                placeholder="Password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                leftSection={<TbLockPassword size={16} />}
                variant="filled"
                radius="md"
                size="md"
                className="w-72"
              />

              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  className="hover:underline cursor-pointer hover:text-sky-600"
                  to="/register"
                >
                  Register
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
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

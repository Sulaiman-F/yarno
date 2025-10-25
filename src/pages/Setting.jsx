import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Avatar,
  Text,
  Group,
  Stack,
  Skeleton,
  Button,
  Modal,
  Input,
  PasswordInput,
} from "@mantine/core";
import {
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaCalendarAlt,
  FaUserAlt,
} from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useDisclosure } from "@mantine/hooks";
import { u } from "motion/react-client";

function Setting() {
  const API_Users = "https://68f8eaf7deff18f212b80afe.mockapi.io/Users";
  const API_Activities =
    "https://68f8eaf7deff18f212b80afe.mockapi.io/Activities";
  const [usersData, setUsersData] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [
    editUserModalOpened,
    { open: openEditUserModal, close: closeEditUserModal },
  ] = useDisclosure(false);
  const [editingUser, setEditingUser] = useState({});
  const [visible, { toggle }] = useDisclosure(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_Users}`);
      setUsersData(response.data);
      const currentUserId = localStorage.getItem("id");
      const currentUser = response.data.find(
        (user) => user.id === currentUserId
      );
      setUserProfile(currentUser);
      setLoadingProfile(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditModal = () => {
    setEditingUser({
      username: "",
      email: "",
      oldPassword: "",
      password: "",
      confirmPassword: "",
    });
    openEditUserModal();
  };

  const handleEditUser = async () => {
    if (editingUser.username && editingUser.username.length < 3) {
      toast.error("Username must be at least 3 characters long", {
        duration: 1500,
      });
      return;
    }
    if (
      editingUser.email &&
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
        editingUser.email
      )
    ) {
      toast.error("Please enter a valid email address", {
        duration: 1500,
      });
      return;
    }
    if (editingUser.password && editingUser.password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        duration: 1500,
      });
      return;
    }
    if (
      editingUser.password &&
      editingUser.password !== editingUser.confirmPassword
    ) {
      toast.error("Passwords do not match", { duration: 1500 });
      return;
    }

    try {
      const updateData = {};
      const descriptionParts = [];

      if (editingUser.username?.trim()) {
        updateData.username = editingUser.username;
        const userExists = usersData.find(
          (existingUser) =>
            existingUser.username === updateData.username.toLocaleLowerCase()
        );
        if (userExists) {
          toast.error("Username already exists", { duration: 1500 });
          return;
        }
        descriptionParts.push(`Username changed to ${editingUser.username}`);
      }
      if (editingUser.email?.trim()) {
        updateData.email = editingUser.email.toLowerCase();
        const emailExists = usersData.find(
          (existingUser) =>
            existingUser.email === updateData.email.toLocaleLowerCase()
        );
        if (emailExists) {
          toast.error("Email already registered", { duration: 1500 });
          return;
        }
        descriptionParts.push(`Email changed to ${editingUser.email}`);
      }

      if (editingUser.password?.trim()) {
        if (userProfile.password !== editingUser.oldPassword) {
          toast.error("old password is incorrect", { duration: 1500 });
          return;
        }
        updateData.password = editingUser.password;
        descriptionParts.push(`Password updated`);
      }

      updateData.updatedAt = new Date().toISOString();

      const currentUserId = localStorage.getItem("id");

      await axios.put(`${API_Users}/${currentUserId}`, updateData);

      if (updateData.username) {
        localStorage.setItem("username", updateData.username);
      }
      if (updateData.email) {
        localStorage.setItem("email", updateData.email);
      }
      const description = `User ${
        editingUser.username
      } updated: ${descriptionParts.join(", ")}`;
      await axios.post(API_Activities, {
        userId: localStorage.getItem("id"),
        action: "update",
        description: description,
        by:
          localStorage.getItem("username") +
          " (" +
          localStorage.getItem("role") +
          ")",
        timestamp: new Date().toISOString(),
      });
      toast.success("Profile updated successfully", { duration: 1500 });

      await fetchUsers();
      closeEditUserModal();
    } catch (err) {
      console.log(err);
      toast.error("Failed to update profile", { duration: 1500 });
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="bg-[#f1f1f1] min-h-screen p-2 flex flex-col gap-5">
        <div className="flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full"
          >
            {loadingProfile ? (
              <div className="flex flex-col justify-center md:justify-start items-center gap-5 md:gap-0 md:flex-row shadow-lg rounded-xl w-full p-6 bg-white ">
                <div className="flex justify-center md:justify-start w-full md:w-1/6">
                  <Skeleton height={120} circle />
                </div>

                <div className="w-full space-y-3">
                  <Skeleton height={16} width="80%" />
                  <Skeleton height={16} width="50%" />
                  <Skeleton height={16} width="40%" />
                  <Skeleton height={16} width="30%" />
                </div>
              </div>
            ) : userProfile ? (
              <div className="flex flex-col justify-center md:justify-start items-center gap-5 md:gap-0 md:flex-row shadow-lg rounded-xl w-full p-6 bg-white ">
                <div className="flex justify-center md:justify-start w-full md:w-1/6">
                  <Avatar size={120} radius="50%" color="blue">
                    {userProfile.username?.charAt(0).toUpperCase()}
                  </Avatar>
                </div>

                <Stack spacing="md" className="w-full md:w-5/6">
                  <Group spacing="sm">
                    <FaEnvelope className="text-gray-600" size={16} />
                    <Text size="md" color="dimmed">
                      Email:
                    </Text>
                    <Text size="md" className="break-all">
                      {userProfile.email}
                    </Text>
                  </Group>

                  <Group spacing="sm">
                    <FaUser className="text-gray-600" size={16} />
                    <Text size="md" color="dimmed">
                      Username:
                    </Text>
                    <Text size="md">{userProfile.username}</Text>
                  </Group>

                  <Group spacing="sm">
                    <FaUserTag className="text-gray-600" size={16} />
                    <Text size="md" color="dimmed">
                      Role:
                    </Text>
                    <Text size="md" className="capitalize">
                      {userProfile.role}
                    </Text>
                  </Group>
                  <div className="flex justify-between w-full">
                    <Group spacing="sm">
                      <FaCalendarAlt className="text-gray-600" size={16} />
                      <Text size="md" color="dimmed">
                        Joined:
                      </Text>
                      <Text size="md">
                        {userProfile.createAt
                          ? new Date(userProfile.createAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "Unknown"}
                      </Text>
                    </Group>
                    <Button color="yellow" onClick={openEditModal}>
                      Edit Profile
                    </Button>
                  </div>
                </Stack>
              </div>
            ) : (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <div className="text-center">
                  <Text color="red" size="md">
                    Failed to load profile information
                  </Text>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
      {/* Edit Modal */}
      <Modal
        opened={editUserModalOpened}
        onClose={closeEditUserModal}
        title="Edit Profile"
      >
        <Stack>
          <Input
            placeholder={`Current: ${userProfile?.username || "Username"}`}
            value={editingUser.username}
            onChange={(e) =>
              setEditingUser({
                ...editingUser,
                username: e.target.value.trim(),
              })
            }
            leftSection={<FaUserAlt size={14} />}
            variant="filled"
            radius="md"
            size="md"
            className="w-full"
          />
          <Input
            placeholder={`Current: ${userProfile?.email || "Email"}`}
            value={editingUser.email}
            onChange={(e) =>
              setEditingUser({ ...editingUser, email: e.target.value.trim() })
            }
            leftSection={<MdAlternateEmail size={16} />}
            variant="filled"
            radius="md"
            size="md"
            className="w-full"
          />
          <PasswordInput
            placeholder="Current Password (for verification)"
            value={editingUser.oldPassword}
            onChange={(e) =>
              setEditingUser({
                ...editingUser,
                oldPassword: e.target.value.trim(),
              })
            }
            leftSection={<TbLockPassword size={16} />}
            visible={visible}
            onVisibilityChange={toggle}
            variant="filled"
            radius="md"
            size="md"
            className="w-full"
          />
          <PasswordInput
            placeholder="New Password"
            value={editingUser.password}
            onChange={(e) =>
              setEditingUser({
                ...editingUser,
                password: e.target.value.trim(),
              })
            }
            leftSection={<TbLockPassword size={16} />}
            visible={visible}
            onVisibilityChange={toggle}
            variant="filled"
            radius="md"
            size="md"
            className="w-full"
          />
          <PasswordInput
            placeholder="Confirm New Password"
            value={editingUser.confirmPassword}
            onChange={(e) =>
              setEditingUser({
                ...editingUser,
                confirmPassword: e.target.value.trim(),
              })
            }
            leftSection={<TbLockPassword size={20} />}
            visible={visible}
            onVisibilityChange={toggle}
            variant="filled"
            radius="md"
            size="md"
            className="w-full"
          />
        </Stack>
        <div className="flex  items-center justify-end pt-5">
          <Button
            variant="filled"
            radius="md"
            size="compact-lg"
            onClick={handleEditUser}
            loaderProps={{ type: "dots" }}
            fullWidth={true}
            style={{ width: "50%" }}
            color="yellow"
          >
            Edit User
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default Setting;

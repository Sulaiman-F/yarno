import React from "react";
import { RiAdminFill } from "react-icons/ri";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import StatCard from "../components/StatCard";
import { MdBarChart } from "react-icons/md";
import {
  Table,
  Pagination,
  Menu,
  Button,
  Input,
  Modal,
  Stack,
  PasswordInput,
  SegmentedControl,
  Tooltip,
  Skeleton,
  ActionIcon,
  Space,
} from "@mantine/core";
import { TbArrowsSort } from "react-icons/tb";
import { IoIosSearch } from "react-icons/io";
import { useDisclosure } from "@mantine/hooks";
import { IoPersonAdd } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import { FaUserAlt, FaUserEdit } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { motion } from "motion/react";

function UsersDetails() {
  const API_Users = "https://68f8eaf7deff18f212b80afe.mockapi.io/Users";
  const API_Activities =
    "https://68f8eaf7deff18f212b80afe.mockapi.io/Activities";
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("oldest");
  const [AddUserModal, { open: openAddUserModal, close: closeAddUserModal }] =
    useDisclosure(false);
  const [
    EditUserModal,
    { open: openEditUserModal, close: closeEditUserModal },
  ] = useDisclosure(false);

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [visible, { toggle }] = useDisclosure(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const usersPerPage = 8;
  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_Users);
      setUsers(response.data);
      setLoadingUsers(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const fetchActivities = async () => {
    try {
      const response = await axios.get(API_Activities);
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
    fetchActivities();
  }, []);
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const getSortedUsers = () => {
    const sortedUsers = [...filteredUsers];
    switch (sortBy) {
      case "username":
        return sortedUsers.sort((a, b) => a.username.localeCompare(b.username));
      case "newest":
        return sortedUsers.sort(
          (a, b) =>
            new Date(b.createAt || b.createdAt || 0) -
            new Date(a.createAt || a.createdAt || 0)
        );
      case "oldest":
        return sortedUsers.sort(
          (a, b) =>
            new Date(a.createAt || a.createdAt || 0) -
            new Date(b.createAt || b.createdAt || 0)
        );
      default:
        return sortedUsers;
    }
  };

  const sortedUsers = getSortedUsers();
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = sortedUsers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    setCurrentPage(1);
  };

  const handleAddUser = async () => {
    if (!newUser.username) {
      toast.error("Please fill in Username field", { duration: 1500 });
      return;
    }
    if (!newUser.email) {
      toast.error("Please fill in Email field", { duration: 1500 });
      return;
    }
    if (!newUser.password) {
      toast.error("Please fill in Password field", { duration: 1500 });
      return;
    }
    if (!newUser.confirmPassword) {
      toast.error("Please fill in Confirm Password field", { duration: 1500 });
      return;
    }
    if (newUser.username.length < 3) {
      toast.error("Username must be at least 3 characters long", {
        duration: 1500,
      });
      return;
    }
    if (newUser.password !== newUser.confirmPassword) {
      toast.error("Passwords do not match", { duration: 1500 });
      return;
    }
    if (newUser.password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        duration: 1500,
      });
      return;
    }
    if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(newUser.email)
    ) {
      toast.error("Please enter a valid email address", {
        duration: 1500,
      });
      return;
    }
    if (!newUser.role) {
      toast.error("Please select a role", { duration: 1500 });
      return;
    }
    try {
      const userExists = users.find(
        (existingUser) =>
          existingUser.username === newUser.username.toLocaleLowerCase()
      );
      const emailExists = users.find(
        (existingUser) =>
          existingUser.email === newUser.email.toLocaleLowerCase()
      );
      if (userExists) {
        toast.error("Username already exists", { duration: 1500 });
        return;
      }
      if (emailExists) {
        toast.error("Email already registered", { duration: 1500 });
        return;
      }
      const response = await axios.post(API_Users, {
        username: newUser.username,
        email: newUser.email.toLocaleLowerCase(),
        password: newUser.password,
        role: newUser.role,
        createAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const by =
        localStorage.getItem("username") +
        " (" +
        localStorage.getItem("role") +
        ")";
      await axios.post(API_Activities, {
        userId: response.data.id,
        action: "create",
        description: `User ${newUser.username} created`,
        by: by,
        timestamp: new Date().toISOString(),
      });

      toast.success("Registration successful", { duration: 1500 });
      setNewUser({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
      await fetchUsers();

      closeAddUserModal();
    } catch (err) {
      console.log(err);
    }
  };
  const handleEditUser = async () => {
    if (!editingUser) return;

    if (newUser.username && newUser.username.length < 3) {
      toast.error("Username must be at least 3 characters long", {
        duration: 1500,
      });
      return;
    }
    if (
      newUser.email &&
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(newUser.email)
    ) {
      toast.error("Please enter a valid email address", {
        duration: 1500,
      });
      return;
    }
    if (newUser.password && newUser.password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        duration: 1500,
      });
      return;
    }
    if (newUser.password && newUser.password !== newUser.confirmPassword) {
      toast.error("Passwords do not match", { duration: 1500 });
      return;
    }
    try {
      const updateData = {};
      const descriptionParts = [];
      if (newUser.username.trim()) {
        updateData.username = newUser.username;
        descriptionParts.push(`username to ${newUser.username}`);
      }
      if (newUser.email.trim()) {
        updateData.email = newUser.email.toLowerCase();
        descriptionParts.push(`email to ${newUser.email}`);
      }
      if (newUser.password.trim()) {
        updateData.password = newUser.password;
        descriptionParts.push(`password to ${newUser.password}`);
      }
      if (newUser.role) {
        updateData.role = newUser.role;
        descriptionParts.push(`role to ${newUser.role}`);
      }

      updateData.updatedAt = new Date().toISOString();

      await axios.put(`${API_Users}/${editingUser.id}`, updateData);

      const by =
        localStorage.getItem("username") +
        " (" +
        localStorage.getItem("role") +
        ")";
      const description = `User ${
        editingUser.username
      } updated: ${descriptionParts.join(", ")}`;
      await axios.post(API_Activities, {
        userId: editingUser.id,
        action: "update",
        description: description,
        by: by,
        timestamp: new Date().toISOString(),
      });

      toast.success("User updated successfully", { duration: 1500 });
      setNewUser({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
      await fetchUsers();

      closeEditUserModal();
    } catch (err) {
      console.log(err);
      toast.error("Failed to update user", { duration: 1500 });
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setNewUser({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    });
    openEditUserModal();
  };

  const handleDeleteUser = async (userId) => {
    if (localStorage.getItem("id") === userId) {
      toast.error("You cannot delete your own account", { duration: 1500 });
      return;
    }
    toast.custom((t) => (
      <div
        className={`
         ${t.visible ? "animate-custom-enter" : "animate-custom-leave"}
         bg-white border border-gray-300 rounded-lg shadow-lg p-4`}
      >
        <p className="mb-4">
          Are you sure you want to delete this user? This action cannot be
          undone.
        </p>
        <div className="flex justify-end items-center gap-5">
          <Button
            color="gray"
            variant="light"
            size="xs"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </Button>
          <Button
            color="red"
            variant="light"
            size="xs"
            onClick={() => {
              toast.dismiss();
              deleteUser(userId);
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    ));
  };
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`${API_Users}/${userId}`);

      const activitiesResponse = await axios.get(API_Activities);
      const userActivities = activitiesResponse.data.filter(
        (activity) => activity.userId === userId
      );

      for (const activity of userActivities) {
        await axios.delete(`${API_Activities}/${activity.id}`);
      }

      toast.success("User deleted successfully", {
        duration: 1500,
      });
      await fetchUsers();
      await fetchActivities(); // Refresh activities to update the count
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete user", { duration: 1500 });
    }
  };
  return (
    <>
      {" "}
      <Toaster position="top-center" />
      <div className="bg-[#f1f1f1] min-h-screen p-2 flex flex-col gap-5">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <StatCard
            icon={RiAdminFill}
            title="Admins"
            value={users.filter((user) => user.role === "admin").length}
          />
          <StatCard
            icon={FaUsers}
            title="Members"
            value={users.filter((user) => user.role === "member").length}
          />
          <StatCard
            icon={MdBarChart}
            title="Activities"
            value={activities.length}
          />
        </motion.div>
        <motion.div
          className="flex flex-col bg-white rounded-lg p-2 gap-3 px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex items-center justify-between border-b-2 pb-2 border-gray-300">
            <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl 2xl:text-4xl">
              Users
            </h1>
            {localStorage.getItem("role") === "admin" ? (
              <Button
                onClick={openAddUserModal}
                leftSection={<IoPersonAdd size={20} />}
                radius="md"
              >
                Add User
              </Button>
            ) : (
              <Tooltip label="Only admins can add users">
                <Button disabled leftSection={<IoPersonAdd size={20} />}>
                  Add User
                </Button>
              </Tooltip>
            )}
          </div>
          <div className="flex justify-between gap-5">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftSection={<IoIosSearch size={20} />}
              variant="filled"
              radius="md"
              size="sm"
              className="w-full md:w-1/3"
            />
            <Menu>
              <Menu.Target>
                <Button size="compact-md" radius="md">
                  <TbArrowsSort size={20} />
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => handleSort("username")}>
                  Sort by Username
                </Menu.Item>
                <Menu.Item onClick={() => handleSort("newest")}>
                  Sort by Newest
                </Menu.Item>
                <Menu.Item onClick={() => handleSort("oldest")}>
                  Sort by Oldest
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
          <Table striped highlightOnHover withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Username</Table.Th>
                <Table.Th className="hidden md:table-cell">Role</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            {loadingUsers ? (
              <Table.Tbody>
                {[...Array(usersPerPage)].map((_, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      <Skeleton height={30} width={"100%"} />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={30} width={"100%"} />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={30} width={"100%"} />
                    </Table.Td>
                    <Table.Td className="hidden md:table-cell">
                      <Skeleton height={30} width={"100%"} />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={30} width={"100%"} />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            ) : (
              <Table.Tbody>
                {currentUsers.map((u) => (
                  <Table.Tr key={u.id}>
                    <Table.Td>{u.id}</Table.Td>
                    <Table.Td>{u.email}</Table.Td>
                    <Table.Td className="break-all">{u.username}</Table.Td>
                    <Table.Td className="hidden md:table-cell">
                      {u.role}
                    </Table.Td>
                    <Table.Td className="space-x-2 space-y-1">
                      {localStorage.getItem("role") === "admin" ||
                      localStorage.getItem("id") === u.id ? (
                        <ActionIcon
                          onClick={() => openEditModal(u)}
                          radius="md"
                          size="md"
                          color="yellow"
                          variant="light"
                        >
                          <FaUserEdit size={16} />
                        </ActionIcon>
                      ) : (
                        <Tooltip label="Only admins can edit users or your own profile">
                          <ActionIcon radius="md" size="md" disabled>
                            <FaUserEdit size={16} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                      {localStorage.getItem("role") === "admin" ||
                      localStorage.getItem("id") === u.id ? (
                        <ActionIcon
                          onClick={() => handleDeleteUser(u.id)}
                          radius="md"
                          size="md"
                          color="red"
                          variant="light"
                        >
                          <MdDelete size={16} />
                        </ActionIcon>
                      ) : (
                        <Tooltip label="Only admins can delete users or your own profile">
                          <ActionIcon radius="md" size="md" disabled>
                            <MdDelete size={16} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            )}
          </Table>
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={handlePageChange}
            siblings={1}
            className="w-full flex justify-center"
          />
        </motion.div>
      </div>
      {/* Add User Modal */}
      <Modal opened={AddUserModal} onClose={closeAddUserModal} title="Add User">
        <Stack>
          <Input
            placeholder="Username"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value.trim() })
            }
            leftSection={<FaUserAlt size={14} />}
            variant="filled"
            radius="md"
            size="md"
            className="w-full"
          />
          <Input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value.trim() })
            }
            leftSection={<MdAlternateEmail size={16} />}
            variant="filled"
            radius="md"
            size="md"
            className="w-full"
          />
          <PasswordInput
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value.trim() })
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
            placeholder="Confirm password"
            value={newUser.confirmPassword}
            onChange={(e) =>
              setNewUser({
                ...newUser,
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
          <SegmentedControl
            fullWidth
            withItemsBorders={false}
            size="md"
            radius="md"
            defaultValue="admin"
            color="blue"
            data={[
              { value: "Admin", label: "Admin" },
              { value: "Member", label: "Member" },
            ]}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                role: e.toLowerCase(),
              })
            }
          />
        </Stack>
        <div className="flex  items-center justify-end pt-5">
          <Button
            variant="filled"
            radius="md"
            size="compact-lg"
            onClick={handleAddUser}
            loaderProps={{ type: "dots" }}
            fullWidth={true}
            style={{ width: "50%" }}
          >
            Add User
          </Button>
        </div>
      </Modal>
      {/* Edit User Modal */}
      <Modal
        opened={EditUserModal}
        onClose={closeEditUserModal}
        title="Edit User"
      >
        <Stack>
          <Input
            placeholder="New Username"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value.trim() })
            }
            leftSection={<FaUserAlt size={14} />}
            variant="filled"
            radius="md"
            size="md"
            className="w-full"
          />
          <Input
            placeholder="New Email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value.trim() })
            }
            leftSection={<MdAlternateEmail size={16} />}
            variant="filled"
            radius="md"
            size="md"
            className="w-full"
          />
          <PasswordInput
            placeholder="New Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value.trim() })
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
            placeholder="Confirm password"
            value={newUser.confirmPassword}
            onChange={(e) =>
              setNewUser({
                ...newUser,
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
          <SegmentedControl
            fullWidth
            withItemsBorders={false}
            size="md"
            radius="md"
            defaultValue="admin"
            data={[
              { value: "Admin", label: "Admin" },
              { value: "Member", label: "Member" },
            ]}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                role: e.toLowerCase(),
              })
            }
            color="blue"
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

export default UsersDetails;

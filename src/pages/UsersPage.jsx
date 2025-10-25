import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Avatar,
  Badge,
  Text,
  Group,
  Stack,
  Skeleton,
} from "@mantine/core";
import { FaUser, FaEnvelope, FaUserTag, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
function UsersPage() {
  const API_Users = "https://68f8eaf7deff18f212b80afe.mockapi.io/Users";
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const currentUserId = localStorage.getItem("id");
      const response = await axios.get(`${API_Users}/${currentUserId}`);
      setUserProfile(response.data);
      setLoadingProfile(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="bg-[#f1f1f1] min-h-screen p-2 flex flex-col gap-5">
      <div className="flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
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

              <Stack spacing="md" className="w-full md:w-1/2">
                <Group spacing="sm">
                  <FaEnvelope className="text-gray-600" size={16} />
                  <Text size="md" color="dimmed">
                    Email:
                  </Text>
                  <Text size="md" className="break-all">
                    {userProfile.email}
                  </Text>
                </Group>

                {/* Username */}
                <Group spacing="sm">
                  <FaUser className="text-gray-600" size={16} />
                  <Text size="md" color="dimmed">
                    Username:
                  </Text>
                  <Text size="md">{userProfile.username}</Text>
                </Group>

                {/* Role */}
                <Group spacing="sm">
                  <FaUserTag className="text-gray-600" size={16} />
                  <Text size="md" color="dimmed">
                    Role:
                  </Text>
                  <Text size="md" className="capitalize">
                    {userProfile.role}
                  </Text>
                </Group>

                {/* Join Date */}
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
  );
}

export default UsersPage;

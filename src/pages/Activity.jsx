import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  Table,
  Pagination,
  Menu,
  Button,
  Input,
  Skeleton,
} from "@mantine/core";
import { TbArrowsSort } from "react-icons/tb";
import { IoIosSearch } from "react-icons/io";
import { Toaster } from "react-hot-toast";
import { BarChart } from "@mantine/charts";
import StatCard from "../components/StatCard";
import { FaChartSimple } from "react-icons/fa6";

function Activity() {
  const API_Activities =
    "https://68f8eaf7deff18f212b80afe.mockapi.io/Activities";
  const [activityData, setActivityData] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("oldest");
  const [currentPage, setCurrentPage] = useState(1);

  const activitiesPerPage = 4;

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        `${API_Activities}?userId=${localStorage.getItem("id")}`
      );

      setActivityData(response.data);
      setLoadingActivity(false);
    } catch (err) {
      console.log(err);
      setActivityData([]);
      setLoadingActivity(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = activityData.filter((activity) =>
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSortedActivities = () => {
    const sorted = [...filteredActivities];
    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
      case "oldest":
        return sorted.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
      default:
        return sorted;
    }
  };

  const sortedActivities = getSortedActivities();
  const totalPages = Math.ceil(sortedActivities.length / activitiesPerPage);
  const startIndex = (currentPage - 1) * activitiesPerPage;
  const endIndex = startIndex + activitiesPerPage;
  const currentActivities = sortedActivities.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    setCurrentPage(1);
  };

  const generateChartData = () => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const activityCounts = {};
    daysOfWeek.forEach((day) => {
      activityCounts[day] = 0;
    });
    activityData.forEach((activity) => {
      if (activity.timestamp) {
        const date = new Date(activity.timestamp);
        const dayName = daysOfWeek[date.getDay()];
        activityCounts[dayName]++;
      }
    });
    return daysOfWeek.map((day) => ({
      day: day,
      activities: activityCounts[day],
    }));
  };

  const chartData = generateChartData();
  return (
    <>
      <Toaster position="top-center" />
      <div className="bg-[#f1f1f1] min-h-screen p-2 flex flex-col gap-5">
        <div className="flex flex-col bg-white rounded-lg p-2 gap-3 px-4">
          <div className="flex items-center justify-between border-b-2 pb-2 border-gray-300">
            <h2 className="font-semibold text-xl md:text-2xl lg:text-3xl 2xl:text-4xl">
              Weekly Activity Overview
            </h2>
          </div>
          <div className="w-full flex flex-col gap-4 md:flex-row justify-between ">
            <div className="flex flex-col lg:w-1/2 w-full gap-5 ">
              <h1 className="font-semibold text-lg md:text-xl lg:text-2xl 2xl:text-3xl">
                {localStorage.getItem("username")}'s Activity Summary
              </h1>
              <StatCard
                title="Total Activities"
                value={activityData.length}
                icon={FaChartSimple}
              />
            </div>
            <div className="flex justify-center items-center w-full lg:w-1/2">
              <BarChart
                h={200}
                w={"100%"}
                data={chartData}
                dataKey="day"
                series={[
                  { name: "activities", color: "blue.6", label: "Activities" },
                ]}
                gridLine="x"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-white rounded-lg p-2 gap-3 px-4">
          <div className="flex items-center justify-between border-b-2 pb-2 border-gray-300">
            <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl 2xl:text-4xl">
              Activities
            </h1>
          </div>
          <div className="flex justify-between gap-5">
            <Input
              placeholder="Search activities..."
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
                <Table.Th>Action</Table.Th>
                <Table.Th>By</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Date</Table.Th>
              </Table.Tr>
            </Table.Thead>

            {loadingActivity ? (
              <Table.Tbody>
                {[1, 2, 3, 4, 5].map((loader) => (
                  <Table.Tr key={loader}>
                    <Table.Td>
                      <Skeleton height={20} width={"100%"} />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={20} width={"100%"} />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={20} width={"100%"} />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={20} width={"100%"} />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            ) : (
              <Table.Tbody>
                {currentActivities.length > 0 ? (
                  currentActivities.map((activity) => (
                    <Table.Tr key={activity.id}>
                      <Table.Td>{activity.action}</Table.Td>
                      <Table.Td>{activity.by}</Table.Td>
                      <Table.Td>{activity.description}</Table.Td>
                      <Table.Td>
                        {activity.timestamp
                          ? new Date(activity.timestamp).toLocaleDateString()
                          : activity.date || "N/A"}
                      </Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={4} className="text-center text-gray-500">
                      No activities found
                    </Table.Td>
                  </Table.Tr>
                )}
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
        </div>
      </div>
    </>
  );
}

export default Activity;

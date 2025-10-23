import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { Burger, NavLink, Space } from "@mantine/core";
import { FaUsers, FaUser, FaCog, FaChartBar } from "react-icons/fa";
import { Link, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";

function SideBar() {
  const [opened, { toggle }] = useDisclosure(false);
  const location = useLocation();
  const framerText = (delay) => {
    return {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      transition: {
        delay: 0.3 + delay / 10,
      },
    };
  };
  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`w-full md:flex flex-col items-start h-screen max-h-screen rounded-r-lg bg-white hidden `}
      >
        <div className={`flex flex-col w-full h-full gap-2 px-2 md:py-2 `}>
          <motion.span {...framerText(0)}>
            <NavLink
              component={Link}
              to="/"
              label="UsersDetails"
              leftSection={<FaUsers size={20} />}
              active={location.pathname === "/"}
              className="rounded-2xl"
            />
          </motion.span>
          <motion.span {...framerText(1)}>
            <NavLink
              component={Link}
              to="/users"
              label="Users"
              leftSection={<FaUser size={20} />}
              active={location.pathname === "/users"}
              className="rounded-2xl"
            />
          </motion.span>
          <motion.span {...framerText(2)}>
            <NavLink
              component={Link}
              to="/activity"
              label="Activity"
              leftSection={<FaChartBar size={20} />}
              active={location.pathname === "/activity"}
              className="rounded-2xl"
            />
          </motion.span>
          <motion.span
            {...framerText(3)}
            className="h-full flex items-end justify-end"
          >
            <NavLink
              component={Link}
              to="/settings"
              label="Settings"
              leftSection={<FaCog size={20} />}
              active={location.pathname === "/settings"}
              className="rounded-2xl"
            />
          </motion.span>
        </div>
      </div>
      {/* Mobile Sidebar */}
      <div
        className={`fixed w-full flex flex-col items-start md:h-screen max-h-screen rounded-r-lg bg-white md:hidden `}
      >
        <Burger
          opened={opened}
          onClick={toggle}
          aria-label="Toggle navigation"
          className="md:hidden m-4"
        />

        <AnimatePresence>
          {opened && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`flex flex-col w-full h-full gap-2 px-2 md:py-2 `}
            >
              <motion.span {...framerText(0)}>
                <NavLink
                  component={Link}
                  to="/"
                  label="UsersDetails"
                  leftSection={<FaUsers size={20} />}
                  active={location.pathname === "/"}
                  className="rounded-2xl"
                  onClick={() => window.innerWidth < 768 && toggle()}
                />
              </motion.span>
              <motion.span {...framerText(1)}>
                <NavLink
                  component={Link}
                  to="/users"
                  label="Users"
                  leftSection={<FaUser size={20} />}
                  active={location.pathname === "/users"}
                  className="rounded-2xl"
                  onClick={() => window.innerWidth < 768 && toggle()}
                />
              </motion.span>
              <motion.span {...framerText(2)}>
                <NavLink
                  component={Link}
                  to="/activity"
                  label="Activity"
                  leftSection={<FaChartBar size={20} />}
                  active={location.pathname === "/activity"}
                  className="rounded-2xl"
                  onClick={() => window.innerWidth < 768 && toggle()}
                />
              </motion.span>
              <motion.span {...framerText(3)}>
                <NavLink
                  component={Link}
                  to="/settings"
                  label="Settings"
                  leftSection={<FaCog size={20} />}
                  active={location.pathname === "/settings"}
                  className="rounded-2xl"
                  onClick={() => window.innerWidth < 768 && toggle()}
                />
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default SideBar;

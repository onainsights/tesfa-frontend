"use client";
import { useRouter } from "next/navigation";
import { User as UserIcon, Mail, Calendar, Edit2 } from "lucide-react";
import { ShieldCheck } from 'lucide-react';
import Image from "next/image";
import useFetchOrganization from "@/app/hooks/useFetchOrganization";
import Layout from "../sharedComponents/Layout";
import { useFetchTaskAssignments } from "@/app/hooks/useFetchTaskAssignment";
import TaskSummary from "./components/TaskSummary";
import ProtectedRoute from "../sharedComponents/ProtectedRoot";

function formatDate(isoString: string | undefined) {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProfilePage() {
  const router = useRouter();
  const { assignedTasks } = useFetchTaskAssignments();
  const { user: profile, loading, error } = useFetchOrganization();
  const completedTasks = assignedTasks.filter((task) => task.status === "completed");
  const totalTasks = assignedTasks.length;

  return (
    <ProtectedRoute>
    <Layout>
      <div className="flex flex-col w-full items-center h-screen overflow-y-auto bg-surface-secondary">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mt-8 xl:mt-25 mb-12">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-primary">
            Profile
          </h1>
          <div className="w-full h-[6px] rounded bg-primary-dark opacity-40" />
        </div>

        <div className="flex flex-col lg:flex-row items-start w-full max-w-7xl mt-20 gap-10 px-4 sm:px-6 md:px-8 lg:px-10 pb-20">
          <div className="w-full lg:w-1/2 rounded-3xl shadow-lg bg-primary">
            <div className="relative flex flex-col items-center p-22 ">

              {error && (
                <div className="text-red-500 text-center p-4 w-full">
                  {error}
                </div>
              )}

              {loading && (
                <div className="flex items-center justify-center w-full h-[180px]">
                  <span
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"
                  ></span>
                </div>
              )}

              {!loading && profile && (
                <>
                  <div
                    className="w-[150px] sm:w-[180px] h-[150px] sm:h-[180px] absolute rounded-full border-4 border-accent flex items-center justify-center overflow-hidden bg-surface"
                  >
                    {profile.logo_image ? (
                      <Image
                        src={profile.logo_image.startsWith("http")
                          ? profile.logo_image
                          : `${process.env.API_URL}${profile.logo_image}`}
                        alt="Organization Logo"
                        width={150}
                        height={150}
                        className="object-contain"
                        unoptimized={false}
                      />
                    ) : (
                      <Image
                        src="/Images/Group66.png"
                        alt="Default Logo"
                        width={150}
                        height={150}
                        className="object-contain"
                      />
                    )}
                  </div>
                  <button
                    onClick={() => router.push("/edit-profile")}
                    className="absolute top-55 cursor-pointer right-55 w-9 h-9 bg-surface border border-accent rounded-full flex items-center justify-center shadow transition"
                    aria-label="Edit Profile"
                    type="button"
                  >
                    <Edit2 className="w-4 h-4 text-accent" />
                  </button>
                </>
              )}
            </div>

            <div className="w-full rounded-3xl p-6 sm:p-10 flex flex-col gap-6 shadow-inner bg-primary-light">

              {loading && (
                <div className="text-center text-gray-400">Loading profile...</div>
              )}
              {!loading && profile && (
                <>
                  <div className="flex flex-col sm:flex-row items-start mt-25 sm:items-center gap-3 w-full">
                    <UserIcon className="w-7 h-7 text-accent" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5">
                      <p className="text-base sm:text-lg font-light text-primary-dark/70">
                        Organization name:
                      </p>
                      <p className="text-base sm:text-lg font-medium break-words text-primary-dark">
                        {profile.org_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                    <Mail className="w-7 h-7 text-accent" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-36">
                      <p className="text-base sm:text-lg font-light text-primary-dark/70">
                        Email:
                      </p>
                      <p className="text-base sm:text-lg font-medium break-words text-primary-dark">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                    <Calendar className="w-7 h-7 text-accent" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-9">
                      <p className="text-base sm:text-lg font-light text-primary-dark/70">
                        Registration Date:
                      </p>
                      <p className="text-base sm:text-lg font-medium text-primary-dark">
                        {formatDate(profile.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                    <ShieldCheck className="w-7 h-7 text-accent" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-11">
                      <p className="text-base sm:text-lg font-light text-primary-dark/70">
                        Tasks Completed:
                      </p>
                      <p className="text-base sm:text-lg font-medium text-primary-dark">
                        {completedTasks.length}/{totalTasks} Tasks
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <TaskSummary />
          </div>
        </div>
      </div>
    </Layout>
    </ProtectedRoute>
  );
}
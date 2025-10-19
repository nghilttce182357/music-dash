"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, Clock, Tick } from "@/icons";


export const EcommerceMetrics = () => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            {/* <!-- Metric Item Start --> */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">


                <div className="flex items-center justify-center w-12 h-12 bg bg-gray-100 rounded-xl ">
                    <Tick className="text-gray-800 w-12 h-12 dark:text-white/90" />
                </div>

                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Total number of devices online
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            7/10
                        </h4>
                    </div>

                </div>
            </div>
            {/* <!-- Metric Item End --> */}

            {/* <!-- Metric Item Start --> */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <Clock className="text-gray-800 w-12 h-12 dark:text-white/90" />
                </div>
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Total current continuous runtime
                        </span>

                        {/* Hàng ngang */}
                        <div className="mt-2 flex items-center gap-2">
                            <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90 whitespace-nowrap">
                                03:50:23
                            </h4>

                                <Badge color="success">
                                    <div className="flex items-center gap-1 whitespace-nowrap">
                                        <ArrowDownIcon className="text-success-500 w-4 h-4" />
                                        <span>-3.59%</span>
                                    </div>
                                </Badge>

                            <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">Vs last time</p>
                        </div>
                    </div>


                </div>
            </div>
            {/* <!-- Metric Item End --> */}
        </div>
    );
};

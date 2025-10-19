"use client";

import React, { useState } from "react";
import Image from "next/image";
import PaginationWithTextWitIcon from "../ui/pagination/PaginationWithTextWitIcon";
import { AngleDownIcon, AngleUpIcon, PencilIcon } from "@/icons";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Switch from "../form/switch/Switch";
import EditDeviceForm from "./EditDeviceForm";
import AddGroupForm from "./AddGroupForm";




export default function BasicTableOne() {
    const [isChecked, setIsChecked] = useState(false);
    // const rowsPerPage = 5;
    const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page
    const [currentPage, setCurrentPage] = useState(1);

    const [activeTab, setActiveTab] = React.useState<"device" | "group">("device");

    // Devices data (matches design columns) - converted to state so edits persist locally
    const [devicesData, setDevicesData] = useState(() => [
        { id: 1, image: "/images/product/product-01.jpg", name: 'Macbook pro 13"', address: 'Bến Tre, Châu Thành, Giao Long', group: 'Newsletter', volume: 40, enabled: true },
        { id: 2, image: "/images/product/product-02.jpg", name: 'Apple Watch Ultra', address: 'Hà Nội, Hoàn Kiếm, P. Chu Trinh', group: 'Current Affairs', volume: 60, enabled: false },
        { id: 3, image: "/images/product/product-03.jpg", name: 'iPhone 15 Pro Max', address: 'Thừa Thiên Huế, TP. Huế, Phú Hội', group: 'Weather Forecast', volume: 50, enabled: true },
        { id: 4, image: "/images/product/product-04.jpg", name: 'iPad Pro 3rd Gen', address: 'HCM, Q. 1, Nguyễn Thái Bình', group: 'Play Music', volume: 65, enabled: true },
        { id: 5, image: "/images/product/product-05.jpg", name: 'Airpods Pro 2nd Gen', address: 'Ninh Bình, Ninh Kiều, Trường Yên', group: 'Play Music', volume: 70, enabled: false },
        { id: 6, image: "/images/product/product-01.jpg", name: 'Macbook pro 13"', address: 'Đà Nẵng, Hải Châu, Bình Thuận', group: 'Weather Forecast', volume: 55, enabled: true },
        { id: 7, image: "/images/product/product-02.jpg", name: 'Apple Watch Ultra', address: 'Cần Thơ, Ninh Kiều, An Khánh', group: 'Current Affairs', volume: 75, enabled: true },
        { id: 8, image: "/images/product/product-03.jpg", name: 'iPhone 15 Pro Max', address: 'Kiên Giang, Rạch Giá, Vĩnh Hòa', group: 'Weather Forecast', volume: 45, enabled: false },
        { id: 9, image: "/images/product/product-04.jpg", name: 'iPad Pro 3rd Gen', address: 'Quảng Ninh, Hạ Long, Bãi Cháy', group: 'Current Affairs', volume: 80, enabled: true },
        { id: 10, image: "/images/product/product-05.jpg", name: 'Airpods Pro 2nd Gen', address: 'Bến Tre, Châu Thành, Giao Long', group: 'Newsletter', volume: 40, enabled: false },
    ]);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<typeof devicesData[number] | null>(null);
    const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);

    const openAddGroup = () => setIsAddGroupOpen(true);
    const closeAddGroup = () => setIsAddGroupOpen(false);

    const handleSaveGroup = (groupName: string, selectedDeviceIds: number[]) => {
        // For now just print and close; in real app you'd persist
        console.log('Save group', groupName, selectedDeviceIds);
    };

    // pagination for devices table
    const [deviceRowsPerPage, setDeviceRowsPerPage] = useState(10);
    const [deviceCurrentPage, setDeviceCurrentPage] = useState(1);
    const [deviceSearch, setDeviceSearch] = useState<string>("");
    // filter devices based on search
    const filteredDevices = devicesData.filter((d) => {
        if (!deviceSearch) return true;
        const q = deviceSearch.toLowerCase();
        return (
            d.name.toLowerCase().includes(q) ||
            d.address.toLowerCase().includes(q) ||
            d.group.toLowerCase().includes(q) ||
            String(d.id).includes(q)
        );
    });

    const deviceTotalPages = Math.max(1, Math.ceil(filteredDevices.length / deviceRowsPerPage));
    const deviceStartIndex = (deviceCurrentPage - 1) * deviceRowsPerPage;
    const deviceEndIndex = Math.min(deviceStartIndex + deviceRowsPerPage, filteredDevices.length);
    const deviceCurrentData = filteredDevices.slice(deviceStartIndex, deviceEndIndex);

    const openEdit = (device: typeof devicesData[number]) => {
        setSelectedDevice(device);
        setIsEditOpen(true);
    };

    const closeEdit = () => {
        setSelectedDevice(null);
        setIsEditOpen(false);
    };

    const handleSaveDevice = (updated: typeof devicesData[number]) => {
        setDevicesData((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    };

    const handleToggleDevice = (id: number, checked: boolean) => {
        setDevicesData((prev) => prev.map((d) => (d.id === id ? { ...d, enabled: checked } : d)));
    };

    const handleDevicePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= deviceTotalPages) setDeviceCurrentPage(newPage);
    };

    // Calculate total pages and current data slice

    const startIndex = (currentPage - 1) * rowsPerPage;




    // Rows per page handler
    const handleRowsPerPageChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        const newRowsPerPage = parseInt(e.target.value, 10); // Ensure base 10 parsing
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1); // Reset to first page when rows per page changes
    };

    return (

        <div className="w-full min-h-screen px-6 py-6">
            <div className="mb-4">
                <div className="flex items-center justify-start">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setActiveTab("device")}
                            className={`pb-3 font-semibold border-b-2 transition-colors ${activeTab === "device"
                                ? "text-orange-500 border-orange-400"
                                : "text-gray-400 border-transparent"
                                }`}
                        >
                            Device
                        </button>
                        <button
                            onClick={() => setActiveTab("group")}
                            className={`pb-3 font-semibold border-b-2 transition-colors ${activeTab === "group"
                                ? "text-orange-500 border-orange-400"
                                : "text-gray-400 border-transparent"
                                }`}
                        >
                            Group
                        </button>
                    </div>
                </div>


            </div>


            {/* ========= TAB: DEVICE ========= */}
            {activeTab === "device" && (
                <>
                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                            <div className="flex items-center gap-3 w-wfull p-5">
                                <span className="text-gray-500 dark:text-gray-400"> Show </span>
                                <div className="relative z-20 bg-transparent">
                                    <select
                                        className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                        value={rowsPerPage}
                                        onChange={handleRowsPerPageChange}
                                    >
                                        <option
                                            value="10"
                                            className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                                        >
                                            10
                                        </option>
                                        <option
                                            value="8"
                                            className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                                        >
                                            8
                                        </option>
                                        <option
                                            value="5"
                                            className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                                        >
                                            5
                                        </option>
                                    </select>
                                    <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
                                        <svg
                                            className="stroke-current"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                                                stroke=""
                                                strokeWidth="1.2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>
                                </div>
                                <span className="text-gray-500 dark:text-gray-400"> entries </span>
                                <div className="ml-auto w-full max-w-[520px] flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <button className="absolute text-gray-500 -translate-y-1/2 left-4 top-1/2 dark:text-gray-400">
                                            <svg
                                                className="fill-current"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                                                    fill=""
                                                />
                                            </svg>
                                        </button>

                                        <input
                                            type="text"
                                            value={deviceSearch}
                                            onChange={(e) => { setDeviceSearch(e.target.value); setDeviceCurrentPage(1); }}
                                            placeholder="Search..."
                                            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className="max-w-full overflow-x-auto custom-scrollbar">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableCell
                                                isHeader
                                                className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                                            >
                                                <div className="flex items-center justify-between cursor-pointer">
                                                    <div className="flex gap-3">

                                                        <span className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                                                            Image
                                                        </span>
                                                    </div>
                                                    <button className="flex flex-col gap-0.5">
                                                        <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                                                        <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                                                    </button>
                                                </div>
                                            </TableCell>


                                            <TableCell
                                                isHeader
                                                className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                                            >
                                                <div className="flex items-center justify-between cursor-pointer">
                                                    <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                                                        Devices
                                                    </p>
                                                    <button className="flex flex-col gap-0.5">
                                                        <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                                                        <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                                            >
                                                <div className="flex items-center justify-between cursor-pointer">
                                                    <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                                                        Address
                                                    </p>
                                                    <button className="flex flex-col gap-0.5">
                                                        <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                                                        <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                                            >
                                                <div className="flex items-center justify-between cursor-pointer">
                                                    <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                                                        Device Group
                                                    </p>
                                                    <button className="flex flex-col gap-0.5">
                                                        <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                                                        <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                                            >
                                                <div className="flex items-center justify-between cursor-pointer">
                                                    <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                                                        Volumn
                                                    </p>
                                                    <button className="flex flex-col gap-0.5">
                                                        <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                                                        <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                                                    </button>
                                                </div>
                                            </TableCell>

                                            <TableCell
                                                isHeader
                                                className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                                            >
                                                <div className="flex items-center justify-between cursor-pointer">
                                                    <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                                                        Enable
                                                    </p>
                                                    <button className="flex flex-col gap-0.5">
                                                        <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                                                        <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                                                    </button>
                                                </div>
                                            </TableCell>

                                            <TableCell
                                                isHeader
                                                className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                                            >
                                                <div className="flex items-center justify-between cursor-pointer">
                                                    <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                                                        Action
                                                    </p>
                                                    <button className="flex flex-col gap-0.5">
                                                        <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                                                        <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {deviceCurrentData.map((device) => (
                                            <TableRow key={device.id}>
                                                <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] dark:text-white/90 whitespace-nowrap">
                                                    <div className="flex gap-3 items-center">

                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 relative">
                                                                <Image src={device.image} alt={device.name} fill className="object-contain" />
                                                            </div>

                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] dark:text-white/90 whitespace-nowrap">
                                                    <div>
                                                        <p className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                            {device.name}
                                                        </p>
                                                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                                            #{device.id}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap">
                                                    <span>{device.address}</span>
                                                </TableCell>
                                                <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                                                    {device.group}
                                                </TableCell>
                                                <TableCell className="px-4 py-4 w-56 border border-gray-100 dark:border-white/[0.05]">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-full h-2 bg-gray-200 rounded-full">
                                                            <div
                                                                className="h-2 bg-blue-500 rounded-full"
                                                                style={{ width: `${device.volume}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-gray-500 text-xs">{device.volume}%</span>

                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05]">
                                                    <div className="flex items-center justify-center w-full">
                                                        <Switch defaultChecked={device.enabled} onChange={(checked) => handleToggleDevice(device.id, checked)} />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                                                    <div className="flex items-center w-full gap-2">
                                                        <button onClick={() => openEdit(device)} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90">
                                                            <PencilIcon />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="border-t border-gray-100 flex items-center justify-between">
                                <div className="pb-3 xl:pb-0">
                                    <p className="pb-3 pl-[10px] text-sm font-medium text-center text-gray-500 border-b border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-b-0 xl:pb-0 xl:text-left">
                                        Showing {deviceStartIndex + 1} to {deviceEndIndex} of {devicesData.length} entries
                                    </p>
                                </div>
                                <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-6 flex justify-center">
                                    <PaginationWithTextWitIcon totalPages={10} initialPage={1} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ========= TAB: GROUP ========= */}
            {activeTab === "group" && (
                <div className="max-w-full overflow-x-auto custom-scrollbar">
                    <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="flex items-center gap-3 w-wfull p-5">
                            <span className="text-gray-500 dark:text-gray-400"> Show </span>
                            <div className="relative z-20 bg-transparent">
                                <select
                                    className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                    value={rowsPerPage}
                                    onChange={handleRowsPerPageChange}
                                >
                                    <option
                                        value="10"
                                        className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                                    >
                                        10
                                    </option>
                                    <option
                                        value="8"
                                        className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                                    >
                                        8
                                    </option>
                                    <option
                                        value="5"
                                        className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                                    >
                                        5
                                    </option>
                                </select>
                                <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
                                    <svg
                                        className="stroke-current"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                                            stroke=""
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                            </div>
                            <span className="text-gray-500 dark:text-gray-400"> entries </span>
                            <div className="ml-auto w-full max-w-[520px] flex items-center gap-3 flex-nowrap">
                                <div className="relative flex-1">
                                    <button className="absolute text-gray-500 -translate-y-1/2 left-4 top-1/2 dark:text-gray-400">
                                        <svg
                                            className="fill-current"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                                                fill=""
                                            />
                                        </svg>
                                    </button>

                                    <input
                                        type="text"
                                        value={deviceSearch}
                                        onChange={(e) => { setDeviceSearch(e.target.value); setDeviceCurrentPage(1); }}
                                        placeholder="Search..."
                                        className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                    />
                                </div>
                                <div>
                                    <button onClick={openAddGroup} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700 whitespace-nowrap">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Add new group
                                    </button>
                                </div>
                            </div>
                        </div>


                        <div className="max-w-full overflow-x-auto custom-scrollbar">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableCell
                                            isHeader
                                            className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                                        >
                                            <div className="flex items-center justify-between cursor-pointer">
                                                <div className="flex gap-3">

                                                    <span className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                                                        Image
                                                    </span>
                                                </div>
                                                <button className="flex flex-col gap-0.5">
                                                    <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                                                    <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                                                </button>
                                            </div>
                                        </TableCell>


                                        <TableCell
                                            isHeader
                                            className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                                        >
                                            <div className="flex items-center justify-between cursor-pointer">
                                                <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                                                    Devices
                                                </p>
                                                <button className="flex flex-col gap-0.5">
                                                    <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                                                    <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                                                </button>
                                            </div>
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                                        >
                                            <div className="flex items-center justify-between cursor-pointer">
                                                <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                                                    Address
                                                </p>
                                                <button className="flex flex-col gap-0.5">
                                                    <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                                                    <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                                                </button>
                                            </div>
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                                        >
                                            <div className="flex items-center justify-between cursor-pointer">
                                                <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                                                    Device Group
                                                </p>
                                                <button className="flex flex-col gap-0.5">
                                                    <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                                                    <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                                                </button>
                                            </div>
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                                        >
                                            <div className="flex items-center justify-between cursor-pointer">
                                                <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                                                    Volumn
                                                </p>
                                                <button className="flex flex-col gap-0.5">
                                                    <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                                                    <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                                                </button>
                                            </div>
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                                        >
                                            <div className="flex items-center justify-between cursor-pointer">
                                                <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                                                    Enable
                                                </p>
                                                <button className="flex flex-col gap-0.5">
                                                    <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                                                    <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                                                </button>
                                            </div>
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                                        >
                                            <div className="flex items-center justify-between cursor-pointer">
                                                <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                                                    Action
                                                </p>
                                                <button className="flex flex-col gap-0.5">
                                                    <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                                                    <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {deviceCurrentData.map((device) => (
                                        <TableRow key={device.id}>
                                            <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] dark:text-white/90 whitespace-nowrap">
                                                <div className="flex gap-3 items-center">
                                                    <div className="mt-1">

                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 relative">
                                                            <Image src={device.image} alt={device.name} fill className="object-contain" />
                                                        </div>

                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] dark:text-white/90 whitespace-nowrap">
                                                <div>
                                                    <p className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {device.name}
                                                    </p>
                                                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                                        #{device.id}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap">
                                                <span>{device.address}</span>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                                                {device.group}
                                            </TableCell>
                                            <TableCell className="px-4 py-4 w-56 border border-gray-100 dark:border-white/[0.05]">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-full h-2 bg-gray-200 rounded-full">
                                                        <div
                                                            className="h-2 bg-blue-500 rounded-full"
                                                            style={{ width: `${device.volume}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-gray-500 text-xs">{device.volume}%</span>

                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05]">
                                                <div className="flex items-center justify-center w-full">
                                                    <Switch defaultChecked={device.enabled} onChange={(checked) => handleToggleDevice(device.id, checked)} />
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                                                <div className="flex items-center w-full gap-2">
                                                    <button className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90">
                                                        <PencilIcon />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="border-t border-gray-100 flex items-center justify-between">
                            <div className="pb-3 xl:pb-0">
                                <p className="pb-3 pl-[10px] text-sm font-medium text-center text-gray-500 border-b border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-b-0 xl:pb-0 xl:text-left">
                                    Showing {startIndex + 1} to {deviceEndIndex} of {deviceTotalPages} entries
                                </p>
                            </div>
                            <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-6 flex justify-center">
                                <PaginationWithTextWitIcon totalPages={10} initialPage={1} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========= MODAL ========= */}

            <EditDeviceForm
                open={isEditOpen}
                device={selectedDevice}
                onClose={closeEdit}
                onSave={handleSaveDevice}
            />
            <AddGroupForm
                open={isAddGroupOpen}
                devices={devicesData}
                initialGroupName={"Newsletter"}
                onClose={closeAddGroup}
                onSave={handleSaveGroup}
            />
        </div>
    );
}

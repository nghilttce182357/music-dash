"use client";

import React, { useEffect, useState } from "react";
import PaginationWithTextWitIcon from "../ui/pagination/PaginationWithTextWitIcon";
import Image from "next/image";
import Checkbox from "../form/input/Checkbox";
type Device = {
    id: number;
    image: string;
    name: string;
    address: string;
    group: string;
    volume: number;
    enabled: boolean;
};

type Props = {
    open: boolean;
    devices: Device[];
    initialGroupName?: string;
    onClose: () => void;
    onSave: (groupName: string, selectedDeviceIds: number[]) => void;
};

export default function AddGroupForm({ open, devices, initialGroupName = "", onClose, onSave }: Props) {
    const [groupName, setGroupName] = useState(initialGroupName);
    const [selected, setSelected] = useState<Record<number, boolean>>({});
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");


    useEffect(() => {
        if (open) {
            setGroupName(initialGroupName);
            setSelected({});
            setRowsPerPage(10);
            setCurrentPage(1);
            setSearch("");
        }
    }, [open, initialGroupName]);
    // Filtering and pagination (declare before conditional return so hooks order is stable)
    const filtered = devices.filter((d) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return d.name.toLowerCase().includes(q) || d.address.toLowerCase().includes(q) || String(d.id).includes(q);
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, total);
    const visible = filtered.slice(startIndex, endIndex);

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [totalPages, currentPage]);

    if (!open) return null;

    const toggle = (id: number) => {
        setSelected((s) => ({ ...s, [id]: !s[id] }));
    };

    const handleSave = () => {
        const ids = Object.keys(selected).filter((k) => selected[Number(k)]).map((k) => Number(k));
        onSave(groupName, ids);
        onClose();
    };

    // Rows per page handler
    const handleRowsPerPageChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        const newRowsPerPage = parseInt(e.target.value, 10); // Ensure base 10 parsing
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1); // Reset to first page when rows per page changes
    };

    return (
        <div className="fixed inset-0 z-[99999]">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <aside className="fixed right-0 top-0 h-full w-full max-w-[860px] bg-white dark:bg-gray-900 p-6 overflow-y-auto no-scrollbar rounded-l-2xl shadow-xl">
                <button onClick={onClose} className="absolute -left-5 top-4 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-gray-500">✕</button>

                <h3 className="text-xl font-semibold text-gray-800 mb-1">Add new group device</h3>
                <p className="text-sm text-gray-500 mb-6">Update your group device details.</p>

                <div className="mb-6">
                    <label className="block text-sm text-gray-600 mb-1">Group Device Name</label>
                    <input value={groupName} onChange={(e) => setGroupName(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" />
                </div>

                <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Device list</h4>
                    <div className="mb-3">
                        <label className="block text-sm text-gray-600 mb-1">Group Device Name</label>
                        <input value={groupName} onChange={(e) => setGroupName(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" />
                    </div>

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
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search..."
                                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                />
                            </div>
                        </div>
                    </div>


                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-gray-600">
                                    <th className="p-3">Select</th>
                                    <th className="p-3">Devices</th>
                                    <th className="p-3">Address</th>
                                    <th className="p-3">Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visible.map((d) => (
                                    <tr key={d.id} className="border-t">
                                        <td className="p-3">
                                            <Checkbox checked={!!selected[d.id]} onChange={() => toggle(d.id)} />
                                        </td>
                                        <td className="p-3">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{d.name}</span>
                                                <span className="text-xs text-gray-500">c{d.id.toString(16)}</span>
                                            </div>
                                        </td>
                                        <td className="p-3">{d.address}</td>
                                        <td className="p-3 w-20">
                                            <div className="w-10 h-10 relative">
                                                <Image src={d.image} alt={d.name} fill className="object-contain" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                    <div className="border-t border-gray-100 flex items-center justify-between">
                        <div className="pb-3 xl:pb-0">
                            <p className="pb-3 pl-[10px] text-sm font-medium text-center text-gray-500 border-b border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-b-0 xl:pb-0 xl:text-left">
                                Showing {startIndex + 1} to {endIndex} of {total} entries
                            </p>
                        </div>
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-6 flex justify-center">
                            <PaginationWithTextWitIcon totalPages={totalPages} initialPage={currentPage} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border text-sm">Close</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm">Add new</button>
                </div>
            </aside>
        </div>
    );
}

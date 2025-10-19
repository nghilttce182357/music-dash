"use client";
import Image from "next/image";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "@/icons";
import CountryMap from "./CountryMap";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import PaginationWithTextWitIcon from "../ui/pagination/PaginationWithTextWitIcon";

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // Table data
  const tableData = [
    {
      id: 1,
      name: "Macbook pro 13",
      variants: "2 Variants",
      category: "Laptop",
      price: "$2399.00",
      status: "Delivered",
      image: "/images/product/product-01.jpg",
      volume: 40,
      enabled: true,
      highlight: false,
    },
    {
      id: 2,
      name: "Apple Watch Ultra",
      variants: "1 Variant",
      category: "Watch",
      price: "$879.00",
      status: "Pending",
      image: "/images/product/product-02.jpg",
      volume: 60,
      enabled: true,
      highlight: false,
    },
    {
      id: 3,
      name: "iPhone 15 Pro Max",
      variants: "2 Variants",
      category: "SmartPhone",
      price: "$1869.00",
      status: "Delivered",
      image: "/images/product/product-03.jpg",
      volume: 50,
      enabled: true,
      highlight: true,
     
    },
    {
      id: 4,
      name: "iPad Pro 3rd Gen",
      variants: "2 Variants",
      category: "Electronics",
      price: "$1699.00",
      status: "Canceled",
      image: "/images/product/product-04.jpg",
      volume: 70,
      enabled: false,
      highlight: false,
    },
    {
      id: 5,
      name: "AirPods Pro 2nd Gen",
      variants: "1 Variant",
      category: "Accessories",
      price: "$240.00",
      status: "Delivered",
      image: "/images/product/product-05.jpg",
      volume: 40,
      enabled: true,
      highlight: false,
    },
  ];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div className="flex justify-between items-center w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Group device</h3>
          <div className="flex gap-2">
            <select className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
              <option>Select group device</option>
            </select>
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
              See all
            </button>
          </div>
        </div>

       
      </div>
      <div className="px-4 py-6 my-6 overflow-hidden border border-gary-200 rounded-2xl bg-gray-50 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
        <div
          id="mapOne"
          className="mapOne map-btn -mx-4 -my-6 h-[212px] w-[252px] 2xsm:w-[307px] xsm:w-[358px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]"
        >
          <CountryMap />
        </div>
      </div>

  <div className="max-w-full overflow-x-hidden">
      <Table>
        <TableHeader className="border-gray-100 border-y">
          <TableRow>
            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-xs">Products</TableCell>
            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-xs">Volume</TableCell>
            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-xs">Enable</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((product) => (
            <TableRow key={product.id} className={product.highlight ? "relative" : ""}>
              <TableCell className="py-3">
                <div className="flex items-center gap-3">
                  <Image
                    width={40}
                    height={40}
                    src={product.image}
                    className="h-10 w-10 rounded-md"
                    alt={product.name}
                  />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                    <span className="text-gray-500 text-xs">{product.variants}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-3 w-40">
                <div className="flex items-center gap-2">
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${product.volume}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-500 text-xs">{product.volume}%</span>
                  
                </div>
              </TableCell>
              <TableCell className="py-3">
                <label className="flex items-center justify-end w-full cursor-pointer">
                  <input type="checkbox" checked={product.enabled} readOnly className="sr-only peer" />
                  <span className="w-11 h-6 flex items-center bg-gray-200 rounded-full p-1 peer-checked:bg-blue-500 transition-colors">
                    <span className="w-4 h-4 bg-white rounded-full shadow-md transform peer-checked:translate-x-5 transition-transform"></span>
                  </span>
                </label>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Pagination */}
      <div className="mt-4">
        <PaginationWithTextWitIcon totalPages={10} initialPage={1} />
      </div>
    </div>
    </div>
  );
}

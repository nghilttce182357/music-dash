"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Switch from "../form/switch/Switch";

interface Device {
  id: number;
  image: string;
  name: string;
  address: string;
  group: string;
  volume: number;
  enabled: boolean;
}

type Props = {
  open: boolean;
  device: Device | null;
  onClose: () => void;
  onSave: (d: Device) => void;
};

export default function EditDeviceForm({ open, device, onClose, onSave }: Props) {
  const [form, setForm] = useState<Device | null>(null);

  useEffect(() => {
    if (open && device) {
      // clone to local state
      setForm({ ...device });
    } else if (!open) {
      setForm(null);
    }
  }, [open, device]);

  if (!open || !form) return null;

  const handleChange = <K extends keyof Device>(key: K, value: Device[K]) => {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  };

  const handleSave = () => {
    if (form) {
      onSave(form);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[99999]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-white dark:bg-gray-900 p-6 overflow-y-auto rounded-l-2xl shadow-xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -left-5 top-4 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-gray-500"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Edit device</h3>
        <p className="text-sm text-gray-500 mb-6">Update your device details.</p>

        <div className="flex justify-center mb-6">
          <div className="w-[260px] h-[140px] relative">
            <Image src={form.image} alt={form.name} fill className="object-contain" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 items-center mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Enable</span>
            <Switch defaultChecked={form.enabled} onChange={(v) => handleChange("enabled", v)} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Volumn</span>
              <div className="flex-1">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={form.volume}
                  onChange={(e) => handleChange("volume", Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <span className="text-xs text-gray-500">{form.volume}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Device Name</label>
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Device Group</label>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={form.group}
              onChange={(e) => handleChange("group", e.target.value)}
            >
              <option>Newsletter</option>
              <option>Current Affairs</option>
              <option>Weather Forecast</option>
              <option>Play Music</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Device code</label>
            <input className="w-full rounded-lg border px-3 py-2 text-sm bg-gray-50" readOnly value={`id-${form.id}`} />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Address</label>
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Tọa độ</label>
            <input className="w-full rounded-lg border px-3 py-2 text-sm bg-gray-50" readOnly value={`10.2712875 - 106.434478`} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border text-sm">Close</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm">Save</button>
        </div>
      </aside>
    </div>
  );
}

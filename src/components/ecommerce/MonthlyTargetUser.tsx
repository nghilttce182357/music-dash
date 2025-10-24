"use client";

import React, { useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  MoreVertical,
  ArrowUp,
  RotateCcw,
  RotateCw,
  Gauge,
  Timer,
  Cast,
} from "lucide-react";

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  cover: string;
}

const songsData: Song[] = [
  {
    id: 1,
    title: "Starboy",
    artist: "The Weeknd, Daft Punk",
    duration: "03:50 mins",
    cover: "/images/music/starboy.svg",
  },
  {
    id: 2,
    title: "Disaster",
    artist: "Conan Gray",
    duration: "03:58 mins",
    cover: "/images/music/disaster.svg",
  },
  {
    id: 3,
    title: "HANDSOME",
    artist: "Warren Hue",
    duration: "04:04 mins",
    cover: "/images/music/handsome.svg",
  },
  {
    id: 4,
    title: "Sharks",
    artist: "Imagine Dragons",
    duration: "02:23 mins",
    cover: "/images/music/sharks.svg",
  },
  {
    id: 5,
    title: "Fly Me To The Sun",
    artist: "Borrtex ft. Ebbos",
    duration: "04:20 mins",
    cover: "/images/music/thesun.svg",
  },
  {
    id: 6,
    title: "The Bended Man",
    artist: "Sunwalk",
    duration: "03:12 mins",
    cover: "/images/music/theman.svg",
  },
  {
    id: 7,
    title: "Somebody's Nobody",
    artist: "Alexander",
    duration: "02:48 mins",
    cover: "/images/music/nobody.svg",
  },
  {
    id: 8,
    title: "Acidrap",
    artist: "Various",
    duration: "03:22 mins",
    cover: "/images/music/acidrap1.svg",
  },
  {
    id: 9,
    title: "Save Your Tears",
    artist: "The Weeknd",
    duration: "03:35 mins",
    cover: "/images/music/saveyourtear.svg",
  },
  {
    id: 10,
    title: "Without You",
    artist: "The Kid LAROI",
    duration: "03:15 mins",
    cover: "/images/music/without.svg",
  },
  {
    id: 11,
    title: "Shades of Love",
    artist: "Ania Szarmach",
    duration: "03:45 mins",
    cover: "/images/music/shades.svg",
  },
  {
    id: 12,
    title: "HANDSOME",
    artist: "Warren Hue",
    duration: "04:04 mins",
    cover: "/images/music/handsome.svg",
  },
];

const MonthlyTargetUser: React.FC = () => {
  const [currentSong, setCurrentSong] = useState<Song>(songsData[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  return (
  <div className="bg-white rounded-3xl shadow-xl p-4 flex flex-col w-full" style={{maxWidth: '400px', margin: '0 auto'}}>
      {/* --- ALBUM --- */}
      <div className="w-full mb-2">
        <img
          src={currentSong.cover}
          alt={currentSong.title}
          className="w-full aspect-square rounded-3xl object-cover"
          style={{display: 'block'}}
        />
      </div>
      <h2 className="text-xl font-semibold text-center mt-3">{currentSong.title}</h2>
      <p className="text-gray-500 text-sm text-center">{currentSong.artist}</p>

      {/* --- Progress Bar --- */}
      <div className="w-full mt-4">
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div className="w-[60%] h-2 bg-[#FF9100] rounded-full"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1 font-medium">
          <span>03:35</span>
          <span>03:50</span>
        </div>
      </div>

      {/* --- Controls --- */}
      <div className="grid grid-cols-5 gap-2 mt-6 items-center justify-items-center">
        <button className="bg-transparent"><SkipBack size={28} className="text-gray-700" /></button>
        <button className="bg-transparent flex items-center justify-center relative">
          <RotateCcw size={32} className="text-gray-800" />
          <span className="absolute text-xs font-bold text-gray-800 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">10</span>
        </button>
        <button
          className="w-16 h-16 flex items-center justify-center bg-[#FF9100] text-white rounded-full shadow-md col-span-1"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause size={34} /> : <Play size={34} />}
        </button>
        <button className="bg-transparent flex items-center justify-center relative">
          <RotateCw size={32} className="text-gray-800" />
          <span className="absolute text-xs font-bold text-gray-800 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">10</span>
        </button>
        <button className="bg-transparent"><SkipForward size={28} className="text-gray-700" /></button>
      </div>

      {/* --- Extra Controls --- */}
      <div className="grid grid-cols-4 gap-2 mt-6 mb-2 items-center justify-items-center">
        <Gauge size={26} className="text-gray-700" />
        <Timer size={26} className="text-gray-700" />
        <Cast size={26} className="text-gray-700" />
        <MoreVertical size={26} className="text-gray-700" />
      </div>
      {/* --- Song List --- */}
      <div className="mt-8 w-full">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>560 songs</span>
          <span className="flex items-center gap-1 cursor-pointer text-[#FF9100] font-semibold">
            Ascending <ArrowUp size={14} className="text-[#FF9100]" />
          </span>
        </div>

        <div className="space-y-2">
          {songsData.map((song) => (
            <div
              key={song.id}
              onClick={() => setCurrentSong(song)}
              className={`flex items-center justify-between p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                currentSong.id === song.id
                  ? "bg-orange-50"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {song.title}
                  </p>
                  <p className="text-xs text-gray-500">{song.duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {currentSong.id === song.id && isPlaying ? (
                  <Pause size={18} className="text-orange-500" />
                ) : (
                  <Play size={18} className="text-orange-500" />
                )}
                <MoreVertical size={16} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-orange-500 text-sm mt-4 cursor-pointer hover:underline">
          See All
        </p>
      </div>
    </div>
  );
};

export default MonthlyTargetUser;

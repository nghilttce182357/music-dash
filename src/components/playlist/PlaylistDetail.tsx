"use client";

import React from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import PaginationWithTextWitIcon from "../ui/pagination/PaginationWithTextWitIcon";
import Checkbox from "../form/input/Checkbox";


type SongItem = { id: number; title: string; artist: string; duration: string; cover: string };

export default function PlaylistDetail({ id }: { id: string }) {
    const router = useRouter();
    // sample songs for the playlist detail
    const initialSongs: SongItem[] = [
        { id: 1, title: "Take My Breath", artist: "The Weeknd", duration: " ", cover: "/images/music/breath.svg" },
        { id: 2, title: "A Tale by Quincy", artist: "The Weeknd", duration: " ", cover: "/images/music/quincy.svg" },
        { id: 3, title: "Out of Time", artist: "The Weeknd", duration: "", cover: "/images/music/time.svg" },
        { id: 4, title: "Take My Breath", artist: "The Weeknd", duration: "", cover: "/images/music/breath.svg" },
        { id: 5, title: "A Tale by Quincy", artist: "The Weeknd", duration: "", cover: "/images/music/quincy.svg" },
        { id: 6, title: "Out of Time", artist: "The Weeknd", duration: "", cover: "/images/music/time.svg" },
    ];

    const [activeTab, setActiveTab] = React.useState<"media" | "playlist">("playlist");

    // local state so we can delete / filter
    const [songs, setSongs] = React.useState<SongItem[]>(initialSongs);
    const [selected, setSelected] = React.useState<Set<number>>(new Set());
    const [searchTerm, setSearchTerm] = React.useState("");

    function toggle(id: number) {
        const next = new Set(selected);
        if (next.has(id)) next.delete(id); else next.add(id);
        setSelected(next);
    }

    const handleDeleteSelected = () => {
        if (!selected || selected.size === 0) return;
        setSongs(prev => prev.filter(s => !selected.has(s.id)));
        setSelected(new Set());
    };

    const filteredSongs = React.useMemo(() => {
        if (!searchTerm) return songs;
        const q = searchTerm.toLowerCase();
        return songs.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
    }, [songs, searchTerm]);

    return (
        <div className="w-full min-h-screen px-6 py-6">
            <div className="flex items-center justify-start">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => { router.push('/media'); setActiveTab("media"); }}
                            className={`pb-3 font-semibold border-b-2 transition-colors ${activeTab === "media"
                                ? "text-orange-500 border-orange-400"
                                : "text-gray-400 border-transparent"
                                }`}
                        >
                            Media
                        </button>
                        <button
                            onClick={() => setActiveTab("playlist")}
                            className={`pb-3 font-semibold border-b-2 transition-colors ${activeTab === "playlist"
                                ? "text-orange-500 border-orange-400"
                                : "text-gray-400 border-transparent"
                                }`}
                        >
                            Play list
                        </button>
                    </div>
                </div>
            <div className="mt-6 flex items-start gap-6">
                <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-md">
                    <Image src="/images/music/starboy.svg" width={224} height={224} alt="cover" className="object-cover w-full h-full" />
                </div>

                <div className="flex-1">
                    {/* Group title/meta and buttons into a single white rounded container */}
                    <div className=" p-8 md:p-15  flex flex-col md:flex-row md:items-start md:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold">The Weeknd</h1>
                            <div className="text-sm text-gray-500 mt-2">1 Album &nbsp;|&nbsp; 16 Songs &nbsp;|&nbsp; 01:20:38 mins</div>
                        </div>

                        <div className="mt-4 md:mt-6 flex items-center gap-6">
                            <button
                                className="flex items-center gap-3 px-10 py-3 rounded-full text-white text-sm"
                                style={{ background: 'linear-gradient(180deg,#ff8a2b,#f97316)', boxShadow: '0 12px 30px rgba(249,115,22,0.18)', minWidth: 180 }}
                            >
                                
                                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.9699 3.71967C19.2628 3.42678 19.7376 3.42678 20.0305 3.71967L22.2804 5.96957C22.5733 6.26246 22.5733 6.73733 22.2804 7.03023L20.0303 9.28033C19.7374 9.57322 19.2626 9.57322 18.9697 9.28033C18.6768 8.98744 18.6768 8.51256 18.9697 8.21967L19.9393 7.25L17.1865 7.25C16.9685 7.25 16.7614 7.34482 16.6189 7.50979L12.741 12L16.6189 16.4902C16.7614 16.6552 16.9685 16.75 17.1865 16.75H19.9395L18.9699 15.7803C18.677 15.4874 18.677 15.0126 18.9699 14.7197C19.2628 14.4268 19.7376 14.4268 20.0305 14.7197L22.2804 16.9696C22.5733 17.2625 22.5733 17.7373 22.2804 18.0302L20.0303 20.2803C19.7374 20.5732 19.2626 20.5732 18.9697 20.2803C18.6768 19.9874 18.6768 19.5126 18.9697 19.2197L19.9393 18.25H17.1865C16.5326 18.25 15.9111 17.9655 15.4837 17.4706L11.75 13.1475L8.01634 17.4706C7.58894 17.9655 6.96738 18.25 6.31349 18.25H3.25C2.83579 18.25 2.5 17.9142 2.5 17.5C2.5 17.0858 2.83579 16.75 3.25 16.75H6.31349C6.53145 16.75 6.73864 16.6552 6.8811 16.4902L10.759 12L6.8811 7.50979C6.73864 7.34482 6.53145 7.25 6.31349 7.25H3.25C2.83579 7.25 2.5 6.91421 2.5 6.5C2.5 6.08579 2.83579 5.75 3.25 5.75H6.31349C6.96738 5.75 7.58894 6.03447 8.01634 6.52936L11.75 10.8525L15.4837 6.52936C15.9111 6.03447 16.5326 5.75 17.1865 5.75L19.9395 5.75L18.9699 4.78033C18.677 4.48744 18.677 4.01256 18.9699 3.71967Z" fill="#fff"/>
</svg>

                                <span className="font-medium">Shuffle</span>
                            </button>

                            <button className="flex items-center gap-3 px-8 py-3 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-sm">
                                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm">
                                    <span className="w-4 h-4 flex items-center justify-center rounded-full bg-amber-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white ml-0.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
                                        </svg>
                                    </span>
                                </span>
                                <span className="font-medium">Play</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* header row: count left, search+controls right */}
            <div className="mt-6 flex items-center justify-between">
                <div className="text-gray-800 font-semibold">{filteredSongs.length} songs</div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-11 w-[420px] rounded-lg border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-600" placeholder="Search..." />
                    </div>

                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg className="stroke-current fill-white dark:fill-gray-800" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.29004 5.90393H17.7067" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17.7075 14.0961H2.29085" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z" fill="" stroke="" strokeWidth="1.5" />
              <path d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z" fill="" stroke="" strokeWidth="1.5" />
            </svg>
            Filter
          </button>
                    <button
                        onClick={handleDeleteSelected}
                        disabled={selected.size === 0}
                        className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-theme-sm font-medium ${selected.size === 0
                            ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${selected.size === 0 ? 'text-gray-300' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M3 6h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 11v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 11v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Delete
                    </button>
                </div>
            </div>

                    <div className="mt-6 rounded-xl border border-gray-200 bg-white">
                <div className="divide-y divide-gray-100">
                    {filteredSongs.map((s) => (
                        <div key={s.id} className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center gap-4">
                                
                                <Checkbox checked={selected.has(s.id)} onChange={() => toggle(s.id)}/>
                                <div className="w-12 h-12 rounded-lg overflow-hidden">
                                    <Image src={s.cover} width={48} height={48} alt={s.title} className="object-cover" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-800 text-sm">{s.title}</div>
                                    <div className="text-gray-500 text-xs mt-1">{s.artist}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-gray-500 text-sm">{s.duration}</div>
                                <button aria-label="play" className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-500 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
                                    </svg>
                                </button>

                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 flex items-center justify-center">
                <PaginationWithTextWitIcon totalPages={5} initialPage={1} />
            </div>
        </div>
    );
}

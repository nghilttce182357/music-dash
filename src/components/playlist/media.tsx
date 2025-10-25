"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { TEKNIX_USER_ACCESS_TOKEN } from "@/utils/constants";

import PaginationWithTextWitIcon from "../ui/pagination/PaginationWithTextWitIcon";
import { TrashBinIcon } from "@/icons";
import { Modal } from "../ui/modal";
import DropzoneComponent from "../form/form-elements/DropZone";
import Checkbox from "../form/input/Checkbox";

// ===== Types =====
type Music = {
  id: string;
  title: string;
  artist?: string;
  durationSeconds: number;
  fileUrl: string;
  cover?: string;
};

type Playlist = {
  id: string;
  name: string;
  coverUrl?: string;
  userId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  totalDurationSeconds: number;
  trackCount: number;
};

// ===== API config =====
const MUSIC_API_URL = `/api/v1/music`;
const PLAYLISTS_API_URL = `/api/v1/playlists`;

export default function BasicTableOne() {
  // Pagination state - Music
  const [currentMusicPage, setCurrentMusicPage] = React.useState(1);
  const [musicPageSize] = React.useState(20);
  const [totalMusicItems, setTotalMusicItems] = React.useState(0);
  const [totalMusicPages, setTotalMusicPages] = React.useState(1);

  // Pagination state - Playlists
  const [currentPlaylistPage, setCurrentPlaylistPage] = React.useState(1);
  const [playlistPageSize] = React.useState(20);
  const [totalPlaylistItems, setTotalPlaylistItems] = React.useState(0);
  const [totalPlaylistPages, setTotalPlaylistPages] = React.useState(1);

  // UI state
  const [activeTab, setActiveTab] = React.useState<"media" | "playlist">("media");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  // Data
  const [music, setMusic] = React.useState<Music[]>([]);
  const [playlists, setPlaylists] = React.useState<Playlist[]>([]);

  // Selection
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [selectedPlaylistIds, setSelectedPlaylistIds] = React.useState<Set<string>>(new Set());

  // Form: media
  const [mediaName, setMediaName] = React.useState("");
  const [mediaLink, setMediaLink] = React.useState("");
  const [mediaPlaylist, setMediaPlaylist] = React.useState("The Weeknd");
  const [mediaCover, setMediaCover] = React.useState<string | null>(null);

  // Form: playlist
  const [playlistName, setPlaylistName] = React.useState("");
  const [playlistCover, setPlaylistCover] = React.useState<string | null>(null);

  // Loading / Error
  const [loadingMusic, setLoadingMusic] = React.useState(false);
  const [musicError, setMusicError] = React.useState<string | null>(null);
  const [loadingPlaylists, setLoadingPlaylists] = React.useState(false);
  const [playlistsError, setPlaylistsError] = React.useState<string | null>(null);

  // Audio playback state
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentPlayingId, setCurrentPlayingId] = React.useState<string | null>(null);

  // Helpers
  const resetForm = () => {
    setMediaName("");
    setMediaLink("");
    setMediaPlaylist("The Weeknd");
    setMediaCover(null);
    setPlaylistName("");
    setPlaylistCover(null);
  };

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });

  // ====== Fetch music from API with pagination ======
  React.useEffect(() => {
    let canceled = false;
    (async () => {
      setLoadingMusic(true);
      setMusicError(null);
      try {
        const response = await axios.get(MUSIC_API_URL, {
          headers: {
            Authorization: `Bearer ${TEKNIX_USER_ACCESS_TOKEN}`,
          },
          params: {
            page: currentMusicPage,
            pageSize: musicPageSize,
          },
        });

        const raw = response.data;

        if (!raw?.success || !raw?.data?.data || !Array.isArray(raw.data.data)) {
          throw new Error("Invalid music payload (expected array)");
        }

        const formatted: Music[] = raw.data.data.map((item: any) => ({
          id: item.id,
          title: item.title ?? "Unknown Title",
          artist: item.artist ?? "Unknown Artist",
          durationSeconds: item.durationSeconds ?? 0,
          fileUrl: item.fileUrl,
          cover: item.cover ?? "/images/music/default-cover.svg",
        }));

        if (!canceled) {
          setMusic(formatted);
          setTotalMusicItems(raw.data.total ?? 0);
          setTotalMusicPages(raw.data.totalPages ?? 1);
        }
      } catch (err: any) {
        if (!canceled) {
          setMusicError(err?.message ?? "Failed to fetch music");
          setMusic([]);
        }
      } finally {
        if (!canceled) setLoadingMusic(false);
      }
    })();
    return () => {
      canceled = true;
    };
  }, [currentMusicPage, musicPageSize]);

  // ====== Fetch playlists from API with pagination ======
  React.useEffect(() => {
    let canceled = false;
    (async () => {
      setLoadingPlaylists(true);
      setPlaylistsError(null);
      try {
        const response = await axios.get(PLAYLISTS_API_URL, {
          headers: {
            Authorization: `Bearer ${TEKNIX_USER_ACCESS_TOKEN}`,
          },
          params: {
            page: currentPlaylistPage,
            pageSize: playlistPageSize,
          },
        });

        const raw = response.data;

        if (!raw?.success || !raw?.data?.data || !Array.isArray(raw.data.data)) {
          throw new Error("Invalid playlists payload (expected array)");
        }

        const formatted: Playlist[] = raw.data.data.map((item: any) => ({
          id: item.id,
          name: item.name ?? "Untitled",
          coverUrl: item.coverUrl,
          userId: item.userId,
          isPublic: item.isPublic ?? false,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          totalDurationSeconds: item.totalDurationSeconds ?? 0,
          trackCount: item.trackCount ?? 0,
        }));

        if (!canceled) {
          setPlaylists(formatted);
          setTotalPlaylistItems(raw.data.total ?? 0);
          setTotalPlaylistPages(raw.data.totalPages ?? 1);
        }
      } catch (err: any) {
        if (!canceled) {
          setPlaylistsError(err?.message ?? "Failed to fetch playlists");
          setPlaylists([]);
        }
      } finally {
        if (!canceled) setLoadingPlaylists(false);
      }
    })();
    return () => {
      canceled = true;
    };
  }, [currentPlaylistPage, playlistPageSize]);

  // Handle page change for music
  const handleMusicPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalMusicPages) {
      setCurrentMusicPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle page change for playlists
  const handlePlaylistPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPlaylistPages) {
      setCurrentPlaylistPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle play/pause for audio
  const handlePlayPause = (item: Music) => {
    const audio = document.getElementById(`audio-${item.id}`) as HTMLAudioElement;

    if (!audio) return;

    // Stop all other audios
    document.querySelectorAll("audio").forEach((a) => {
      if (a.id !== `audio-${item.id}`) {
        a.pause();
      }
    });

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
      setCurrentPlayingId(item.id);
    } else {
      audio.pause();
      setIsPlaying(false);
      setCurrentPlayingId(null);
    }
  };

  // Actions
  const handleSaveMedia = () => {
    const newId = String(Date.now());
    const newMusic: Music = {
      id: newId,
      title: mediaName || "Untitled",
      artist: mediaPlaylist,
      durationSeconds: 0,
      fileUrl: mediaLink || "",
      cover: mediaCover || "/images/music/default-cover.svg",
    };
    setMusic((prev) => [newMusic, ...prev]);
    setTotalMusicItems((prev) => prev + 1);
    setIsAddOpen(false);
    resetForm();

    // (Optional) POST to API if you want
    // axios.post(MUSIC_API_URL, { ...newMusic }, { headers: { Authorization: ... } });
  };

  const handleSavePlaylist = async () => {
    try {
      const payload = {
        name: playlistName || "Untitled",
        coverUrl: playlistCover,
        isPublic: true,
      };

      const response = await axios.post(PLAYLISTS_API_URL, payload, {
        headers: {
          Authorization: `Bearer ${TEKNIX_USER_ACCESS_TOKEN}`,
        },
      });

      if (response.data?.success) {
        // Refresh playlists list
        setCurrentPlaylistPage(1);
        setIsAddOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving playlist:", error);
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedIds.size) return;

    try {
      // Optional: Call API to delete selected music
      // await axios.post(`${MUSIC_API_URL}/delete-bulk`, 
      //   { ids: Array.from(selectedIds) },
      //   { headers: { Authorization: `Bearer ${TEKNIX_USER_ACCESS_TOKEN}` } }
      // );

      setMusic((prev) => prev.filter((s) => !selectedIds.has(s.id)));
      setSelectedIds(new Set());
      setTotalMusicItems((prev) => Math.max(0, prev - selectedIds.size));

      // Recalculate total pages
      const newTotal = totalMusicItems - selectedIds.size;
      const newTotalPages = Math.ceil(newTotal / musicPageSize);
      setTotalMusicPages(newTotalPages);

      // If current page is now empty, go to previous page
      if (currentMusicPage > newTotalPages && newTotalPages > 0) {
        setCurrentMusicPage(newTotalPages);
      }
    } catch (error) {
      console.error("Error deleting music:", error);
    }
  };

  const handleDeleteSelectedPlaylists = async () => {
    if (!selectedPlaylistIds.size) return;

    try {
      // Call API to delete selected playlists
      for (const playlistId of Array.from(selectedPlaylistIds)) {
        await axios.delete(`${PLAYLISTS_API_URL}/${playlistId}`, {
          headers: {
            Authorization: `Bearer ${TEKNIX_USER_ACCESS_TOKEN}`,
          },
        });
      }

      setPlaylists((prev) => prev.filter((p) => !selectedPlaylistIds.has(p.id)));
      setSelectedPlaylistIds(new Set());
      setTotalPlaylistItems((prev) => Math.max(0, prev - selectedPlaylistIds.size));

      // Recalculate total pages
      const newTotal = totalPlaylistItems - selectedPlaylistIds.size;
      const newTotalPages = Math.ceil(newTotal / playlistPageSize);
      setTotalPlaylistPages(newTotalPages);

      // If current page is now empty, go to previous page
      if (currentPlaylistPage > newTotalPages && newTotalPages > 0) {
        setCurrentPlaylistPage(newTotalPages);
      }
    } catch (error) {
      console.error("Error deleting playlists:", error);
    }
  };

  // Derived
  const filteredMusic = music.filter((s) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return s.title.toLowerCase().includes(q) || (s.artist ?? "").toLowerCase().includes(q);
  });

  const filteredPlaylists = playlists.filter((p) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return p.name.toLowerCase().includes(q);
  });

  // Convert seconds to mm:ss
  const formatDuration = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full min-h-screen px-6 py-6">
      {/* Tabs */}
      <div className="mb-4">
        <div className="flex items-center justify-start">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setActiveTab("media");
                setCurrentMusicPage(1);
              }}
              className={`pb-3 font-semibold border-b-2 transition-colors ${activeTab === "media" ? "text-orange-500 border-orange-400" : "text-gray-400 border-transparent"
                }`}
            >
              Media
            </button>
            <button
              onClick={() => {
                setActiveTab("playlist");
                setCurrentPlaylistPage(1);
              }}
              className={`pb-3 font-semibold border-b-2 transition-colors ${activeTab === "playlist" ? "text-orange-500 border-orange-400" : "text-gray-400 border-transparent"
                }`}
            >
              Play list
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-gray-800 font-semibold">
            {activeTab === "media" ? `${totalMusicItems} music` : `${totalPlaylistItems} Play list`}
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentMusicPage(1);
                  setCurrentPlaylistPage(1);
                }}
                type="text"
                placeholder="Search..."
                className="h-11 w-[420px] rounded-lg border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-600 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>

            {/* Filter placeholder */}
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800">
              <svg className="stroke-current fill-white" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2.29 5.90393H17.7067" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17.7075 14.0961H2.29085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z" strokeWidth="1.5" />
                <path d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z" strokeWidth="1.5" />
              </svg>
              Filter
            </button>

            {/* Bulk delete */}
            <button
              onClick={() => {
                if (activeTab === "media") handleDeleteSelected();
                else handleDeleteSelectedPlaylists();
              }}
              disabled={activeTab === "media" ? selectedIds.size === 0 : selectedPlaylistIds.size === 0}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-theme-sm font-medium ${activeTab === "media" ? selectedIds.size === 0 : selectedPlaylistIds.size === 0
                ? "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800"
                }`}
            >
              <TrashBinIcon
                className={`w-4 h-4 ${activeTab === "media" ? selectedIds.size === 0 : selectedPlaylistIds.size === 0 ? "text-gray-300" : "text-gray-500"
                  }`}
              />
              Delete
            </button>

            {/* Add new */}
            <button
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm"
            >
              + Add new
            </button>
          </div>
        </div>
      </div>

      {/* ========= TAB: MEDIA (MUSIC) ========= */}
      {activeTab === "media" && (
        <>
          <div className="rounded-xl border border-gray-200 bg-white">
            {/* Loading / error state */}
            {loadingMusic && <div className="px-6 py-8 text-sm text-gray-500">Loading music…</div>}
            {!!musicError && !loadingMusic && <div className="px-6 py-8 text-sm text-red-600">Failed to load music: {musicError}</div>}

            {!loadingMusic && !musicError && (
              <>
                <div className="divide-y divide-gray-100">
                  {filteredMusic.length > 0 ? (
                    filteredMusic.map((item) => (
                      <div key={item.id} className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                          <Checkbox
                            checked={selectedIds.has(item.id)}
                            onChange={(checked) => {
                              const next = new Set(selectedIds);
                              if (checked) next.add(item.id);
                              else next.delete(item.id);
                              setSelectedIds(next);
                            }}
                            className="w-4 h-4 text-indigo-600 rounded"
                          />

                          <div className="w-14 h-14 rounded-lg overflow-hidden">
                            <Image
                              src={item.cover ?? "/images/music/default-cover.svg"}
                              width={56}
                              height={56}
                              alt={item.title}
                              className="object-cover"
                            />
                          </div>

                          <div>
                            <div className="font-semibold text-gray-800 text-sm">{item.title}</div>
                            <div className="text-gray-500 text-xs mt-1">
                              {item.artist ?? "Unknown Artist"} &nbsp;|&nbsp; {formatDuration(item.durationSeconds)} mins
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {/* Hidden audio element */}
                          <audio
                            id={`audio-${item.id}`}
                            src={item.fileUrl}
                            onEnded={() => {
                              setIsPlaying(false);
                              setCurrentPlayingId(null);
                            }}
                          />

                          {/* Play/Pause Button */}
                          <button
                            onClick={() => handlePlayPause(item)}
                            aria-label="play"
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-500 text-white shadow hover:bg-orange-600 transition-colors"
                          >
                            {isPlaying && currentPlayingId === item.id ? (
                              // Pause icon
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M6 4h3v12H6zM11 4h3v12h-3z" />
                              </svg>
                            ) : (
                              // Play icon
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
                              </svg>
                            )}
                          </button>

                          {/* More button */}
                          <button
                            aria-label="more"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-8 text-sm text-gray-500">No music found.</div>
                  )}
                </div>

                {music.length > 0 && (
                  <div className="mt-4 flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      Showing {(currentMusicPage - 1) * musicPageSize + 1} to {Math.min(currentMusicPage * musicPageSize, totalMusicItems)} of {totalMusicItems} music
                    </div>
                    <div className="flex-1 flex justify-center">
                      <PaginationWithTextWitIcon
                        totalPages={totalMusicPages}
                        initialPage={currentMusicPage}
                        onPageChange={handleMusicPageChange}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* ========= TAB: PLAYLIST ========= */}
      {activeTab === "playlist" && (
        <>
          {loadingPlaylists && <div className="px-6 py-8 text-sm text-gray-500">Loading playlists…</div>}
          {!!playlistsError && !loadingPlaylists && <div className="px-6 py-8 text-sm text-red-600">Failed to load playlists: {playlistsError}</div>}

          {!loadingPlaylists && !playlistsError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {filteredPlaylists.length > 0 ? (
                <>
                  {filteredPlaylists.map((item) => (
                    <div key={item.id} className="relative">
                      <Link href={`/media/playlist/${item.id}`}>
                        <div className="p-4">
                          <div className="w-36 h-36 rounded-lg overflow-hidden bg-gray-100">
                            {item.coverUrl ? (
                              <img
                                src={item.coverUrl}
                                width={144}
                                height={144}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg
                                  className="w-12 h-12 text-gray-300"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                                </svg>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 text-left">
                            <h4 className="font-semibold text-gray-800 text-sm mb-1">{item.name}</h4>
                            <p className="text-xs text-gray-500">
                              {new Date(item.createdAt).getFullYear()}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">{item.trackCount} songs</p>
                          </div>
                        </div>

                        <div className="border-t border-gray-100" />
                      </Link>

                      {/* Checkbox for selection */}
                      <div className="absolute top-3 right-3 z-10">
                        <Checkbox
                          checked={selectedPlaylistIds.has(item.id)}
                          onChange={(checked) => {
                            const next = new Set(selectedPlaylistIds);
                            if (checked) next.add(item.id);
                            else next.delete(item.id);
                            setSelectedPlaylistIds(next);
                          }}
                          className="w-4 h-4 text-indigo-600 rounded bg-white"
                        />
                      </div>
                    </div>
                  ))}

                  {totalPlaylistPages > 1 && (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-6 flex justify-center">
                      <PaginationWithTextWitIcon
                        totalPages={totalPlaylistPages}
                        initialPage={currentPlaylistPage}
                        onPageChange={handlePlaylistPageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-8 text-gray-500">No playlists found.</div>
              )}
            </div>
          )}
        </>
      )}

      {/* ========= MODAL (Add new) ========= */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} className="!m-0 !p-0">
        <div className="fixed inset-0 z-50 flex">
          <div onClick={() => setIsAddOpen(false)} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <aside className="relative ml-auto w-full max-w-[560px] h-screen bg-white rounded-l-2xl shadow-xl flex flex-col">
            <div className="p-6 overflow-y-auto flex-1">
              <button
                onClick={() => setIsAddOpen(false)}
                aria-label="close"
                className="absolute right-6 top-6 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 8.586L15.293 3.293a1 1 0 111.414 1.414L11.414 10l5.293 5.293a1 1 0 01-1.414 1.414L10 11.414l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 10 3.293 4.707a1 1 0 011.414-1.414L10 8.586z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {activeTab === "playlist" ? "Add new play list" : "Add new music"}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {activeTab === "playlist" ? "Create your play list details." : "Add your music details."}
              </p>

              <div className="space-y-5">
                {activeTab === "playlist" ? (
                  <>
                    <label className="flex flex-col">
                      <span className="text-sm text-gray-600 mb-2">Play list name</span>
                      <input
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm"
                        placeholder="Enter playlist name"
                      />
                    </label>

                    <div>
                      <div className="mb-2 text-sm text-gray-600">Cover Image</div>
                      <div className="rounded-lg border border-dashed border-gray-200 p-4">
                        <div className="max-h-[300px] p-3">
                          <DropzoneComponent
                            onFileChange={async (file: File) => {
                              try {
                                const url = await readFileAsDataUrl(file);
                                setPlaylistCover(url);
                              } catch { }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <label className="flex flex-col">
                      <span className="text-sm text-gray-600 mb-2">Music Name</span>
                      <input
                        value={mediaName}
                        onChange={(e) => setMediaName(e.target.value)}
                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm"
                        placeholder="Enter music name"
                      />
                    </label>

                    <label className="flex flex-col">
                      <span className="text-sm text-gray-600 mb-2">File URL</span>
                      <input
                        value={mediaLink}
                        onChange={(e) => setMediaLink(e.target.value)}
                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm"
                        placeholder="Enter file URL"
                      />
                    </label>

                    <label className="flex flex-col">
                      <span className="text-sm text-gray-600 mb-2">Playlist</span>
                      <select
                        value={mediaPlaylist}
                        onChange={(e) => setMediaPlaylist(e.target.value)}
                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm"
                      >
                        <option>The Weeknd</option>
                        <option>Conan Gray</option>
                      </select>
                    </label>

                    <div>
                      <div className="mb-2 text-sm text-gray-600">Cover Image</div>
                      <div className="rounded-lg border border-dashed border-gray-200 p-4">
                        <div className="max-h-[300px] p-3">
                          <DropzoneComponent
                            onFileChange={async (file: File) => {
                              try {
                                const url = await readFileAsDataUrl(file);
                                setMediaCover(url);
                              } catch { }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 p-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setIsAddOpen(false);
                }}
                className="px-4 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              >
                Close
              </button>

              {activeTab === "playlist" ? (
                <button onClick={handleSavePlaylist} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  Add new
                </button>
              ) : (
                <button onClick={handleSaveMedia} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  Save Changes
                </button>
              )}
            </div>
          </aside>
        </div>
      </Modal>
    </div>
  );
}
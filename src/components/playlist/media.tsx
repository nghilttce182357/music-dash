"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import mockapi from "@/utils/mockapi";

import PaginationWithTextWitIcon from "../ui/pagination/PaginationWithTextWitIcon";
import { TrashBinIcon } from "@/icons";
import { Modal } from "../ui/modal";
import DropzoneComponent from "../form/form-elements/DropZone";
import Checkbox from "../form/input/Checkbox";
import { MOCK_API_URL } from "@/utils/constants";

type Song = {
  id: number;
  title: string;
  artist: string;
  duration: string;
  cover: string;
};

type Playlist = {
  id: number;
  name: string;
  artist: string | number;
  year: number;
  cover: string;
  songs: number;
};

// ===== Optional seed playlists (xóa hoặc thay bằng API nếu bạn có endpoint) =====
const initialPlaylists: Playlist[] = [
  { id: 1, name: "Dawn FM", artist: "The Weeknd", year: 2022, cover: "/images/music/starboy.svg", songs: 16 },
  { id: 2, name: "Sweetener", artist: "Ariana Grande", year: 2021, cover: "/images/music/sweetener.svg", songs: 16 },
  { id: 3, name: "First Impact", artist: "Treasure", year: 2021, cover: "/images/music/firstimpact.svg", songs: 14 },
  { id: 4, name: "Lorem Ipsum", artist: "Nova", year: 2021, cover: "/images/music/nova.svg", songs: 15 },
  { id: 5, name: "Acidrap", artist: "Acidrap", year: 2022, cover: "/images/music/acidrap1.svg", songs: 22 },
  { id: 6, name: "Pain (Official)", artist: "Ryan Jones", year: 2021, cover: "/images/music/pain.svg", songs: 18 },
  { id: 7, name: "Sweetener", artist: "Ariana Grande", year: 2021, cover: "/images/music/sweetener.svg", songs: 16 },
  { id: 8, name: "First Impact", artist: "Treasure", year: 2021, cover: "/images/music/firstimpact.svg", songs: 14 },
  { id: 9, name: "Dawn FM", artist: "The Weeknd", year: 2022, cover: "/images/music/starboy.svg", songs: 16 },
];

// ====== Config API ======
const SONGS_API_URL = `${MOCK_API_URL}/teknix/project1/songs`;
// Nếu có playlists API, bật dòng sau và dùng nó trong effect tương tự songs:
// const PLAYLISTS_API_URL = `${API_BASE}/teknix/project1/playlists`;

export default function BasicTableOne() {
  // UI state
  const [activeTab, setActiveTab] = React.useState<"media" | "playlist">("media");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  // Data
  const [songs, setSongs] = React.useState<Song[]>([]);
  const [playlists, setPlaylists] = React.useState<Playlist[]>(initialPlaylists);

  // Selection
  const [selectedIds, setSelectedIds] = React.useState<Set<number>>(new Set());
  const [selectedPlaylistIds, setSelectedPlaylistIds] = React.useState<Set<number>>(new Set());

  // Form: media
  const [mediaName, setMediaName] = React.useState("");
  const [mediaLink, setMediaLink] = React.useState("");
  const [mediaPlaylist, setMediaPlaylist] = React.useState("The Weeknd");
  const [mediaCover, setMediaCover] = React.useState<string | null>(null);

  // Form: playlist
  const [playlistName, setPlaylistName] = React.useState("");
  const [playlistCover, setPlaylistCover] = React.useState<string | null>(null);

  // Loading / Error
  const [loadingSongs, setLoadingSongs] = React.useState(false);
  const [songsError, setSongsError] = React.useState<string | null>(null);

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

  // ====== Fetch songs (API-first, no localStorage) ======
  React.useEffect(() => {
    let canceled = false;

    (async () => {
      setLoadingSongs(true);
      setSongsError(null);
      try {
        const res = await mockapi.get(SONGS_API_URL, { withCredentials: true });
        const data = res.data;

        if (!Array.isArray(data)) {
          throw new Error("Invalid songs payload (expected array)");
        }

        const formatted: Song[] = data.map((item: any, index: number) => ({
          id: Number(item.id ?? index + 1),
          title: String(item.title ?? "Unknown Title"),
          artist: String(item.artist ?? "Unknown Artist"),
          duration: String(item.duration ?? "00:00"),
          cover: String(item.cover ?? "/images/music/default-cover.svg"),
        }));

        if (!canceled) setSongs(formatted);
      } catch (err: any) {
        if (!canceled) setSongsError(err?.message ?? "Failed to fetch songs");
      } finally {
        if (!canceled) setLoadingSongs(false);
      }
    })();

    return () => {
      canceled = true;
    };
  }, []);

  // Nếu có API playlists, bạn có thể fetch tương tự như trên
  // React.useEffect(() => {
  //   let canceled = false;
  //   (async () => {
  //     try {
  //       const res = await mockapi.get(PLAYLISTS_API_URL, { withCredentials: true });
  //       const data = res.data;
  //       if (!Array.isArray(data)) throw new Error("Invalid playlists payload");
  //       const normalized: Playlist[] = data.map((p: any, idx: number) => ({
  //         id: Number(p.id ?? idx + 1),
  //         name: String(p.name ?? "Untitled"),
  //         artist: String(p.artist ?? "Unknown"),
  //         year: Number(p.year ?? new Date().getFullYear()),
  //         cover: String(p.cover ?? "/images/music/default-cover.svg"),
  //         songs: Number(p.songs ?? 0)
  //       }));
  //       if (!canceled) setPlaylists(normalized);
  //     } catch (e) {
  //       // Giữ initialPlaylists nếu API fail
  //     }
  //   })();
  //   return () => { canceled = true; };
  // }, []);

  // Actions
  const handleSaveMedia = () => {
    const newId = songs.length ? Math.max(...songs.map((s) => s.id)) + 1 : 1;
    const newSong: Song = {
      id: newId,
      title: mediaName || "Untitled",
      artist: mediaPlaylist,
      duration: "00:00",
      cover: mediaCover || "/images/music/default-cover.svg",
    };
    setSongs((prev) => [newSong, ...prev]);
    setIsAddOpen(false);
    resetForm();

    // (Optional) POST lên API nếu bạn muốn lưu server-side:
    // mockapi.post(SONGS_API_URL, { ...payload });
  };

  const handleSavePlaylist = () => {
    const newId = playlists.length ? Math.max(...playlists.map((p) => p.id)) + 1 : 1;
    const newItem: Playlist = {
      id: newId,
      name: playlistName || "Untitled",
      artist: "Unknown",
      year: new Date().getFullYear(),
      cover: playlistCover || "/images/music/default-cover.svg",
      songs: 0,
    };
    setPlaylists((prev) => [newItem, ...prev]);
    setIsAddOpen(false);
    setPlaylistName("");
    setPlaylistCover(null);

    // (Optional) POST playlist API
    // mockapi.post(PLAYLISTS_API_URL, { ...payload });
  };

  const handleDeleteSelected = () => {
    if (!selectedIds.size) return;
    setSongs((prev) => prev.filter((s) => !selectedIds.has(s.id)));
    setSelectedIds(new Set());
    // (Optional) gọi API delete theo IDs
  };

  const handleDeleteSelectedPlaylists = () => {
    if (!selectedPlaylistIds.size) return;
    setPlaylists((prev) => prev.filter((p) => !selectedPlaylistIds.has(p.id)));
    setSelectedPlaylistIds(new Set());
    // (Optional) gọi API delete theo IDs
  };

  // Derived
  const filteredSongs = songs.filter((s) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q);
  });

  const filteredPlaylists = playlists.filter((p) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return p.name.toLowerCase().includes(q) || String(p.artist).toLowerCase().includes(q);
  });

  return (
    <div className="w-full min-h-screen px-6 py-6">
      {/* Tabs */}
      <div className="mb-4">
        <div className="flex items-center justify-start">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("media")}
              className={`pb-3 font-semibold border-b-2 transition-colors ${activeTab === "media" ? "text-orange-500 border-orange-400" : "text-gray-400 border-transparent"
                }`}
            >
              Media
            </button>
            <button
              onClick={() => setActiveTab("playlist")}
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
            {activeTab === "media" ? `${songs.length} songs` : `${playlists.length} Play list`}
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-theme-sm font-medium ${(activeTab === "media" ? selectedIds.size === 0 : selectedPlaylistIds.size === 0)
                ? "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800"
                }`}
            >
              <TrashBinIcon
                className={`w-4 h-4 ${(activeTab === "media" ? selectedIds.size === 0 : selectedPlaylistIds.size === 0) ? "text-gray-300" : "text-gray-500"
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

      {/* ========= TAB: MEDIA ========= */}
      {activeTab === "media" && (
        <>
          <div className="rounded-xl border border-gray-200 bg-white">
            {/* Loading / error state */}
            {loadingSongs && (
              <div className="px-6 py-8 text-sm text-gray-500">Loading songs…</div>
            )}
            {!!songsError && !loadingSongs && (
              <div className="px-6 py-8 text-sm text-red-600">Failed to load songs: {songsError}</div>
            )}

            {!loadingSongs && !songsError && (
              <>
                <div className="divide-y divide-gray-100">
                  {filteredSongs.map((song) => (
                    <div key={song.id} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={selectedIds.has(song.id)}
                          onChange={(checked) => {
                            const next = new Set(selectedIds);
                            if (checked) next.add(song.id);
                            else next.delete(song.id);
                            setSelectedIds(next);
                          }}
                          className="w-4 h-4 text-indigo-600 rounded"
                        />

                        <div className="w-14 h-14 rounded-lg overflow-hidden">
                          <Image src={song.cover} width={56} height={56} alt={song.title} className="object-cover" />
                        </div>

                        <div>
                          <div className="font-semibold text-gray-800 text-sm">{song.title}</div>
                          <div className="text-gray-500 text-xs mt-1">
                            {song.artist} &nbsp;|&nbsp; {song.duration} mins
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          aria-label="play"
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-500 text-white shadow"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
                          </svg>
                        </button>

                        <button aria-label="more" className="p-2 text-gray-400 hover:text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredSongs.length === 0 && (
                    <div className="px-6 py-8 text-sm text-gray-500">No songs found.</div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between px-6 py-4">
                  <div className="flex-1 flex justify-center">
                    <PaginationWithTextWitIcon totalPages={10} initialPage={1} />
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* ========= TAB: PLAYLIST ========= */}
      {activeTab === "playlist" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {filteredPlaylists.map((item) => (
            <div key={item.id} className="relative">
              <Link href={`/media/playlist/${item.id}`}>
                <div className="p-4">
                  <div className="w-36 h-36 rounded-lg overflow-hidden">
                    <Image src={item.cover} width={144} height={144} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="mt-4 text-left">
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">{item.name}</h4>
                    <p className="text-xs text-gray-500">
                      {item.artist} &nbsp;|&nbsp; {item.year}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">{item.songs} songs</p>
                  </div>
                </div>

                <div className="border-t border-gray-100" />
              </Link>

              {/* chọn nhiều để xóa */}
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

          <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-6 flex justify-center">
            <PaginationWithTextWitIcon totalPages={10} initialPage={1} />
          </div>
        </div>
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
                {activeTab === "playlist" ? "Add new play list" : "Add new media"}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {activeTab === "playlist" ? "Update your play list details." : "Update your media details."}
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
                      />
                    </label>

                    <div>
                      <div className="mb-2 text-sm text-gray-600">Avatar</div>
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
                      <span className="text-sm text-gray-600 mb-2">Media Name</span>
                      <input
                        value={mediaName}
                        onChange={(e) => setMediaName(e.target.value)}
                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm"
                      />
                    </label>

                    <label className="flex flex-col">
                      <span className="text-sm text-gray-600 mb-2">Link</span>
                      <input
                        value={mediaLink}
                        onChange={(e) => setMediaLink(e.target.value)}
                        className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm"
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
                      <div className="mb-2 text-sm text-gray-600">Dropzone</div>
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
                className="px-4 py-2 rounded-md border border-gray-200 bg-white"
              >
                Close
              </button>

              {activeTab === "playlist" ? (
                <button onClick={handleSavePlaylist} className="px-4 py-2 bg-indigo-600 text-white rounded-md">
                  Add new
                </button>
              ) : (
                <button onClick={handleSaveMedia} className="px-4 py-2 bg-indigo-600 text-white rounded-md">
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

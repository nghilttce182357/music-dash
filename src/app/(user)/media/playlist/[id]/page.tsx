import React from 'react';
import PlaylistDetail from '@/components/playlist/PlaylistDetail';

interface Props { params: { id: string } }

export default function PlaylistIdPage({ params }: Props) {
  return <PlaylistDetail id={params.id} />;
}

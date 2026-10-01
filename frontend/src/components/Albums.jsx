import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, parseTags, tagsToText } from '../api.js';

function AlbumCard({ album, posts, isOwn, onChanged }) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(album.name);
    const [description, setDescription] = useState(album.description);
    const [hashtags, setHashtags] = useState(tagsToText(album.hashtags));
    const [toAdd, setToAdd] = useState('');
    const [error, setError] = useState('');

    const inAlbum = posts.filter((p) => album.posts.includes(p.id));
    const available = posts.filter((p) => !album.posts.includes(p.id));

    async function run(path, method, body) {
        try {
            await api(path, { method, body });
            setError('');
            onChanged();
        } catch (err) {
            setError(err.message);
        }
    }

    async function save(e) {
        e.preventDefault();
        await run(`/albums/${album.id}`, 'PUT', { name, description, hashtags: parseTags(hashtags) });
        setEditing(false);
    }

    return (
        <div className="card flex flex-col gap-2">
            {error && <p className="error">{error}</p>}

            {editing ? (
                <form onSubmit={save} className="flex flex-col gap-2">
                    <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <input className="input" value={hashtags} onChange={(e) => setHashtags(e.target.value)} />
                    <div className="flex gap-2">
                        <button className="btn btn-sm" type="submit">Save</button>
                        <button className="btn btn-sm" type="button" onClick={() => setEditing(false)}>Cancel</button>
                    </div>
                </form>
            ) : (
                <>
                    <h4 className="text-lg font-bold">{album.name}</h4>
                    <p className="text-sm">{album.description}</p>
                    <p className="tag">{(album.hashtags || []).join(' ')}</p>
                </>
            )}

            <div className="flex flex-wrap gap-2">
                {inAlbum.length === 0 && <p className="text-sm text-paper/60">No posts in this album.</p>}
                {inAlbum.map((p) => (
                    <div key={p.id} className="w-20">
                        <Link to={`/post/${p.id}`}>
                            <img className="h-20 w-20 border border-paper/50 object-cover" src={p.image} alt={p.caption} />
                        </Link>
                        {isOwn && (
                            <button className="btn btn-sm btn-danger mt-1 w-full"
                                onClick={() => run(`/albums/${album.id}/posts/${p.id}`, 'DELETE')}>
                                Remove
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {isOwn && (
                <div className="flex flex-wrap items-center gap-2 border-t border-paper/30 pt-2">
                    {available.length > 0 && (
                        <>
                            <select className="input w-auto" value={toAdd} onChange={(e) => setToAdd(e.target.value)}>
                                <option value="">Add a post...</option>
                                {available.map((p) => (
                                    <option key={p.id} value={p.id}>#{p.id} {p.caption.slice(0, 25)}</option>
                                ))}
                            </select>
                            <button className="btn btn-sm" disabled={!toAdd}
                                onClick={() => { run(`/albums/${album.id}/posts/${toAdd}`, 'POST'); setToAdd(''); }}>
                                Add
                            </button>
                        </>
                    )}
                    <button className="btn btn-sm" onClick={() => setEditing(!editing)}>Edit</button>
                    <button className="btn btn-sm btn-danger"
                        onClick={() => window.confirm('Delete this album?') && run(`/albums/${album.id}`, 'DELETE')}>
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

function Albums({ owner, isOwn, posts }) {
    const [albums, setAlbums] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [error, setError] = useState('');

    const load = useCallback(() => {
        api('/albums')
            .then((all) => setAlbums(all.filter((a) => a.username === owner)))
            .catch((err) => setError(err.message));
    }, [owner]);

    useEffect(() => { load(); }, [load]);

    async function create(e) {
        e.preventDefault();
        try {
            await api('/albums', {
                method: 'POST',
                body: { username: owner, name, description, hashtags: parseTags(hashtags) },
            });
            setName(''); setDescription(''); setHashtags(''); setError('');
            load();
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <h3 className="border-b border-paper/40 pb-1 font-bold">Albums ({albums.length})</h3>
            {error && <p className="error">{error}</p>}

            {isOwn && (
                <form onSubmit={create} className="card flex max-w-md flex-col gap-2">
                    <h4 className="font-bold">Create an album</h4>
                    <input className="input" placeholder="Album name" value={name}
                        onChange={(e) => setName(e.target.value)} required />
                    <input className="input" placeholder="Description" value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                    <input className="input" placeholder="#hashtags" value={hashtags}
                        onChange={(e) => setHashtags(e.target.value)} />
                    <button className="btn" type="submit">Create Album</button>
                </form>
            )}

            {albums.length === 0 && <p className="text-sm text-paper/60">No albums yet.</p>}
            <div className="grid gap-4 md:grid-cols-2">
                {albums.map((a) => (
                    <AlbumCard key={a.id} album={a} posts={posts} isOwn={isOwn} onChanged={load} />
                ))}
            </div>
        </div>
    );
}

export default Albums;
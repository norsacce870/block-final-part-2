import { useRef, useState } from 'react'
import { Upload, ImageIcon } from 'lucide-react'
import { STORAGE_URL } from '@/utils/storageUrl'

function PosterUpload({ currentPoster, onChange, hint }) {
    const inputRef = useRef(null)
    const [fileName, setFileName] = useState(null)

    const handleChange = (e) => {
        const file = e.target.files[0]
        setFileName(file ? file.name : null)
        onChange(file || null)
    }

    return (
        <div className="flex items-center gap-4">
            {currentPoster ? (
                <img
                    src={`${STORAGE_URL}${currentPoster}`}
                    alt="Affiche actuelle"
                    className="h-24 w-16 shrink-0 rounded-md object-cover"
                    style={{ border: '1px solid var(--admin-border)' }}
                />
            ) : (
                <div
                    className="flex h-24 w-16 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: 'var(--admin-surface2)', border: '1px solid var(--admin-border)' }}
                >
                    <ImageIcon size={18} style={{ color: 'var(--admin-muted)' }} />
                </div>
            )}

            <div className="flex flex-col gap-1.5">
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    aria-label="Choisir une affiche de film"
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="admin-icon-btn flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium"
                    style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
                >
                    <Upload size={14} />
                    Choisir un fichier
                </button>
                <span className="text-xs" style={{ color: 'var(--admin-muted)' }}>
                    {fileName || hint || 'PNG, JPG ou WEBP — 2 Mo max.'}
                </span>
            </div>
        </div>
    )
}

export default PosterUpload
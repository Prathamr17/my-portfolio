import { useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { Upload, X, Loader2 } from 'lucide-react'
import { getMediaUrl } from '../utils/media'

export default function ImageUploadInput({ name, value, onChange, label, hint, accept = "image/*" }) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    const toastId = toast.loading('Uploading file to Cloudinary...')

    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const uploadedUrl = res.data?.data?.url || res.data?.url
      if (uploadedUrl) {
        onChange({ target: { name, value: uploadedUrl } })
        toast.success('Successfully uploaded file to Cloudinary!', { id: toastId })
      } else {
        toast.error('Upload succeeded but no URL was returned.', { id: toastId })
      }
    } catch (err) {
      console.error('File upload error:', err)
      toast.error(err.response?.data?.message || 'Failed to upload file.', { id: toastId })
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const resolvedSrc = getMediaUrl(value)

  return (
    <div className="input-group image-upload-group">
      {label && <label>{label}</label>}

      <div className="image-upload-control">
        {value ? (
          <div className="image-upload-preview">
            {accept.includes('pdf') || (typeof value === 'string' && value.endsWith('.pdf')) ? (
              <div className="pdf-preview-chip">
                <span>📄 PDF File Uploaded</span>
              </div>
            ) : (
              <img
                src={resolvedSrc}
                alt="Preview"
                className="preview-thumb"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            )}
            <div className="image-url-display">
              <span className="url-text">{value}</span>
            </div>
            <button
              type="button"
              className="btn-clear-img"
              onClick={() => onChange({ target: { name, value: '' } })}
              title="Remove File"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="image-upload-dropzone">
            <label className="upload-btn-label">
              <input
                type="file"
                accept={accept}
                onChange={handleFileChange}
                disabled={uploading}
                style={{ display: 'none' }}
              />
              {uploading ? (
                <>
                  <Loader2 size={16} className="spinner-icon animate-spin" />
                  <span>Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>Choose Image File</span>
                </>
              )}
            </label>
            <span className="upload-or-text">or paste URL below</span>
          </div>
        )}

        <input
          type="text"
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder="https://res.cloudinary.com/... or /uploads/..."
          className="image-url-input"
        />
      </div>
      {hint && <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>{hint}</span>}
    </div>
  )
}

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Check,
  Camera,
  Upload,
  Trash2,
  Crop,
  Briefcase,
  MapPin,
  Calendar,
  Phone,
  FileText,
} from 'lucide-react';
import { UserProfile, OccupationType } from '../types/task';
import { ImageCropperModal } from './ImageCropperModal';

interface EditProfileModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
];

const OCCUPATION_OPTIONS: OccupationType[] = [
  'Pekerja Kantoran',
  'Pelajar',
  'Anak Kuliahan',
  'Pengajar',
  'Ibu/Bapak Rumah Tangga',
  'Freelancer / Wirausaha',
  'Lainnya',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [accountType, setAccountType] = useState(profile.accountType);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(profile.avatarUrl);

  // Optional personal information
  const [occupation, setOccupation] = useState<string>(profile.occupation || 'Pekerja Kantoran');
  const [address, setAddress] = useState<string>(profile.address || '');
  const [age, setAge] = useState<string | number>(profile.age || '');
  const [bio, setBio] = useState<string>(profile.bio || '');
  const [phone, setPhone] = useState<string>(profile.phone || '');

  // Cropper states
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImageForCrop, setRawImageForCrop] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync profile when opened
  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setEmail(profile.email);
      setAccountType(profile.accountType);
      setAvatarUrl(profile.avatarUrl);
      setOccupation(profile.occupation || 'Pekerja Kantoran');
      setAddress(profile.address || '');
      setAge(profile.age || '');
      setBio(profile.bio || '');
      setPhone(profile.phone || '');
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  // Handle local image file upload (PNG/JPG/SVG/WebP)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setRawImageForCrop(result);
        setCropperOpen(true);
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCropComplete = (croppedDataUrl: string) => {
    setAvatarUrl(croppedDataUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Generate initials from name (e.g. "Nadia Putri" -> "NP")
    const parts = name.trim().split(/\s+/);
    const initials = parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();

    onSave({
      name: name.trim(),
      email: email.trim(),
      accountType,
      initials,
      avatarUrl: avatarUrl || undefined,
      occupation: occupation || undefined,
      address: address.trim() || undefined,
      age: age ? String(age).trim() : undefined,
      bio: bio.trim() || undefined,
      phone: phone.trim() || undefined,
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative my-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            Edit Profil &amp; Info Pribadi
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">
            Sesuaikan foto dan data pribadi sesuai kebutuhan Anda.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
            {/* Avatar Picture Section */}
            <div className="flex flex-col items-center justify-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="relative group mb-3">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-100 dark:border-indigo-900/60 bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center shadow-md">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300">
                      {profile.initials}
                    </span>
                  )}
                </div>

                {/* Upload Overlay Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:scale-110 transition-all cursor-pointer"
                  title="Ganti Foto Profil"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </div>

              {/* Action buttons: Upload, Crop, Remove */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Upload Foto Baru</span>
                </button>

                {avatarUrl && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setRawImageForCrop(avatarUrl);
                        setCropperOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors flex items-center gap-1.5"
                      title="Pangkas &amp; Sesuaikan Posisi"
                    >
                      <Crop className="w-3.5 h-3.5" />
                      <span>Pangkas Foto</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAvatarUrl(undefined)}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </>
                )}
              </div>

              {/* Presets */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-medium">Pilihan cepat:</span>
                <div className="flex items-center gap-1.5">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatarUrl(url)}
                      className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${
                        avatarUrl === url
                          ? 'border-indigo-600 scale-105 ring-2 ring-indigo-400/40'
                          : 'border-transparent'
                      }`}
                    >
                      <img src={url} alt={`Preset ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Tipe Akun
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Akun pribadi">Akun pribadi</option>
                  <option value="Akun kerja">Akun kerja</option>
                  <option value="Akun tim">Akun tim</option>
                </select>
              </div>
            </div>

            {/* Optional Personal Information Section */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Informasi Pribadi (Opsional)
                </span>
                <span className="text-[10px] text-slate-400">Dapat diisi nanti</span>
              </div>

              {/* Pekerjaan & Umur */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>Pekerjaan / Status</span>
                  </label>
                  <select
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    {OCCUPATION_OPTIONS.map((occ) => (
                      <option key={occ} value={occ}>
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Umur (Tahun)</span>
                  </label>
                  <input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Contoh: 26 tahun"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Alamat Rumah */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Alamat Rumah / Domisili</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Contoh: Jakarta Selatan, DKI Jakarta"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Nomor Kontak / WhatsApp */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Nomor Telepon / WhatsApp</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812-xxxx-xxxx"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Bio / Catatan Motivasi */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Motto Pribadi / Bio Singkat</span>
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tuliskan tujuan atau kalimat penyemangatmu..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {cropperOpen && (
        <ImageCropperModal
          imageSrc={rawImageForCrop}
          isOpen={cropperOpen}
          onClose={() => setCropperOpen(false)}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
};

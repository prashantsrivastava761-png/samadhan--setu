import React, { useState } from 'react';
import { ProgressUpdate, User } from '../../types';
import { PrimaryButton } from '../common/PrimaryButton';
import { PhotoUploadWithGeoTag } from '../common/PhotoUploadWithGeoTag';
import { Wrench, MapPin, CheckCircle2, X } from 'lucide-react';

interface PostProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemId: string;
  problemTitle: string;
  currentUser: User;
  onSubmitUpdate: (update: Partial<ProgressUpdate>) => void;
}

export const PostProgressModal: React.FC<PostProgressModalProps> = ({
  isOpen,
  onClose,
  problemId,
  problemTitle,
  currentUser,
  onSubmitUpdate
}) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [stage, setStage] = useState<ProgressUpdate['stage']>('groundwork');
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'
  );
  const [geoTag, setGeoTag] = useState<{ lat: number; lng: number; locationName: string }>({
    lat: 23.0532,
    lng: 85.6421,
    locationName: `${currentUser.block || 'Ranchi Sadar'}, ${currentUser.district}`
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out the update title and description.');
      return;
    }

    onSubmitUpdate({
      problemId,
      title,
      description,
      stage,
      date: new Date().toISOString().split('T')[0],
      photoProofUrl: photoUrl,
      geoTag,
      verifiedByQuorum: true,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        tier: currentUser.tier,
        roleTitle: currentUser.expertOrg ? 'Implementing Officer' : 'Community Observer',
        avatar: currentUser.avatar
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0 border border-cyan-200">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Post Ground Progress Update
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1">
              For: {problemTitle}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Project Execution Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
              >
                <option value="survey">Site Survey & Clearance</option>
                <option value="procurement">Material Procurement</option>
                <option value="groundwork">Groundwork & Civil Construction</option>
                <option value="piloted">Pilot Calibration & Testing</option>
                <option value="completed">Work Completed & Handed Over</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Update Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Concrete foundation cured"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Field Description & Status Notes *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the equipment delivered, villagers involved, water test measurements, or completion percentage..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
              required
            />
          </div>

          {/* Photo proof with GPS tag */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ground Evidence Photo (Geo-tagged) *
            </label>
            <PhotoUploadWithGeoTag
              initialPhotoUrl={photoUrl}
              onPhotoSelected={(url, stampedGeo) => {
                setPhotoUrl(url);
                setGeoTag({
                  lat: stampedGeo.lat,
                  lng: stampedGeo.lng,
                  locationName: stampedGeo.address
                });
              }}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <PrimaryButton type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </PrimaryButton>
            <PrimaryButton
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Publish Progress Update
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

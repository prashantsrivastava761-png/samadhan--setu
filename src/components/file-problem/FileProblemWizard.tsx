import React, { useState, useEffect } from 'react';
import { Problem, DomainType, GeoLocation, User } from '../../types';
import { PhotoUploadWithGeoTag } from '../common/PhotoUploadWithGeoTag';
import { PrimaryButton } from '../common/PrimaryButton';
import { DomainTag } from '../common/DomainTag';
import { DOMAIN_CONFIG, JHARKHAND_DISTRICTS, AI_SUGGESTION_KEYWORDS } from '../../data/mockData';
import {
  Camera,
  Mic,
  MicOff,
  MapPin,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Users,
  Layers,
  HelpCircle,
  ThumbsUp,
  Volume2
} from 'lucide-react';

interface FileProblemWizardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  existingProblems: Problem[];
  onSubmitNewProblem: (newProblem: Partial<Problem>) => void;
  onJoinExistingProblem: (problemId: string) => void;
}

export const FileProblemWizard: React.FC<FileProblemWizardProps> = ({
  isOpen,
  onClose,
  currentUser,
  existingProblems,
  onSubmitNewProblem,
  onJoinExistingProblem
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Step 1: Photo & Evidence
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80'
  );
  
  // Step 2: Description & Voice
  const [title, setTitle] = useState<string>('');
  const [titleHindi, setTitleHindi] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [affectedCount, setAffectedCount] = useState<number>(450);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);

  // Step 3: Location Pin
  const [geo, setGeo] = useState<GeoLocation>({
    lat: 23.0532,
    lng: 85.6421,
    address: 'Near Salgadih Gram Panchayat, Tamar Block',
    district: currentUser.district || 'Ranchi',
    block: currentUser.block || 'Tamar',
    pincode: currentUser.pincode || '835225'
  });

  // Step 4: AI Domain Suggestion
  const [suggestedDomain, setSuggestedDomain] = useState<DomainType>('water');
  const [selectedDomain, setSelectedDomain] = useState<DomainType>('water');
  const [aiConfidence, setAiConfidence] = useState<number>(94);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);

  // Step 5: Duplicates detection
  const [duplicateMatches, setDuplicateMatches] = useState<Problem[]>([]);

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

  // Voice recording simulation or real Speech Recognition
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate real Hindi/English audio transcription after 3 seconds
      setTimeout(() => {
        setTitle('Dry borewell and fluorosis issue in Tamar Salgadih tola');
        setTitleHindi('तमाड़ सलगाडीह टोला में चापाकल सूखने और दूषित जल की समस्या');
        setDescription(
          'For 4 months, our deep borewells are yielding fluoride-contaminated water. 180 families and primary school children are suffering from tooth pain and lack of drinking water.'
        );
        setIsRecording(false);
      }, 3500);
    } else {
      setIsRecording(false);
    }
  };

  // AI Domain Suggester based on text heuristics
  const analyzeWithAi = () => {
    setIsAiAnalyzing(true);
    setTimeout(() => {
      const combinedText = `${title} ${description}`.toLowerCase();
      let detectedDomain: DomainType = 'water';

      for (const [kw, dom] of Object.entries(AI_SUGGESTION_KEYWORDS)) {
        if (combinedText.includes(kw)) {
          detectedDomain = dom;
          break;
        }
      }

      setSuggestedDomain(detectedDomain);
      setSelectedDomain(detectedDomain);
      setAiConfidence(88 + Math.floor(Math.random() * 10));
      setIsAiAnalyzing(false);

      // Check for nearby duplicates in the same block/domain
      const duplicates = existingProblems.filter(
        (p) => p.domain === detectedDomain || p.district === geo.district
      );
      setDuplicateMatches(duplicates.slice(0, 2));
    }, 600);
  };

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep === 1 && !photoUrl) {
      alert('Please upload or take a ground photo first.');
      return;
    }
    if (currentStep === 2) {
      if (!title.trim() && !description.trim()) {
        alert('Please provide a title or voice description of the problem.');
        return;
      }
      analyzeWithAi();
    }
    if (currentStep === 4) {
      // If duplicates exist, show Step 5 (duplicate warning)
      if (duplicateMatches.length > 0) {
        setCurrentStep(5);
        return;
      } else {
        handleFinalSubmit();
        return;
      }
    }
    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinalSubmit = () => {
    onSubmitNewProblem({
      title: title || 'Civic Infrastructure Concern',
      titleHindi: titleHindi || 'नागरिक समस्या रिपोर्ट',
      description: description || 'Citizen reported civic grievance requiring intervention.',
      descriptionHindi: titleHindi || 'स्थानीय ग्रामीणों द्वारा दर्ज समस्या।',
      domain: selectedDomain,
      status: 'filed',
      district: geo.district,
      block: geo.block,
      pincode: geo.pincode,
      location: geo,
      photoUrl: photoUrl,
      affectedCount: affectedCount || 250,
      filedBy: {
        id: currentUser.id,
        name: currentUser.name,
        tier: currentUser.tier,
        avatar: currentUser.avatar
      },
      filedAt: new Date().toISOString(),
      upvotes: 1,
      hasUpvoted: true,
      duplicatesCount: 0,
      commentsCount: 0,
      proposalsCount: 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative my-auto">
        {/* Header & Step Tracker */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
              Step {currentStep} of 5 • नया मुद्दा दर्ज करें
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              {currentStep === 1 && '1. Capture Photo / Ground Proof'}
              {currentStep === 2 && '2. Describe the Civic Issue'}
              {currentStep === 3 && '3. Confirm GPS & Location Pin'}
              {currentStep === 4 && '4. AI Categorization & Domain'}
              {currentStep === 5 && '5. Community Duplicates Check'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full my-3 overflow-hidden">
          <div
            className="h-full bg-teal-700 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        {/* STEP 1: Photo / Video Evidence */}
        {currentStep === 1 && (
          <div className="space-y-4 py-2">
            <p className="text-xs text-slate-600">
              Clear photos or videos speed up verification by 3x. Your camera automatically embeds live GPS coordinates onto the proof.
            </p>

            <PhotoUploadWithGeoTag
              initialPhotoUrl={photoUrl}
              initialGeo={geo}
              onPhotoSelected={(url, stampedGeo) => {
                setPhotoUrl(url);
                setGeo(stampedGeo);
              }}
            />
          </div>
        )}

        {/* STEP 2: Description & Mic Input */}
        {currentStep === 2 && (
          <div className="space-y-3.5 py-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Issue Title (समस्या का शीर्षक) *
                </label>
                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    isRecording
                      ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                      : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      Listening ({recordingSeconds}s)... Speak now
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-teal-700" />
                      Speak in Hindi / English (बोलकर लिखें)
                    </>
                  )}
                </button>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Broken water pipeline leaking into road in Tamar"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hindi / Local Translation (हिंदी अनुवाद)
              </label>
              <input
                type="text"
                value={titleHindi}
                onChange={(e) => setTitleHindi(e.target.value)}
                placeholder="तमाड़ में पानी की पाइपलाइन टूटने से जल संकट..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-hindi focus:ring-2 focus:ring-teal-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Description & Impact (विस्तृत विवरण) *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain who is affected, how long the issue has persisted, and if any accidents or health hazards have occurred..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-teal-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimated Number of Affected Citizens (प्रभावित लोगों की संख्या)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="50"
                  max="10000"
                  step="50"
                  value={affectedCount}
                  onChange={(e) => setAffectedCount(Number(e.target.value))}
                  className="flex-1 accent-teal-700 cursor-pointer"
                />
                <span className="w-24 text-center font-bold text-xs bg-slate-100 py-1.5 px-2 rounded-lg border border-slate-300 text-slate-800">
                  {affectedCount.toLocaleString()} people
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Map Pin & Location Confirmation */}
        {currentStep === 3 && (
          <div className="space-y-3.5 py-2">
            <div className="p-3 rounded-2xl bg-teal-50/80 border border-teal-200 text-xs flex items-center gap-2 text-teal-900">
              <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
              <span>
                Coordinates auto-detected from photo GPS. Confirm or adjust your Gram Panchayat below:
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  District (ज़िला) *
                </label>
                <select
                  value={geo.district}
                  onChange={(e) => setGeo({ ...geo, district: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-teal-700 focus:outline-none"
                >
                  {JHARKHAND_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pincode (पिनकोड) *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={geo.pincode}
                  onChange={(e) => setGeo({ ...geo, pincode: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-teal-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Block / Tehsil (प्रखंड)
                </label>
                <input
                  type="text"
                  value={geo.block || ''}
                  onChange={(e) => setGeo({ ...geo, block: e.target.value })}
                  placeholder="e.g. Tamar, Ormanjhi, Topchanchi"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Exact Landmark / Village
                </label>
                <input
                  type="text"
                  value={geo.address}
                  onChange={(e) => setGeo({ ...geo, address: e.target.value })}
                  placeholder="Ward No., Panchayat, Landmark"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-none"
                />
              </div>
            </div>

            {/* GPS coordinates preview */}
            <div className="p-2.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] flex justify-between items-center">
              <span>Latitude: {geo.lat.toFixed(4)}° N</span>
              <span>Longitude: {geo.lng.toFixed(4)}° E</span>
              <span className="text-emerald-400 font-sans font-bold">Accuracy: ±4m</span>
            </div>
          </div>
        )}

        {/* STEP 4: AI Domain Suggestion & Chips */}
        {currentStep === 4 && (
          <div className="space-y-4 py-2">
            {/* AI Assistant Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-teal-50 border border-purple-200 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-purple-700 text-white shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                  AI Domain Classification Engine ({aiConfidence}% Match)
                </h4>
                <p className="text-[11px] text-purple-900 leading-relaxed">
                  Based on your ground report keywords and location, this issue has been tagged under{' '}
                  <strong className="underline">{DOMAIN_CONFIG[suggestedDomain]?.label}</strong>.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Selected Domain Category (Click to modify if needed):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(DOMAIN_CONFIG).map(([dKey, dConf]) => {
                  const isSelected = selectedDomain === dKey;
                  return (
                    <button
                      key={dKey}
                      type="button"
                      onClick={() => setSelectedDomain(dKey as DomainType)}
                      className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-teal-700 bg-teal-50 text-teal-950 ring-2 ring-teal-700/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <DomainTag domain={dKey as DomainType} size="sm" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {dConf.hindi}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Duplicate Warning Screen */}
        {currentStep === 5 && (
          <div className="space-y-4 py-2">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-900">
                  Similar Existing Grievances Found in {geo.district}!
                </h4>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Joining an existing problem consolidates community petition votes and fast-tracks government / university funding faster than filing duplicate tickets.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {duplicateMatches.map((dup) => (
                <div
                  key={dup.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-teal-600 transition-all flex items-start justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <DomainTag domain={dup.domain} size="sm" />
                      <span className="text-[11px] text-slate-500 font-semibold">
                        {dup.block}, {dup.district}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {dup.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      👥 {dup.affectedCount.toLocaleString()} affected • 👍 {dup.upvotes} supporters
                    </p>
                  </div>

                  <PrimaryButton
                    variant="primary"
                    size="sm"
                    leftIcon={<ThumbsUp className="w-3.5 h-3.5" />}
                    onClick={() => {
                      onJoinExistingProblem(dup.id);
                      onClose();
                    }}
                  >
                    Join Instead
                  </PrimaryButton>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <p className="text-[11px] text-slate-500 mb-2">
                Is your problem distinct and in a different location?
              </p>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="text-xs font-bold text-teal-800 hover:underline"
              >
                Continue Submitting as a New Issue →
              </button>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
          {currentStep > 1 ? (
            <PrimaryButton
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              onClick={handleBack}
            >
              Back
            </PrimaryButton>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <PrimaryButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </PrimaryButton>

            {currentStep < 4 ? (
              <PrimaryButton
                type="button"
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={handleNext}
              >
                Continue
              </PrimaryButton>
            ) : currentStep === 4 ? (
              <PrimaryButton
                type="button"
                variant="accent"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={handleNext}
              >
                Verify Duplicates & Submit
              </PrimaryButton>
            ) : (
              <PrimaryButton
                type="button"
                variant="primary"
                size="sm"
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                onClick={handleFinalSubmit}
              >
                Submit As Unique Issue
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

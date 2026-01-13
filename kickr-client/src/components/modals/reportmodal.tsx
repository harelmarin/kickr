import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reportService } from '../../services/reportservice';
import type { ReportReason, ReportType } from '../../services/reportservice';
import toast from 'react-hot-toast';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetType: ReportType;
    targetId: string;
}

const REASONS: { label: string; value: ReportReason }[] = [
    { label: 'Spam', value: 'SPAM' },
    { label: 'Inappropriate Language', value: 'INAPPROPRIATE_LANGUAGE' },
    { label: 'Harassment', value: 'HARASSMENT' },
    { label: 'Other', value: 'OTHER' },
];

export const ReportModal = ({ isOpen, onClose, targetType, targetId }: ReportModalProps) => {
    const [reason, setReason] = useState<ReportReason>('SPAM');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await reportService.createReport({
                targetType,
                targetId,
                reason,
                description
            });
            toast.success('Report submitted successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to submit report');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-[#14181c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                >
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Report Content</h2>
                                <p className="text-[10px] text-[#667788] uppercase tracking-[0.2em] font-bold mt-1">Help us keep Kickr safe</p>
                            </div>
                            <button onClick={onClose} className="text-[#667788] hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-kickr uppercase tracking-widest">Reason</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {REASONS.map((r) => (
                                        <button
                                            key={r.value}
                                            type="button"
                                            onClick={() => setReason(r.value)}
                                            className={`py-3 px-4 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all text-left ${reason === r.value
                                                ? 'bg-kickr/15 border-kickr/30 text-kickr'
                                                : 'bg-black/20 border-white/5 text-[#667788] hover:border-white/10'
                                                }`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-kickr uppercase tracking-widest">Description (Optional)</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Provide more context..."
                                    className="w-full bg-black/20 border border-white/5 rounded-lg p-4 text-[13px] text-white focus:outline-none focus:border-kickr/30 min-h-[120px] transition-all resize-none"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-4 text-[11px] font-black uppercase tracking-widest text-[#667788] hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-4 bg-kickr text-black text-[11px] font-black uppercase tracking-widest rounded-lg hover:scale-[1.02] transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

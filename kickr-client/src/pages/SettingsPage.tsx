import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { EmptyState } from '../components/ui/EmptyState';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const profileSchema = z.object({
    name: z.string().min(3, "Callsign must be at least 3 characters").max(10, "Callsign must be less than 10 characters"),
    email: z.string().email("Please enter a valid tactical email").max(100, "Email is too long"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const SettingsPage = () => {
    const { user, updateUser } = useAuth();
    const queryClient = useQueryClient();
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty }
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
        }
    });

    useEffect(() => {
        if (user) {
            reset({
                name: user.name || '',
                email: user.email || ''
            });
        }
    }, [user, reset]);

    if (!user) {
        return (
            <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
                <EmptyState
                    icon="🔒"
                    title="Access Restricted"
                    description="You need to be authenticated to access tactical settings."
                    actionLabel="Login / Register"
                    onAction={() => window.location.href = '/register'}
                />
            </div>
        );
    }

    const refreshTacticalData = () => {
        queryClient.invalidateQueries({ queryKey: ['user', user.id] });
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['userMatches'] });
        queryClient.invalidateQueries({ queryKey: ['following'] });
        queryClient.invalidateQueries({ queryKey: ['followers'] });
    };

    const onSubmit = async (data: ProfileFormData) => {
        if (data.name === user.name && data.email === user.email) {
            toast('No changes detected', { icon: 'ℹ️' });
            return;
        }

        setIsSaving(true);
        const saveToast = toast.loading('Syncing tactical data...');

        try {
            const updatedUser = await userService.updateProfile(data);
            updateUser(updatedUser);
            refreshTacticalData();
            toast.success('Profile identification updated', { id: saveToast });
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update credentials';
            toast.error(message, { id: saveToast });
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be under 5MB');
            return;
        }

        setIsUploading(true);
        const uploadToast = toast.loading('Uploading tactical avatar...');

        try {
            const updatedUser = await userService.uploadAvatar(file);
            updateUser(updatedUser);

            // Force refresh of cached tactical data
            refreshTacticalData();

            toast.success('Profile signature updated', { id: uploadToast });

            // OPTIONAL: The user asked to force a refresh. 
            // We'll do it after a short delay so the toast stays visible.
            setTimeout(() => {
                window.location.reload();
            }, 800);

        } catch (error) {
            toast.error('Failed to sync avatar', { id: uploadToast });
        } finally {
            setIsUploading(false);
            // RESET FILE INPUT - Critical to allow re-uploading the same file
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDeleteAvatar = async () => {
        if (!window.confirm('Remove your profile signature?')) return;

        setIsUploading(true);
        const deleteToast = toast.loading('Deleting avatar...');

        try {
            const updatedUser = await userService.deleteAvatar();
            updateUser(updatedUser);
            refreshTacticalData();
            toast.success('Signature reverted to default', { id: deleteToast });

            // Force refresh as requested
            setTimeout(() => {
                window.location.reload();
            }, 800);
        } catch (error) {
            toast.error('Failed to remove signature', { id: deleteToast });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-32 pb-20 px-4 max-w-xl mx-auto"
        >
            <div className="mb-12 border-b border-white/5 pb-8 relative">
                <div className="absolute top-0 left-0 w-8 h-[1px] bg-kickr"></div>
                <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">
                    Tactical <span className="text-kickr">Parameters</span>
                </h1>
                <p className="text-[#445566] font-black uppercase tracking-[0.4em] text-[9px] italic">
                    Central User Identification Node
                </p>
            </div>

            <div className="space-y-8">
                {/* 1. Identity & Avatar Section */}
                <section className="bg-white/[0.02] border border-white/5 rounded-sm p-10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-kickr/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-sm overflow-hidden border border-white/10 p-1 bg-black/40">
                                <div className="w-full h-full rounded-sm overflow-hidden relative">
                                    {user.avatarUrl ? (
                                        <img
                                            key={user.avatarUrl}
                                            src={user.avatarUrl}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                            <span className="text-4xl font-black text-kickr italic italic">{user.name[0].toUpperCase()}</span>
                                        </div>
                                    )}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                                            <div className="w-5 h-5 border border-kickr/20 border-t-kickr rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="absolute -bottom-3 -right-3 bg-kickr text-black w-10 h-10 rounded-sm flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50 border-[6px] border-[#0a0b0d] shadow-xl shadow-kickr/10"
                                title="Upload Signal"
                            >
                                <span className="text-sm">⚡</span>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div>
                                <h2 className="text-white font-black text-xl italic uppercase tracking-tighter leading-none mb-1">
                                    Visual ID
                                </h2>
                                <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em] italic">
                                    Biometric recognition signature
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-[9px] font-black text-white/40 hover:text-kickr uppercase tracking-[0.4em] transition-all italic"
                                >
                                    [ UPDATE RECORD ]
                                </button>
                                {user.avatarUrl && (
                                    <button
                                        onClick={handleDeleteAvatar}
                                        className="text-[9px] font-black text-red-500/40 hover:text-red-500 uppercase tracking-[0.4em] transition-all italic"
                                    >
                                        [ PURGE DATA ]
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Credentials Form */}
                <section className="bg-white/[0.02] border border-white/5 rounded-sm overflow-hidden">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] px-1 italic">Tactician Callsign</label>
                                <input
                                    type="text"
                                    {...register("name")}
                                    className={`w-full bg-black/40 border ${errors.name ? 'border-red-500/30' : 'border-white/5'} rounded-sm px-5 py-4 text-sm text-white focus:border-kickr/30 outline-none transition-all italic font-medium tracking-tight`}
                                />
                                {errors.name && (
                                    <p className="text-[9px] text-red-500 font-black mt-2 pl-1 uppercase tracking-tighter italic">{errors.name.message}</p>
                                )}
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] px-1 italic">Communication Link</label>
                                <input
                                    type="email"
                                    {...register("email")}
                                    className={`w-full bg-black/40 border ${errors.email ? 'border-red-500/30' : 'border-white/5'} rounded-sm px-5 py-4 text-sm text-white focus:border-kickr/30 outline-none transition-all italic font-medium tracking-tight`}
                                />
                                {errors.email && (
                                    <p className="text-[9px] text-red-500 font-black mt-2 pl-1 uppercase tracking-tighter italic">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full ${isSaving ? 'bg-kickr animate-pulse shadow-[0_0_8px_rgba(var(--kickr-rgb),0.5)]' : (isDirty ? 'bg-kickr/40' : 'bg-white/10')}`}></div>
                                <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em] italic">
                                    {isDirty ? 'Awaiting Commit' : 'System Synced'}
                                </span>
                            </div>
                            <button
                                type="submit"
                                disabled={isSaving || isUploading || !isDirty}
                                className="bg-kickr text-black text-[10px] font-black uppercase tracking-[0.3em] px-10 py-4 rounded-sm hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-20 italic shadow-lg shadow-kickr/5"
                            >
                                {isSaving ? 'SYNCING...' : 'SAVE PARAMETERS'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* 3. Dangerous Zone */}
                <section className="p-10 flex items-center justify-between opacity-10 hover:opacity-100 transition-opacity border border-dashed border-red-500/20 rounded-sm bg-red-500/[0.01]">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-red-500 font-black text-[10px] uppercase tracking-[0.4em] italic">System Decommission</h4>
                        <p className="text-white/20 text-[8px] font-black uppercase tracking-widest leading-none italic">Irreversible authentication purge</p>
                    </div>
                    <button className="text-[9px] font-black text-white/40 hover:text-red-500 uppercase tracking-[0.4em] transition-all italic">
                        [ EXECUTE ]
                    </button>
                </section>
            </div>
        </motion.main>
    );
};

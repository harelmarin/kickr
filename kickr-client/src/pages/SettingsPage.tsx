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
            <div className="mb-10">
                <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">
                    Tactical <span className="text-kickr">Settings</span>
                </h1>
                <p className="text-[#556677] font-black uppercase tracking-widest text-[9px]">
                    User Identification Parameters
                </p>
            </div>

            <div className="space-y-6">
                {/* 1. Identity & Avatar Section */}
                <section className="bg-[#14181c] border border-white/5 rounded-xl p-8">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="relative">
                            <div className="w-28 h-28 rounded-xl overflow-hidden border border-white/10 p-1 bg-[#0a0b0d]">
                                <div className="w-full h-full rounded-lg overflow-hidden relative">
                                    {user.avatarUrl ? (
                                        <img
                                            key={user.avatarUrl}
                                            src={user.avatarUrl}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                            <span className="text-3xl font-black text-kickr italic">{user.name[0].toUpperCase()}</span>
                                        </div>
                                    )}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <div className="w-4 h-4 border-2 border-kickr border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="absolute -bottom-2 -right-2 bg-kickr text-[#0a1b28] w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#00aaff] transition-colors disabled:opacity-50 border-4 border-[#14181c]"
                            >
                                <span className="text-xs">📸</span>
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
                                <h2 className="text-white font-black text-lg italic uppercase tracking-tight leading-none mb-1">
                                    Photo Identification
                                </h2>
                                <p className="text-[#445566] text-[8px] font-black uppercase tracking-widest">
                                    Official field biometric data
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-[9px] font-black text-white hover:text-kickr uppercase tracking-widest transition-colors"
                                >
                                    Update Picture
                                </button>
                                {user.avatarUrl && (
                                    <button
                                        onClick={handleDeleteAvatar}
                                        className="text-[9px] font-black text-[#ff4444]/60 hover:text-[#ff4444] uppercase tracking-widest transition-colors"
                                    >
                                        Remove Record
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Credentials Form */}
                <section className="bg-[#14181c] border border-white/5 rounded-xl">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-[#445566] uppercase tracking-widest px-1">Tactician Callsign</label>
                                <input
                                    type="text"
                                    {...register("name")}
                                    className={`w-full bg-[#0a0b0d] border ${errors.name ? 'border-red-500/50' : 'border-white/5'} rounded-lg px-4 py-3 text-sm text-white focus:border-kickr/30 outline-none transition-all`}
                                />
                                {errors.name && (
                                    <p className="text-[10px] text-red-500 font-bold mt-1 pl-1 uppercase tracking-tighter">{errors.name.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-[#445566] uppercase tracking-widest px-1">Encrypted Email</label>
                                <input
                                    type="email"
                                    {...register("email")}
                                    className={`w-full bg-[#0a0b0d] border ${errors.email ? 'border-red-500/50' : 'border-white/5'} rounded-xl px-4 py-3 text-sm text-white focus:border-kickr/30 outline-none transition-all`}
                                />
                                {errors.email && (
                                    <p className="text-[10px] text-red-500 font-bold mt-1 pl-1 uppercase tracking-tighter">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-1 h-1 rounded-full ${isSaving ? 'bg-kickr animate-pulse' : (isDirty ? 'bg-kickr/40' : 'bg-white/10')}`}></div>
                                <span className="text-[8px] font-black text-[#334455] uppercase tracking-widest">
                                    {isDirty ? 'Changes ready' : 'Synced'}
                                </span>
                            </div>
                            <button
                                type="submit"
                                disabled={isSaving || isUploading || !isDirty}
                                className="bg-white text-[#0a1b28] text-[9px] font-black uppercase tracking-widest px-8 py-3 rounded-lg hover:bg-kickr hover:text-white transition-all disabled:opacity-20"
                            >
                                {isSaving ? 'Syncing...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* 3. Dangerous Zone */}
                <section className="p-8 flex items-center justify-between border-t border-white/5 opacity-30 hover:opacity-100 transition-opacity">
                    <h4 className="text-[#445566] font-black text-[8px] uppercase tracking-widest">Decommission Account</h4>
                    <button className="text-[9px] font-black text-[#ff4444]/60 hover:text-[#ff4444] uppercase tracking-widest">
                        Execute
                    </button>
                </section>
            </div>
        </motion.main>
    );
};

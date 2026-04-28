export default function CarCardSkeleton() {
    return (
        <div className="bg-surface rounded-xl overflow-hidden border border-white/5 flex flex-col animate-pulse">
            {/* Image placeholder */}
            <div className="h-56 w-full bg-white/5" />

            <div className="p-5 flex flex-col gap-4 -mt-10 relative z-10">
                <div className="h-6 bg-white/5 rounded-md w-3/4" />
                <div className="h-4 bg-white/5 rounded-md w-1/3" />

                <div className="flex gap-4">
                    <div className="h-4 bg-white/5 rounded w-14" />
                    <div className="h-4 bg-white/5 rounded w-20" />
                    <div className="h-4 bg-white/5 rounded w-12" />
                </div>

                <div className="mt-auto pt-4 border-t border-white/5">
                    <div className="h-7 bg-white/5 rounded-md w-2/5" />
                </div>
            </div>
        </div>
    );
}

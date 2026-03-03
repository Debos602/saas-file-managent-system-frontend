

export function Loading() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-dvh space-y-4">
            <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3e50f4] border-t-transparent border-b-transparent"></div>
                <div className="absolute top-0 left-0 animate-spin rounded-full h-12 w-12 border-4 border-[#3e50f4] border-opacity-50 border-l-transparent border-r-transparent" style={{ animationDirection: "reverse", animationDuration: "3s" }}></div>
            </div>
            <p className="text-[#3e50f4] font-semibold text-lg animate-pulse">Loading...</p>
        </div>
    );
}
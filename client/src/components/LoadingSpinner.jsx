export default function LoadingSpinner({ fullScreen = false, size = 'md', label }) {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-[3px]' };

  const spinner = (
    <div className={`animate-spin rounded-full border-sky-200 border-t-sky-500 ${sizes[size]}`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50 gap-4">
        <div className="animate-spin rounded-full border-[3px] border-sky-100 border-t-sky-500 h-10 w-10" />
        <p className="text-sm text-gray-400">{label || 'Loading…'}</p>
      </div>
    );
  }

  if (label) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        {spinner}
        <p className="text-sm text-gray-400">{label}</p>
      </div>
    );
  }

  return <div className="flex items-center justify-center py-8">{spinner}</div>;
}

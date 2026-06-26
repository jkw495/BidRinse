export default function StarRating({ rating, count, size = 'sm', interactive = false, onChange }) {
  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${sizes[size]} ${interactive ? 'cursor-pointer' : ''} ${
            star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => interactive && onChange?.(star)}
        >
          ★
        </span>
      ))}
      {count !== undefined && (
        <span className="text-gray-500 text-xs ml-1">({count})</span>
      )}
    </div>
  );
}

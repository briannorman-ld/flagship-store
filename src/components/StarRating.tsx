interface StarRatingProps {
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md'
}

export default function StarRating({ rating, reviewCount, size = 'sm' }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(rating)
    const half = !filled && i < rating
    return { filled, half }
  })

  const starSize = size === 'sm' ? 'text-sm' : 'text-base'

  return (
    <div className="flex items-center gap-1">
      <div className={`flex ${starSize}`}>
        {stars.map((s, i) => (
          <span key={i} className={s.filled ? 'text-yellow-400' : s.half ? 'text-yellow-300' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-gray-500">({reviewCount})</span>
      )}
    </div>
  )
}

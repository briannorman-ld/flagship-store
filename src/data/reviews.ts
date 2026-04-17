import type { Review } from '../types'

const reviewPool: Omit<Review, 'id' | 'productId'>[] = [
  { author: 'James T.', rating: 5, title: 'Excellent quality', body: 'This flag exceeded my expectations. The colors are vibrant and it flies beautifully in the wind. Very happy with my purchase.', date: '2024-03-12' },
  { author: 'Sarah M.', rating: 5, title: 'Perfect for our flagpole', body: 'Great quality flag. The material feels durable and the grommets are solid brass. Will definitely order again.', date: '2024-02-28' },
  { author: 'Robert K.', rating: 4, title: 'Very nice flag', body: 'Good quality and fast shipping. The colors are true to the photo. Slight fraying after a few weeks in high winds but still looks great.', date: '2024-01-15' },
  { author: 'Linda P.', rating: 5, title: 'Beautiful and well made', body: 'Bought this as a gift and the recipient was thrilled. Beautifully crafted with attention to detail.', date: '2024-03-05' },
  { author: 'Michael D.', rating: 5, title: 'Highly recommend', body: 'Perfect size, great colors, and ships fast. This is the third flag I have bought from FlagShip and they never disappoint.', date: '2024-02-10' },
  { author: 'Carol W.', rating: 4, title: 'Great product', body: 'The flag looks great hanging on my porch. Material seems durable. Only minor complaint is the packaging could be better.', date: '2024-01-30' },
  { author: 'David R.', rating: 5, title: 'Top notch', body: 'Exactly as described. Vibrant colors, strong stitching, and the size is perfect. Great value for the price.', date: '2024-03-18' },
  { author: 'Jennifer S.', rating: 5, title: 'Love it!', body: "Bought this for my father and he absolutely loves it. Great quality and the colors haven't faded at all after months outside.", date: '2024-02-22' },
  { author: 'Thomas B.', rating: 4, title: 'Solid purchase', body: 'Good quality flag at a fair price. Looks great on my pole. I would have given 5 stars but shipping took a bit longer than expected.', date: '2024-01-08' },
  { author: 'Patricia H.', rating: 5, title: 'Exceeded expectations', body: 'The quality is outstanding. Much better than flags I have purchased elsewhere. Will be a repeat customer.', date: '2024-03-01' },
]

export function getReviewsForProduct(productId: string): Review[] {
  // Use product id hash to pick consistent reviews per product
  const hash = productId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const reviews: Review[] = []
  for (let i = 0; i < 3; i++) {
    const pool = reviewPool[(hash + i * 3) % reviewPool.length]
    reviews.push({
      id: `${productId}-review-${i}`,
      productId,
      ...pool,
    })
  }
  return reviews
}

"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { devToast } from "@/lib/toast";

interface ReviewData {
  _id: string;
  rating: number;
  comment: string;
  reviewerName?: string;
  city?: string;
}

interface BookingReviewFormProps {
  bookingId: string;
  templeId: string;
  initialReview: ReviewData | null;
  defaultReviewerName?: string;
  defaultCity?: string;
}

export function BookingReviewForm({
  bookingId,
  templeId,
  initialReview,
  defaultReviewerName = "",
  defaultCity = "",
}: BookingReviewFormProps) {
  const [review, setReview] = useState<ReviewData | null>(initialReview);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState(defaultReviewerName);
  const [city, setCity] = useState(defaultCity);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewerName.trim()) {
      devToast.error("Please enter your name");
      return;
    }
    if (!city.trim()) {
      devToast.error("Please enter your city");
      return;
    }
    if (!comment.trim()) {
      devToast.error("Please enter a comment");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          templeId,
          rating,
          comment,
          reviewerName,
          city,
        }),
      });

      const data = await res.json();
      if (data.success) {
        devToast.success("Review submitted successfully! 🙏");
        setReview(data.data);
      } else {
        devToast.error(data.error || "Failed to submit review");
      }
    } catch {
      devToast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (review) {
    return (
      <div className="card-devotional border-green-500/20 bg-green-500/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading text-lg text-foreground mb-0">Your Review</h2>
          {review.city && (
            <span className="text-xs text-muted-foreground bg-saffron/10 text-saffron px-2.5 py-0.5 rounded-full font-medium border border-saffron/20">
              📍 {review.city}
            </span>
          )}
        </div>
        {review.reviewerName && (
          <p className="text-xs text-saffron font-bold mb-1.5">Submitted as: {review.reviewerName}</p>
        )}
        <div className="flex gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={18}
              className={i < review.rating ? "fill-saffron text-saffron" : "text-muted"}
            />
          ))}
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
      </div>
    );
  }

  return (
    <div className="card-devotional">
      <h2 className="font-heading text-lg text-foreground mb-2">Share Your Experience</h2>
      <p className="text-xs text-muted-foreground mb-4">How was the puja ritual? Let other devotees know.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Selector */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = hoverRating !== null ? star <= hoverRating : star <= rating;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="transition-transform duration-100 hover:scale-110"
                >
                  <Star
                    size={28}
                    className={
                      active ? "fill-saffron text-saffron" : "text-muted-foreground/30 stroke-[1.5]"
                    }
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Name & City Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Your Name (for testimonial)"
            required
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder="E.g., Ramesh Patel"
          />
          <Input
            label="Your City"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="E.g., Mumbai, Delhi"
          />
        </div>

        {/* Comment Textarea */}
        <Textarea
          label="Your Comment"
          required
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Describe your spiritual experience, pandit ji's chanting, prasad quality, etc..."
        />

        <Button type="submit" loading={submitting} fullWidth>
          {submitting ? "Submitting Review..." : "Submit Review 🙏"}
        </Button>
      </form>
    </div>
  );
}
